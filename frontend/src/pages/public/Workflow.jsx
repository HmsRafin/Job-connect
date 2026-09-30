import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { GitCommit, PackageCheck, Server, ShieldCheck, ArrowRight, Play, Pause, RotateCcw, Zap, Globe, Lock, Cpu, Database, GitBranch, Container, Terminal, Layers, Sparkles, ChevronRight, ExternalLink, Activity, ClipboardList, Code2, Hammer, FlaskConical, Box, Rocket, Eye, Repeat2, Workflow as WorkflowIcon, KeyRound, Cable, Folder, FileText, Flame, Network, HardDrive, Cloud, Settings2, Wrench, History, CheckCheck } from 'lucide-react';

const stages = [
  { id: 1, key: 'push', title: 'Push Code', subtitle: 'Developer → GitHub', icon: GitBranch, port: 'git push → webhook', color: '#2563EB', details: ['git commit + push to main', 'Webhook fires Github Actions', '.github/workflows/ci-cd.yml', 'Runs on ubuntu-latest runner'] },
  { id: 2, key: 'build', title: 'Build & Test', subtitle: 'Runner Pipeline', icon: PackageCheck, port: 'npm ci / test / lint', color: '#7C3AED', details: ['npm ci + cache node_modules', 'npm test (Jest/Mocha)', 'npm run lint — fail on error', 'Docker build artifacts'] },
  { id: 3, key: 'deploy', title: 'VPS Deploy', subtitle: 'SSH → Production', icon: Server, port: 'SCP → 80/443 Nginx', color: '#059669', details: ['SCP / SSH copy artifact', 'docker compose restart', 'Nginx reload — reverse proxy', 'UFW 80/443 open • 22 secured'] },
];

const devOpsPhases = [
  { n: '01', name: 'Plan', desc: 'Define goals, user stories & requirements', icon: ClipboardList, color: 'bg-amber-500' },
  { n: '02', name: 'Code', desc: 'Write features, fix bugs, write tests, security', icon: Code2, color: 'bg-sky-500' },
  { n: '03', name: 'Build', desc: 'Compile & package — Jenkins / Github Actions', icon: Hammer, color: 'bg-violet-500' },
  { n: '04', name: 'Test', desc: 'Unit / integration / quality validation', icon: FlaskConical, color: 'bg-emerald-500' },
  { n: '05', name: 'Release', desc: 'Package for deploy after tests pass', icon: Box, color: 'bg-orange-500' },
  { n: '06', name: 'Deploy', desc: 'To production/staging via Docker / Kubernetes', icon: Rocket, color: 'bg-brand-accent' },
  { n: '07', name: 'Monitor', desc: 'Prod monitoring → feeds next iteration', icon: Eye, color: 'bg-teal-500' },
];

const ciSteps = [
  { n: 1, title: 'Developer writes code locally', sub: 'Commits to Git', icon: Code2 },
  { n: 2, title: 'Push to remote', sub: 'GitHub / GitLab / Bitbucket shared repo', icon: GitBranch },
  { n: 3, title: 'CI server triggers build', sub: 'Detects commit → compiles', icon: Hammer },
  { n: 4, title: 'Automated testing', sub: 'Unit / integration suite', icon: FlaskConical },
  { n: 5, title: 'Feedback to developers', sub: 'Green = good to go / Red = fix', icon: Activity },
  { n: 6, title: 'Successful build → staging/prod', sub: 'Eligible for delivery pipeline', icon: CheckCheck },
];

export default function Workflow() {
  const [active, setActive] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1.4);
  const [showInfra, setShowInfra] = useState(true);
  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setActive((a) => (a % 3) + 1), 2200 / speed);
    return () => clearInterval(id);
  }, [playing, speed]);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#F8FAFC]">
      {/* HERO */}
      <div className="relative overflow-hidden bg-brand-navyDark border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_20%_0%,rgba(37,99,235,0.25),transparent),radial-gradient(40%_60%_at_90%_20%,rgba(33,158,188,0.18),transparent)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold tracking-widest text-slate-200 uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                LIVE PIPELINE • JobConnect — Production Workflow
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-white leading-none">
                CI/CD <span className="text-brand-accent">Workflow</span> — Detailed
              </h1>
              <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-400">
                Full production pipeline visualized. The <span className="text-white font-semibold">traveling light</span> goes <b className="text-white">Plan → Code → Build → Test → Release → Deploy → Monitor</b> continuously — follow it end-to-end to understand how JobConnect moves from <code className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200">git push</code> to live VPS.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-bold tracking-widest">START → END • NO COMPRESSED VIEW</span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200">Scroll for full detail • Large page</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <Activity className="w-4 h-4 text-emerald-400" /> Light auto • { (2.2 / speed).toFixed(1)}s / stage
              </div>
              <button onClick={() => setPlaying(!playing)} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md ${playing ? 'bg-white text-brand-navy' : 'bg-brand-accent text-white'}`}>
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {playing ? 'Pause light' : 'Resume'}
              </button>
              <button onClick={() => { setActive(1); setPlaying(true); }} className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/15"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Light speed</span>
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
              {[0.6, 1, 1.4, 2].map((v) => <button key={v} onClick={() => setSpeed(v)} className={`px-3 py-1 rounded-full font-semibold ${speed === v ? 'bg-brand-accent text-white' : 'text-slate-300 hover:text-white'}`}>{v}×</button>)}
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 ml-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" /> beam</span>
            <span className="hidden sm:inline-flex items-center gap-2 text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> node</span>
          </div>
        </div>
      </div>

      {/* OVERVIEW PIPELINE (sticky light) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-[28px] bg-white border border-slate-200 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-navy flex items-center justify-center"><WorkflowIcon className="w-4 h-4 text-white" /></div>
              <div><div className="text-sm font-bold text-brand-slate">Overview Pipeline — <span className="text-brand-accent">JobConnect</span></div><div className="text-xs text-slate-500 hidden sm:block">Push → Github Actions (ubuntu-latest) → SSH/SCP → 187.52.122.100 + Nginx + Docker + UFW</div></div>
            </div>
            <span className="hidden md:inline-flex px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold tracking-widest">on: push branches: [main]</span>
          </div>
          <div className="hidden lg:block p-8">
            <div className="relative">
              <div className="absolute left-[12%] right-[12%] top-[56px] h-[4px] rounded-full bg-slate-200 overflow-hidden">
                <motion.div className="absolute top-0 h-full w-[28%] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #38BDF8, #34D399, transparent)', boxShadow: '0 0 14px rgba(56,189,248,0.7)' }} animate={playing ? { left: ['-28%', '100%'] } : { left: `${((active - 1) * 50)}%` }} transition={playing ? { duration: 2.2 / speed, repeat: Infinity, ease: 'linear' } : { duration: 0.5 }} />
                <motion.div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]" animate={playing ? { left: ['0%', '50%', '100%'] } : { left: `${(active - 1) * 50}%` }} transition={playing ? { duration: 2.2 / speed, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 1] } : { duration: 0.4 }} style={{ marginLeft: active === 3 ? '-12px' : active === 1 ? '0' : '-6px' }} />
              </div>
              <div className="grid grid-cols-3 gap-6 relative">
                {stages.map((s) => {
                  const isActive = active === s.id;
                  const Icon = s.icon;
                  return (
                    <button key={s.id} onClick={() => { setActive(s.id); setPlaying(false); }} className={`relative text-left rounded-[20px] border-2 p-5 pt-6 ${isActive ? 'bg-white border-brand-accent shadow-hover scale-[1.02]' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}>
                      <div className="absolute -top-[22px] left-1/2 -translate-x-1/2">
                        <motion.div animate={isActive ? { scale: [1, 1.12, 1] } : {}} transition={{ duration: 1.2, repeat: isActive && playing ? Infinity : 0 }} className={`w-[44px] h-[44px] rounded-full flex items-center justify-center border-4 ${isActive ? 'bg-brand-navy border-brand-accent shadow-[0_0_18px_rgba(37,99,235,0.5)]' : 'bg-white border-slate-300'}`}><Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} /></motion.div>
                      </div>
                      <div className="flex items-center justify-between mt-2"><span className={`px-2.5 py-1 rounded-full text-[11px] font-black tracking-widest border ${isActive ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-slate-500 border-slate-200'}`}>0{s.id}</span><span className="text-[11px] font-mono px-2 py-1 rounded-full bg-slate-900 text-teal-200">{s.port}</span></div>
                      <h3 className="mt-3 text-[17px] font-black text-brand-slate">{s.title}</h3><div className="text-xs font-semibold text-brand-accent">{s.subtitle}</div><p className="text-xs text-slate-500 mt-1">{s.subtitle} • {s.details[0]}</p>
                      <ul className="mt-3 space-y-1">{s.details.slice(0, isActive ? 4 : 2).map((d) => <li key={d} className="flex gap-1.5 text-xs text-slate-600"><ChevronRight className={`w-3 h-3 mt-[2px] ${isActive ? 'text-brand-accent' : 'text-slate-400'}`} />{d}</li>)}</ul>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6 rounded-2xl bg-slate-900 text-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1"><div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-sky-300"><Terminal className="w-4 h-4" /> NOW: {stages[active - 1].title} — live log</div>
                    <div className="mt-2 font-mono text-xs leading-5 text-slate-300">
                      {active === 1 && <><span className="text-slate-500">$</span> git push origin main <span className="text-emerald-400">✓</span><br /><span className="text-slate-500">$</span> webhook → <span className="text-sky-300">.github/workflows/ci-cd.yml</span> queued (ubuntu-latest)</>}
                      {active === 2 && <><span className="text-slate-500">$</span> npm ci (cache hit) • npm test • npm run lint <span className="text-emerald-400">✔ 42 passed</span><br /><span className="text-slate-500">$</span> docker build backend + frontend → nginx</>}
                      {active === 3 && <><span className="text-slate-500">$</span> scp → sROLL@187.52.122.100:22 • ssh docker compose up <br /><span className="text-emerald-400">✔</span> nginx reload • https://cse3100.aliahnaf.fun live</>}
                    </div>
                  </div>
                  <div className="flex gap-2"><a href="http://localhost:8000/api/test" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl bg-white text-brand-navy text-xs font-bold inline-flex items-center gap-1">Health <ExternalLink className="w-3.5 h-3.5" /></a><a href="http://localhost:5173" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl bg-brand-accent text-white text-xs font-bold inline-flex items-center gap-1">Open app <ArrowRight className="w-3.5 h-3.5" /></a></div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="lg:hidden p-5">
            <div className="relative pl-8">
              <div className="absolute left-[15px] top-4 bottom-4 w-[4px] rounded-full bg-slate-200 overflow-hidden">
                <motion.div className="absolute w-full rounded-full" style={{ background: 'linear-gradient(180deg, transparent, #38BDF8, #34D399, transparent)', height: '35%' }} animate={playing ? { top: ['-35%', '100%'] } : { top: `${(active - 1) * 33}%` }} transition={playing ? { duration: 2.2 / speed, repeat: Infinity, ease: 'linear' } : { duration: 0.4 }} />
                <motion.div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]" animate={playing ? { top: ['8%', '44%', '82%'] } : { top: active === 1 ? '8%' : active === 2 ? '44%' : '82%' }} transition={playing ? { duration: 2.2 / speed, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 1] } : { duration: 0.4 }} />
              </div>
              <div className="space-y-4">
                {stages.map((s) => {
                  const isActive = active === s.id;
                  const Icon = s.icon;
                  return (
                    <button key={s.id} onClick={() => { setActive(s.id); setPlaying(false); }} className={`w-full text-left rounded-2xl border-2 p-4 flex gap-4 ${isActive ? 'bg-white border-brand-accent shadow-md' : 'bg-slate-50 border-slate-200'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${isActive ? 'bg-brand-navy border-brand-accent text-white' : 'bg-white border-slate-200 text-slate-500'}`}><Icon className="w-5 h-5" /></div>
                      <div className="flex-1"><div className="text-sm font-black text-brand-slate">{s.title} <span className="text-xs text-brand-accent">— {s.subtitle}</span></div><div className="text-xs text-slate-500">{s.details[0]}</div></div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED SCROLL TIMELINE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Left: workflow */}
          <div className="space-y-6 relative">
            {/* vertical rail for detailed */}
            <div className="hidden lg:block absolute left-[28px] top-0 bottom-0 w-[3px] bg-slate-200 rounded-full overflow-hidden">
              <motion.div className="absolute left-0 w-full bg-gradient-to-b from-sky-400 via-violet-400 to-emerald-400" style={{ scaleY, transformOrigin: 'top', height: '100%' }} />
              <motion.div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-sky-500 shadow-[0_0_12px_rgba(56,189,248,0.9)]" style={{ top: '0%' }} animate={{ top: ['0%', '100%'] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} />
            </div>

            {/* DevOps */}
            <section className="relative lg:pl-14 rounded-[24px] bg-white border border-slate-200 shadow-card overflow-hidden">
              <div className="hidden lg:flex absolute left-0 top-6 w-14 justify-center"><div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white"><Repeat2 className="w-4 h-4" /></div></div>
              <div className="p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-black tracking-widest text-amber-700">DEVOPS</div>
                <h2 className="mt-3 text-xl sm:text-2xl font-black text-brand-slate">What is DevOps? 7 Phases — Continuous Loop</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">DevOps = <b>Development</b> (features, bugs, tests, security) + <b>Operations</b> (infra, monitoring, stability) working to one goal: deliver working apps smoothly. All steps automated via <b>CI/CD</b>.</p>
                <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {devOpsPhases.map((p) => (
                    <div key={p.n} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className={`w-8 h-8 rounded-xl ${p.color} flex items-center justify-center text-white`}><p.icon className="w-4 h-4" /></div>
                      <div className="mt-2 text-xs font-black tracking-widest text-slate-500">{p.n} • {p.name}</div>
                      <div className="text-sm font-bold text-brand-slate leading-tight mt-1">{p.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-slate-900 text-slate-200 p-3 font-mono text-xs">Plan → Code → Build → Test → Release → Deploy → Monitor → (loop) — tools: Jenkins, Github Actions, Docker/K8s</div>
              </div>
            </section>

            {/* CI */}
            <section className="relative lg:pl-14 rounded-[24px] bg-white border border-slate-200 shadow-card overflow-hidden">
              <div className="hidden lg:flex absolute left-0 top-6 w-14 justify-center"><div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white"><Hammer className="w-4 h-4" /></div></div>
              <div className="p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-[11px] font-black tracking-widest text-sky-700">CONTINUOUS INTEGRATION</div>
                <h2 className="mt-3 text-xl sm:text-2xl font-black text-brand-slate">CI — Frequently integrate to catch breakage early</h2>
                <p className="mt-2 text-sm text-slate-600">Every push → CI system (Jenkins, Github Actions, GitLab CI, CircleCI) auto <b>builds + tests</b>. Build compiles & packages to deployable state; tests verify correctness. Catch bugs early.</p>
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-black tracking-widest text-slate-500 mb-3">6-STEP CI WORKFLOW</div>
                  <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {ciSteps.map((s) => (
                      <div key={s.n} className="rounded-2xl bg-white border border-slate-200 p-3 text-center">
                        <div className="w-8 h-8 mx-auto rounded-full bg-brand-navy text-white flex items-center justify-center text-xs font-black">{s.n}</div>
                        <s.icon className="w-4 h-4 mx-auto mt-2 text-brand-accent" />
                        <div className="text-xs font-bold text-brand-slate mt-1 leading-tight">{s.title}</div>
                        <div className="text-[11px] text-slate-500 leading-tight">{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden relative">
                    <motion.div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-sky-400 to-violet-400 rounded-full" animate={{ left: ['0%', '66%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                  </div>
                </div>
              </div>
            </section>

            {/* CD */}
            <section className="relative lg:pl-14 rounded-[24px] bg-white border border-slate-200 shadow-card overflow-hidden">
              <div className="hidden lg:flex absolute left-0 top-6 w-14 justify-center"><div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white"><Rocket className="w-4 h-4" /></div></div>
              <div className="p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-[11px] font-black tracking-widest text-violet-700">CONTINUOUS DELIVERY / DEPLOYMENT</div>
                <h2 className="mt-3 text-xl font-black text-brand-slate">CD — Automated release after CI</h2>
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-violet-50 border border-violet-200 p-4"><div className="text-sm font-black text-violet-800">Continuous Delivery</div><div className="text-xs text-slate-600 mt-1">Auto deploys to test/staging; prod deploy is <b>one click</b>. Code always releasable.</div><div className="mt-2 text-xs font-mono bg-white border px-2 py-1 rounded">build → test → staging ✓ → [Deploy button] → prod</div></div>
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4"><div className="text-sm font-black text-emerald-800">Continuous Deployment</div><div className="text-xs text-slate-600 mt-1">Every green build <b>auto</b> goes to prod — no human gate.</div><div className="mt-2 text-xs font-mono bg-white border px-2 py-1 rounded">build → test ✓ → auto prod</div></div>
                </div>
                <div className="mt-3 text-xs text-slate-500">JobConnect uses Delivery (click to deploy) — safer for production env.</div>
              </div>
            </section>

            {/* Github Actions */}
            <section className="relative lg:pl-14 rounded-[24px] bg-white border border-slate-200 shadow-card overflow-hidden">
              <div className="hidden lg:flex absolute left-0 top-6 w-14 justify-center"><div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white"><GitBranch className="w-4 h-4" /></div></div>
              <div className="p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-black tracking-widest">GITHUB ACTIONS</div>
                <h2 className="mt-3 text-xl sm:text-2xl font-black text-brand-slate">The CI/CD engine — YAML, runners, secrets, matrix</h2>
                <p className="mt-2 text-sm text-slate-600">Integrated in GitHub, runs on VMs called <b>code-runners</b>. Workflows live in <code className="px-1.5 py-0.5 rounded bg-slate-100 border">.github/workflows/</code> — multiple per repo. Define in YAML.</p>
                <div className="mt-4 grid lg:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-black tracking-widest text-slate-500 mb-2">WORKFLOW ANATOMY</div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      <li className="flex gap-2"><Settings2 className="w-4 h-4 text-slate-400 flex-shrink-0" /><span><b>Triggers:</b> <code className="px-1 py-0.5 rounded bg-slate-100 border">on: push</code>, pull_request, release, issue</span></li>
                      <li className="flex gap-2"><Server className="w-4 h-4 text-slate-400 flex-shrink-0" /><span><b>Runners:</b> <code className="px-1 py-0.5 rounded bg-slate-100 border">runs-on: ubuntu-latest</code></span></li>
                      <li className="flex gap-2"><KeyRound className="w-4 h-4 text-slate-400 flex-shrink-0" /><span><b>Secrets:</b> Settings → Secrets → <code className="px-1 py-0.5 rounded bg-slate-100 border">{'${{ secrets.NAME }}'}</code></span></li>
                      <li className="flex gap-2"><Layers className="w-4 h-4 text-slate-400 flex-shrink-0" /><span><b>needs / matrix / if / notifications</b> — job deps, parallel PHP/Node versions, Slack/email, conditional steps</span></li>
                    </ul>
                    <div className="mt-3 rounded-xl bg-slate-900 text-slate-100 p-3 font-mono text-[11px] leading-4">
                      .github/workflows/<br />├─ nodejs-ci.yml &nbsp;<span className="text-slate-500"># gist: Node build</span><br />├─ laravel-ci.yml &nbsp;<span className="text-slate-500"># gist: Laravel API build</span><br />└─ ci-cd.yml &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400"># pocket_pixel example</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-900 text-slate-100 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-sky-300"><FileText className="w-4 h-4" /> Example — nodejs-ci.yml</div>
                    <pre className="mt-2 text-[11px] leading-4 overflow-x-auto font-mono text-slate-300">{`name: CI
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: \${{ matrix.node-version }}, cache: 'npm' }
      - run: npm ci
      - run: npm test
      - run: npm run lint`}</pre>
                    <div className="mt-2 text-[11px] text-amber-300">+ cache node_modules • ESLint fail • matrix parallel</div>
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800"><b>JobConnect note:</b> Your frontend already has <code className="px-1 py-0.5 rounded bg-white border">npm ci</code> + <code className="px-1 py-0.5 rounded bg-white border">npm run build</code> baked in <code className="px-1 py-0.5 rounded bg-white border">frontend/Dockerfile:13</code> — same step the runner would do.</div>
              </div>
            </section>

            {/* VPS */}
            <section className="relative lg:pl-14 rounded-[24px] bg-white border border-slate-200 shadow-card overflow-hidden">
              <div className="hidden lg:flex absolute left-0 top-6 w-14 justify-center"><div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white"><Server className="w-4 h-4" /></div></div>
              <div className="p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-black tracking-widest text-emerald-700">VPS</div>
                <h2 className="mt-3 text-xl sm:text-2xl font-black text-brand-slate">Virtual Private Server — isolated VM on physical host</h2>
                <div className="mt-4 grid sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-slate-50 border p-4"><Cpu className="w-5 h-5 text-brand-accent" /><div className="text-sm font-bold mt-2">Virtual Isolation</div><div className="text-xs text-slate-600">Hypervisor partitions physical machine into secure independent envs</div></div>
                  <div className="rounded-2xl bg-slate-50 border p-4"><HardDrive className="w-5 h-5 text-violet-500" /><div className="text-sm font-bold mt-2">Dedicated Resources</div><div className="text-xs text-slate-600">Guaranteed CPU, RAM, SSD — not shared, no noisy neighbor</div></div>
                  <div className="rounded-2xl bg-slate-50 border p-4"><ShieldCheck className="w-5 h-5 text-emerald-600" /><div className="text-sm font-bold mt-2">Full Autonomy</div><div className="text-xs text-slate-600">Own OS (Ubuntu/Debian) + root — install Nginx, DB, policies</div></div>
                </div>
                <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl bg-brand-navy text-white p-4"><div className="font-black">Why Use VPS for Web Apps?</div><ul className="mt-2 space-y-1 list-disc pl-4 text-slate-300"><li>Config control — custom servers</li><li>Consistent perf — isolated</li><li>On-demand scaling — CPU/RAM/disk upgrade</li></ul></div>
                  <div className="rounded-xl bg-slate-100 border p-4"><div className="font-bold">Providers</div><div className="text-slate-600">DigitalOcean, AWS, Hostinger</div><div className="mt-2 font-bold">Live VPS</div><div className="font-mono bg-white border px-2 py-1 rounded">187.52.122.100</div><div className="text-slate-500">user: s&lt;ROLL&gt;</div></div>
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-4"><div className="font-bold text-amber-800">Cost vs Shared</div><div className="text-slate-600">Shared = cheap but noisy; VPS = predictable; Dedicated = most expensive</div></div>
                </div>
              </div>
            </section>

            {/* SSH */}
            <section className="relative lg:pl-14 rounded-[24px] bg-white border border-slate-200 shadow-card overflow-hidden">
              <div className="hidden lg:flex absolute left-0 top-6 w-14 justify-center"><div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white"><KeyRound className="w-4 h-4" /></div></div>
              <div className="p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-[11px] font-black tracking-widest text-sky-700">SSH</div>
                <h2 className="mt-3 text-xl font-black text-brand-slate">Secure Shell — key-pair handshake</h2>
                <div className="mt-3 grid lg:grid-cols-2 gap-4">
                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border"><Lock className="w-5 h-5 text-amber-500 flex-shrink-0" /><div><b>Public Key = lock</b> — upload to VPS, share freely</div></div>
                    <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border"><KeyRound className="w-5 h-5 text-emerald-500 flex-shrink-0" /><div><b>Private Key = key</b> — stays on local, MUST keep secret</div></div>
                    <div className="flex gap-3 p-3 rounded-xl bg-slate-900 text-slate-200"><Cable className="w-5 h-5 text-sky-400 flex-shrink-0" /><div><b>Handshake:</b> server encrypts with public key → only private key can decrypt → proves identity without sending private key</div></div>
                  </div>
                  <div>
                    <div className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-5">
                      <div className="text-sky-300"># Connect (PowerShell)</div>
                      <div>ssh -i ~/.ssh/privateKey sROLL@187.52.122.100<span className="text-slate-500"> # port 22</span></div>
                      <div className="mt-2 text-slate-400"># Alt when SSH blocked</div>
                      <div>Web Console (VNC) • SFTP/SCP (over 22) • custom port</div>
                      <div className="mt-3 text-amber-300"># Fix perms (Windows)</div>
                      <div>icacls &lt;privateKey&gt; /inheritance:r</div>
                      <div>icacls &lt;privateKey&gt; /grant:r "$env:USERNAME:(R)"</div>
                      <div className="mt-2 text-slate-500"># Your keys: drive.google.com/... search s&lt;ROLL&gt;</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Linux + UFW */}
            <section className="relative lg:pl-14 rounded-[24px] bg-white border border-slate-200 shadow-card overflow-hidden">
              <div className="hidden lg:flex absolute left-0 top-6 w-14 justify-center"><div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white"><Terminal className="w-4 h-4" /></div></div>
              <div className="p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border text-[11px] font-black tracking-widest text-slate-700">LINUX & FIREWALL</div>
                <h2 className="mt-3 text-xl font-black text-brand-slate">Common commands + UFW — deny by default</h2>
                <div className="mt-4 grid lg:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-black tracking-widest text-slate-500 mb-2">NAVIGATION & FILES</div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      {[
                        ['pwd', 'print cwd'],
                        ['ls -a', 'list all (hidden)'],
                        ['cd [dir]', 'change dir'],
                        ['mkdir [name]', 'make dir'],
                        ['rm -rf', 'force remove'],
                        ['cat [file]', 'view file'],
                        ['nano [file]', 'edit'],
                        ['tail -f [log]', 'follow log'],
                        ['zip/unzip', 'compress'],
                        ['ssh user@ip', 'connect'],
                        ['scp file dest', 'copy over SSH'],
                        ['sudo cmd', 'as root'],
                      ].map(([c, d]) => <div key={c} className="rounded-lg bg-slate-50 border px-2 py-1.5"><b>{c}</b> <span className="text-slate-500">— {d}</span></div>)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-widest text-slate-500 mb-2">UFW RULES</div>
                    <div className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-5">
                      <div className="text-sky-300"># Inbound — default deny</div>
                      <div>sudo ufw default deny incoming</div>
                      <div>sudo ufw allow 22/tcp  <span className="text-slate-500"># SSH (limit to IP if possible)</span></div>
                      <div>sudo ufw allow 80/tcp; sudo ufw allow 443/tcp <span className="text-slate-500"># HTTP/S</span></div>
                      <div>sudo ufw deny 3306/tcp <span className="text-slate-500"># DB never public</span></div>
                      <div>sudo ufw allow from 192.168.1.0/24 to any port 22</div>
                      <div className="mt-2 text-sky-300"># Outbound — allow essentials</div>
                      <div>sudo ufw default allow outgoing</div>
                      <div>sudo ufw allow out 53 <span className="text-slate-500"># DNS</span> ; allow out 443</div>
                      <div>sudo ufw deny out 25/tcp <span className="text-slate-500"># block SMTP spam</span></div>
                      <div className="mt-2 text-slate-500"># Block unused • allow only what you need</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* DB */}
            <section className="relative lg:pl-14 rounded-[24px] bg-white border border-slate-200 shadow-card overflow-hidden">
              <div className="hidden lg:flex absolute left-0 top-6 w-14 justify-center"><div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white"><Database className="w-4 h-4" /></div></div>
              <div className="p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-[11px] font-black tracking-widest text-violet-700">DATABASE ACCESS</div>
                <h2 className="mt-3 text-xl font-black text-brand-slate">Shared MySQL container on VPS — Isolated DB</h2>
                <div className="mt-3 rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-5 overflow-x-auto">
                  <div><span className="text-slate-500"># 1 SSH</span> ssh sROLL@187.52.122.100</div>
                  <div><span className="text-slate-500"># 2 Root pw</span> sudo sed -n 's/^ROOT_PW=//p' /root/exam_db_credentials.txt</div>
                  <div><span className="text-slate-500"># 3 MySQL shell</span> docker exec -it exam_mysql mysql -uroot -p"$ROOT_PW"</div>
                  <div className="mt-2 text-sky-300">CREATE DATABASE sROLL; CREATE USER 'sROLL'@'%' IDENTIFIED BY '...'; GRANT ALL ON sROLL.* TO 'sROLL'@'%'; FLUSH PRIVILEGES;</div>
                  <div className="mt-2"><span className="text-slate-500"># 5 .env — </span>DB_HOST=&lt;docker inspect&gt; DB_PORT=&lt;...&gt; DB_USER=sROLL DB_PASSWORD=... DB_NAME=sROLL  <span className="text-amber-300">prefix s</span></div>
                </div>
                <div className="mt-3 text-xs text-slate-500">Your JobConnect uses SQLite (<code className="px-1 py-0.5 rounded bg-slate-100 border">database.sqlite</code>) — this MySQL flow is for shared VPS; SQLite avoids this setup locally/Docker.</div>
              </div>
            </section>

            {/* Nginx */}
            <section className="relative lg:pl-14 rounded-[24px] bg-white border border-slate-200 shadow-card overflow-hidden">
              <div className="hidden lg:flex absolute left-0 top-6 w-14 justify-center"><div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white"><Network className="w-4 h-4" /></div></div>
              <div className="p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-black tracking-widest text-teal-700">NGINX</div>
                <h2 className="mt-3 text-xl sm:text-2xl font-black text-brand-slate">Reverse proxy — Client → Nginx → App Server</h2>
                <div className="mt-3 flex flex-wrap gap-2 text-xs"><span className="px-2 py-1 rounded-full bg-slate-100 border">Static serve</span><span className="px-2 py-1 rounded-full bg-slate-100 border">Load balance</span><span className="px-2 py-1 rounded-full bg-slate-100 border">SSL termination</span><span className="px-2 py-1 rounded-full bg-slate-100 border">High concurrency</span><span className="px-2 py-1 rounded-full bg-slate-100 border">Low resource</span></div>
                <div className="mt-4 grid lg:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-50 border p-4">
                    <div className="text-xs font-black tracking-widest text-slate-500 mb-2">WHY REVERSE PROXY?</div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Gateway — hides internal infra</li>
                      <li className="flex gap-2"><Activity className="w-4 h-4 text-sky-500 flex-shrink-0" /> Scale — distribute traffic</li>
                      <li className="flex gap-2"><Lock className="w-4 h-4 text-amber-500 flex-shrink-0" /> Handles SSL centrally</li>
                      <li className="flex gap-2"><Zap className="w-4 h-4 text-violet-500 flex-shrink-0" /> Caching & optimization</li>
                    </ul>
                    <div className="mt-3 rounded-xl bg-white border p-3 flex items-center justify-between text-xs font-bold">
                      <span className="px-2 py-1 rounded bg-slate-900 text-white">Client</span> <ArrowRight className="w-4 h-4 text-slate-400" /> <span className="px-2 py-1 rounded bg-brand-accent text-white">Nginx</span> <ArrowRight className="w-4 h-4 text-slate-400" /> <span className="px-2 py-1 rounded bg-emerald-600 text-white">App :3000/8000</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-5 overflow-x-auto">
                    <div className="text-sky-300">sudo apt update; sudo apt install nginx -y</div>
                    <div>sudo ufw allow 80/tcp; sudo ufw allow 443/tcp</div>
                    <div className="mt-2 text-amber-300">sudo nano /etc/nginx/sites-available/cse3100.conf</div>
                    <div>server {'{'} listen 80; server_name _; location / {'{'} proxy_pass http://127.0.0.1:3000; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; {'}'} {'}'}</div>
                    <div className="mt-2">sudo ln -s sites-available/cse3100.conf sites-enabled/; sudo nginx -t; sudo systemctl reload nginx</div>
                    <div className="mt-2 text-emerald-300"># Domain: server_name cse3100.aliahnaf.fun;</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500">JobConnect: frontend nginx `frontend/nginx.conf:24` `try_files $uri /index.html` for SPA + backend `artisan serve 0.0.0.0:8000` behind same Nginx on VPS.</div>
              </div>
            </section>

            {/* DNS + Cloudflare */}
            <section className="relative lg:pl-14 rounded-[24px] bg-white border border-slate-200 shadow-card overflow-hidden">
              <div className="hidden lg:flex absolute left-0 top-6 w-14 justify-center"><div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white"><Globe className="w-4 h-4" /></div></div>
              <div className="p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-[11px] font-black tracking-widest text-sky-700">DOMAIN & DNS</div>
                <h2 className="mt-3 text-xl font-black text-brand-slate">DNS + Cloudflare — from name to IP, with edge protection</h2>
                <div className="mt-4 grid lg:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-black tracking-widest text-slate-500 mb-2">DNS 8 STEPS</div>
                    <ol className="space-y-1.5 text-xs text-slate-700 list-decimal pl-5">
                      <li>User enters <b>example.com</b></li><li>Browser cache check</li><li>→ DNS Resolver</li><li>→ Root servers</li><li>→ TLD (.com)</li><li>→ Authoritative server</li><li>Returns IP</li><li>Browser connects</li>
                    </ol>
                    <div className="mt-3 rounded-xl bg-slate-50 border p-3 text-xs">In Cloudflare/DNS provider → point domain → VPS IP <b>187.52.122.100</b> (A record). Example domain `cse3100.aliahnaf.fun` does this.</div>
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-widest text-slate-500 mb-2">CLOUDFLARE (reverse proxy + CDN)</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        ['DNS & Speed', 'Blazing fast global DNS'],
                        ['WAF & Security', 'SQLi / DDoS mitigation'],
                        ['SSL/TLS', 'Free certs, client↔edge encrypted'],
                        ['Edge Caching', 'Images/CSS/JS at edge → less origin load'],
                      ].map(([t, d]) => <div key={t} className="rounded-xl bg-slate-900 text-slate-100 p-3"><div className="font-bold text-white">{t}</div><div className="text-slate-400">{d}</div></div>)}
                    </div>
                    <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 p-2 text-xs text-amber-800">Nginx `server_name cse3100.aliahnaf.fun;` + Cloudflare proxy = SSL + WAF before traffic hits VPS.</div>
                  </div>
                </div>
              </div>
            </section>

            {/* CI/CD to VPS */}
            <section className="relative lg:pl-14 rounded-[24px] bg-white border-2 border-brand-accent shadow-hover overflow-hidden">
              <div className="hidden lg:flex absolute left-0 top-6 w-14 justify-center"><div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white"><Rocket className="w-4 h-4" /></div></div>
              <div className="p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-accent text-white text-[11px] font-black tracking-widest">CI/CD TO VPS — THE 3 STEPS</div>
                <h2 className="mt-3 text-xl sm:text-2xl font-black text-brand-slate">Push → Build & Test → Deploy — end-to-end light path</h2>
                <p className="mt-2 text-sm text-slate-600">This is the loop the light animates at the top. Example: <code className="px-1 py-0.5 rounded bg-slate-100 border">ali-ahnaf/pocket_pixel</code> <code className="px-1 py-0.5 rounded bg-slate-100 border">.github/workflows/ci-cd.yml</code>.</p>
                <div className="mt-5 grid lg:grid-cols-3 gap-4">
                  <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
                    <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black">01</div>
                    <div className="mt-2 text-sm font-black text-sky-800">Push Code</div>
                    <div className="text-xs text-slate-600">Developer commits & pushes to GitHub → webhook triggers CI/CD via `on: push`.</div>
                    <div className="mt-2 font-mono text-xs bg-white border px-2 py-1 rounded">git push origin main</div>
                  </div>
                  <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-4">
                    <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-black">02</div>
                    <div className="mt-2 text-sm font-black text-violet-800">Build & Test</div>
                    <div className="text-xs text-slate-600">Runner installs deps, runs tests, compiles <b>production artifacts / Docker images</b>.</div>
                    <div className="mt-2 font-mono text-xs bg-white border px-2 py-1 rounded">npm ci → npm test → docker build</div>
                  </div>
                  <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">03</div>
                    <div className="mt-2 text-sm font-black text-emerald-800">VPS Deploy</div>
                    <div className="text-xs text-slate-600">Artifacts SCP/SSH to VPS → Docker/PM2 restart — zero downtime.</div>
                    <div className="mt-2 font-mono text-xs bg-white border px-2 py-1 rounded">scp artifact → ssh → docker compose up</div>
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-slate-900 text-slate-100 p-4">
                  <div className="text-xs font-bold tracking-widest text-sky-300">JOBCONNECT MAPPING</div>
                  <div className="mt-2 grid sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3"><div className="font-bold text-white">Frontend</div><div className="text-slate-300"><code className="px-1 rounded bg-black/30">frontend/Dockerfile</code> Node 20 build → Nginx. <code className="px-1 rounded bg-black/30">VITE_BACKEND_URL</code> baked at build.</div></div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3"><div className="font-bold text-white">Backend</div><div className="text-slate-300">PHP 8.4 + <code className="px-1 rounded bg-black/30">artisan serve</code> 0.0.0.0:8000 or Docker `php:8.3-cli` entrypoint.</div></div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3"><div className="font-bold text-white">VPS</div><div className="text-slate-300">UFW 22/80/443, Nginx `proxy_pass 127.0.0.1:3000` (or :8000), `docker compose` + volumes.</div></div>
                  </div>
                </div>
              </div>
            </section>

            {/* IaC */}
            <section className="relative lg:pl-14 rounded-[24px] bg-white border border-slate-200 shadow-card overflow-hidden">
              <div className="hidden lg:flex absolute left-0 top-6 w-14 justify-center"><div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white"><Settings2 className="w-4 h-4" /></div></div>
              <div className="p-5 sm:p-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border text-[11px] font-black tracking-widest text-slate-700">INFRASTRUCTURE AS CODE</div>
                <h2 className="mt-3 text-xl font-black text-brand-slate">IaC — provision infra with code, not clicks</h2>
                <p className="mt-2 text-sm text-slate-600">Write servers, DBs, networks in a file → computer builds same way every time. Replicable, faster, consistent across dev/test/prod. Critical as containers & cloud scale up. Tools: <b>Terraform, AWS CloudFormation, Google Cloud Deployment Manager</b>.</p>
                <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3"><div className="font-black text-amber-800">Faster</div><div className="text-slate-600">No wait for manual setup — run script, infra ready</div></div>
                  <div className="rounded-xl bg-sky-50 border border-sky-200 p-3"><div className="font-black text-sky-800">Consistent</div><div className="text-slate-600">Dev & Ops share same env — fewer errors</div></div>
                  <div className="rounded-xl bg-violet-50 border border-violet-200 p-3"><div className="font-black text-violet-800">Less manual</div><div className="text-slate-600">Auto create servers/networks</div></div>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3"><div className="font-black text-emerald-800">Same everywhere</div><div className="text-slate-600">One script for dev/test/prod → same behavior</div></div>
                </div>
                <div className="mt-3 text-xs text-slate-500">Your repo is already IaC: <code className="px-1 py-0.5 rounded bg-slate-100 border">docker-compose.yml</code> + <code className="px-1 py-0.5 rounded bg-slate-100 border">Dockerfile</code>s + <code className="px-1 py-0.5 rounded bg-slate-100 border">.github/workflows</code> = replicable infra.</div>
              </div>
            </section>

            {/* CTA */}
            <div className="rounded-[24px] bg-brand-navyDark border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-white"><div className="text-sm font-black">End of detailed workflow — light has traveled full loop</div><div className="text-xs text-slate-400">Next: push code and watch the beam go Push → Build → VPS in real Github Actions log.</div></div>
              <div className="flex gap-2"><button onClick={() => setPlaying(p => !p)} className="px-4 py-2 rounded-xl bg-white text-brand-navy text-xs font-bold inline-flex items-center gap-1">{playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}{playing ? 'Pause' : 'Resume'}</button><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-4 py-2 rounded-xl bg-brand-accent text-white text-xs font-bold">Back to top</button></div>
            </div>
          </div>

          {/* Right sticky nav */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-[20px] bg-white border border-slate-200 p-4">
                <div className="text-xs font-black tracking-widest text-slate-500">ON THIS PAGE</div>
                <div className="mt-3 space-y-1.5 text-xs">
                  {['DevOps 7 phases', 'CI 6 steps', 'CD Delivery vs Deployment', 'Github Actions', 'VPS', 'SSH Keys', 'UFW Firewall', 'DB per student', 'Nginx reverse proxy', 'DNS + Cloudflare', 'CI/CD to VPS', 'IaC'].map((t, i) => (
                    <div key={t} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer" onClick={() => document.querySelectorAll('section')[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                      <span className="w-6 h-6 rounded-full bg-slate-100 border flex items-center justify-center text-[10px] font-black">{String(i + 1).padStart(2, '0')}</span>{t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[20px] bg-slate-900 text-slate-100 p-4">
                <div className="text-xs font-black tracking-widest text-sky-300 flex items-center gap-1"><Cloud className="w-4 h-4" /> WARP VPN</div><div className="text-xs mt-1 text-slate-300">If VPS not reachable: install WARP from <span className="text-sky-300">one.one.one.one</span> (Windows).</div>
                <div className="mt-3 rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-xs font-bold text-white">Quick links</div>
                  <div className="mt-1 space-y-1 text-xs"><a href="http://localhost:8000/api/test" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sky-300 hover:text-white">Backend health <ExternalLink className="w-3 h-3" /></a><a href="http://localhost:5173" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sky-300 hover:text-white">Frontend <ExternalLink className="w-3 h-3" /></a><a href="https://github.com/ali-ahnaf/pocket_pixel/blob/develop/.github/workflows/ci-cd.yml" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sky-300 hover:text-white">Example ci-cd.yml <ExternalLink className="w-3 h-3" /></a></div>
                </div>
              </div>
              <div className="rounded-2xl border-2 border-dashed border-slate-300 p-0 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400" />
                <div className="p-3 bg-white">
                  <div className="text-xs font-black text-slate-500">LIGHT LEGEND</div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-600"><span className="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" /> beam = artifact traveling</div>
                  <div className="flex items-center gap-2 text-xs text-slate-600"><span className="w-3 h-3 rounded-full bg-white border-2 border-sky-400" /> dot = current stage</div>
                  <div className="flex items-center gap-2 text-xs text-slate-600"><span className="w-3 h-1 rounded-full bg-emerald-400" /> rail = pipeline path</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll progress bar */}
      <motion.div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-violet-500 to-emerald-400 origin-left z-50" style={{ scaleX: scrollYProgress }} />
    </div>
  );
}
