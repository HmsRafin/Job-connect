<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('company');
            $table->string('category_type')->default('Job'); // Job or Internship
            $table->string('category')->default('Software Development');
            $table->string('type')->default('Full-Time');
            $table->string('work_model')->default('Remote');
            $table->string('location')->default('Remote');
            $table->string('salary')->default('Competitive');
            $table->string('experience')->default('Mid-Level (2-5 yrs)');
            $table->text('description');
            $table->json('requirements')->nullable();
            $table->json('tags')->nullable();
            $table->string('logo')->nullable();
            $table->boolean('featured')->default(false);
            $table->integer('boosted_days')->default(0);
            $table->timestamp('boost_expiry')->nullable();
            $table->string('status')->default('Active'); // Active, Paused, Closed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
