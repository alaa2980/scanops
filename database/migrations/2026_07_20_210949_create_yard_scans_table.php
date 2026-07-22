<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('yard_scans', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            
            $table->string('reference_code')->unique()->nullable();
            
            $table->string('zone_name')->nullable();
            
            $table->json('boundaries_geojson');
            
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('yard_scans');
    }
};