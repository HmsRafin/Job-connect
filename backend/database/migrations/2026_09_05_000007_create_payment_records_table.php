<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type')->default('job_boost'); // job_boost, advertisement, plan_subscription
            $table->string('reference_title')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('payment_method')->default('Card');
            $table->string('transaction_id')->nullable();
            $table->string('status')->default('Completed'); // Completed, Pending, Failed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_records');
    }
};
