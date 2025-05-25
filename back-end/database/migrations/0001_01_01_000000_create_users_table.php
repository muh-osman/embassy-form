<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('membership_number')->unique()->nullable(); // Added membership number column
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('email_sha1_hash')->nullable(); // This column save email address as "sha1" hash encrypt to use it in verify email
            $table->unsignedTinyInteger('role')->default(3); // 1-superadmin, 2-admin, 3-user
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            // New nullable fields
            $table->string('name_arabic')->nullable();
            $table->string('name_english')->nullable();
            $table->string('gender')->nullable();
            $table->string('area')->nullable();
            $table->string('city')->nullable();
            $table->string('neighborhood')->nullable();
            $table->string('profession')->nullable();
            $table->boolean('currently_working')->nullable();
            $table->string('status')->nullable();
            $table->boolean('family_living_with_you')->nullable();
            $table->unsignedSmallInteger('number_of_family_members')->nullable();
            $table->string('mobile_number')->nullable();
            $table->string('alternative_mobile_number')->nullable();
            $table->text('note')->nullable();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
