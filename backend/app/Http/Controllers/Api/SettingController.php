<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;

class SettingController extends Controller
{
    public function paymentMode()
    {
        return response()->json(['success' => true, 'data' => ['mode' => config('payments.mode'), 'real_money' => false]]);
    }

    public function adPricing()
    {
        return response()->json(['success' => true, 'data' => Setting::get('ad_pricing', ['Sidebar' => 9, 'Banner' => 19, 'Premium' => 29])]);
    }

    public function updateAdPricing(Request $request)
    {
        $data = $request->validate(['Sidebar' => 'required|numeric|min:1', 'Banner' => 'required|numeric|min:1', 'Premium' => 'required|numeric|min:1']);
        Setting::set('ad_pricing', $data);
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function getBoostPricing()
    {
        $default = [
            'day3' => 29,
            'day7' => 59,
            'day15' => 99,
            'day30' => 169,
            'customPerDay' => 6,
        ];

        $pricing = Setting::get('boost_pricing', $default);

        return response()->json([
            'success' => true,
            'data' => $pricing,
        ]);
    }

    public function updateBoostPricing(Request $request)
    {
        $validated = $request->validate([
            'day3' => 'required|numeric|min:1',
            'day7' => 'required|numeric|min:1',
            'day15' => 'required|numeric|min:1',
            'day30' => 'required|numeric|min:1',
            'customPerDay' => 'required|numeric|min:1',
        ]);

        Setting::set('boost_pricing', $validated);

        return response()->json([
            'success' => true,
            'message' => 'Boost pricing rates updated successfully.',
            'data' => $validated,
        ]);
    }
}
