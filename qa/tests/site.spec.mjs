import { test, expect } from '@playwright/test';

const password = 'BrowserTest-Pass-2026!';
const suffix = Date.now();

async function session(request, role) {
  const email = `qa-${role}-${suffix}@example.test`;
  const response = await request.post('/api/register', { data: { name: `QA ${role}`, email, password, role } });
  expect(response.status()).toBe(201);
  return { ...(await response.json()), email };
}

async function authenticate(page, token) {
  await page.goto('/login');
  await page.evaluate(value => localStorage.setItem('auth_token', value), token);
}

test('public pages, assets, API and direct links render on desktop and mobile', async ({ page, request }) => {
  test.setTimeout(120000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  expect((await request.get('/api/health')).ok()).toBeTruthy();
  for (const route of ['/', '/jobs', '/about', '/contact', '/login', '/register', '/admin/login']) {
    const response = await page.goto(route);
    expect(response.status(), route).toBe(200);
    await expect(page.locator('#root')).not.toBeEmpty();
    await expect(page.locator('h1,h2').first()).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('h1').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBeTruthy();
  expect(errors).toEqual([]);
});

test('registration form creates a real seeker account and guarded routes survive refresh', async ({ page }) => {
  await page.goto('/register');
  await page.getByPlaceholder('e.g. John Doe').fill('Browser Candidate');
  await page.locator('input[type=email]').fill(`qa-ui-${suffix}@example.test`);
  await page.locator('input[type=password]').fill(password);
  await page.locator('button[type=submit]').click();
  await expect(page).toHaveURL(/\/seeker\/dashboard/);
  await page.reload();
  await expect(page).toHaveURL(/\/seeker\/dashboard/);
  await expect(page.locator('h1').first()).toBeVisible();
  await page.goto('/admin/users');
  await expect(page.getByRole('heading', { name: 'Access Restricted' })).toBeVisible();
});

test('recruiter posts through the UI; administrator approves; candidate applies; all role pages render', async ({ page, request }) => {
  test.setTimeout(240000);
  test.skip(!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD, 'Administrator credentials are required for full workflow verification.');
  const recruiter = await session(request, 'recruiter');
  const seeker = await session(request, 'seeker');
  const adminResponse = await request.post('/api/login', { data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, role: 'admin' } });
  expect(adminResponse.ok()).toBeTruthy();
  const admin = await adminResponse.json();
  const adminHeaders = { Authorization: `Bearer ${admin.token}` };
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await authenticate(page, recruiter.token);
    await page.goto('/recruiter/profile');
    await expect(page.getByRole('button', { name: 'Save All Changes' })).toBeVisible();
    const [profileSaved] = await Promise.all([
      page.waitForResponse(response => response.url().endsWith('/api/profile') && response.request().method() === 'POST'),
      page.getByRole('button', { name: 'Save All Changes' }).click(),
    ]);
    expect(profileSaved.status(), await profileSaved.text()).toBe(200);
    await page.goto('/recruiter/jobs/create');
    await page.getByPlaceholder('e.g. Senior Frontend Engineer').fill(`QA browser listing ${suffix}`);
    await page.getByPlaceholder('Outline role responsibilities, key projects, and team background...').fill('A browser-tested course demonstration opportunity.');
    await page.getByRole('button', { name: 'Publish Opportunity Now' }).click();
    await expect(page.getByText('Listing Submitted for Review')).toBeVisible();
    const jobs = await (await request.get('/api/jobs', { headers: { Authorization: `Bearer ${recruiter.token}` } })).json();
    const job = jobs.data.find(item => item.title === `QA browser listing ${suffix}`);
    expect(job.status).toBe('Pending');
    expect((await request.put(`/api/jobs/${job.id}`, { headers: adminHeaders, data: { status: 'Active' } })).ok()).toBeTruthy();
    await page.goto('/recruiter/advertisements');
    await page.getByRole('button', { name: 'Create Advertisement' }).click();
    await page.getByPlaceholder('e.g. Annual Global Engineering Hackathon').fill(`QA demo advertisement ${suffix}`);
    await page.getByPlaceholder('https://company.com/event').fill('https://example.com');
    await page.getByRole('button', { name: /Proceed to .*Checkout/ }).click();
    await expect(page.getByRole('heading', { name: 'Demo checkout' })).toBeVisible();
    const [advertisementSaved] = await Promise.all([
      page.waitForResponse(response => response.url().endsWith('/api/advertisements') && response.request().method() === 'POST'),
      page.getByRole('button', { name: 'Confirm demo transaction' }).click(),
    ]);
    expect(advertisementSaved.status(), await advertisementSaved.text()).toBe(201);
    await authenticate(page, seeker.token);
    await page.goto('/seeker/profile');
    await expect(page.locator('h1').first()).toBeVisible();
    const [resumeSaved] = await Promise.all([
      page.waitForResponse(response => response.url().endsWith('/api/profile/upload-resume')),
      page.locator('input[type=file][accept=".pdf"]').first().setInputFiles({ name: 'qa-resume.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\n1 0 obj << /Type /Catalog >> endobj\n%%EOF') }),
    ]);
    expect(resumeSaved.status(), await resumeSaved.text()).toBe(200);
    const [candidateSaved] = await Promise.all([
      page.waitForResponse(response => response.url().endsWith('/api/profile') && response.request().method() === 'POST'),
      page.getByRole('button', { name: 'Save Profile Changes' }).first().click(),
    ]);
    expect(candidateSaved.status(), await candidateSaved.text()).toBe(200);
    expect((await request.post('/api/applications', { headers: { Authorization: `Bearer ${seeker.token}` }, data: { listing_id: job.id, candidate_name: seeker.user.name, candidate_email: seeker.email, cover_letter: 'A verified application.' } })).status()).toBe(201);
    for (const roleSession of [
      { token: recruiter.token, routes: ['/recruiter/dashboard', '/recruiter/profile', '/recruiter/jobs', '/recruiter/applicants', '/recruiter/pipeline', '/recruiter/tasks', '/recruiter/interviews', '/recruiter/boosted', '/recruiter/payments', '/recruiter/advertisements'] },
      { token: seeker.token, routes: ['/seeker/dashboard', '/seeker/profile', '/seeker/applications', '/seeker/tasks', '/seeker/interviews', '/seeker/saved', '/seeker/notifications'] },
      { token: admin.token, routes: ['/admin/dashboard', '/admin/users', '/admin/jobs', '/admin/categories', '/admin/featured', '/admin/boost-pricing', '/admin/payments', '/admin/complaints', '/admin/settings', '/admin/advertisements', '/admin/ad-pricing'] },
    ]) {
      await authenticate(page, roleSession.token);
      for (const route of roleSession.routes) {
        await page.goto(route);
        await expect(page.locator('h1').first(), route).toBeVisible();
        await expect(page).toHaveURL(new RegExp(route.replaceAll('/', '\\/') + '$'));
        await expect(page.getByRole('alert')).toHaveCount(0);
      }
    }
    expect(errors).toEqual([]);
  } finally {
    // Remove only accounts made by this test; their own records cascade on deletion.
    for (const account of [recruiter, seeker]) {
      await request.delete(`/api/admin/users/${account.user.id}`, { headers: adminHeaders });
    }
  }
});
