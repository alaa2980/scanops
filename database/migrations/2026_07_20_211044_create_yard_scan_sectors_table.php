<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('yard_scan_sectors', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('yard_scan_id')->constrained('yard_scans')->cascadeOnDelete();

            $table->string('source')->default('bbox'); // bbox | tile
            $table->unsignedTinyInteger('zoom')->nullable();
            $table->unsignedInteger('tile_x')->nullable();
            $table->unsignedInteger('tile_y')->nullable();

            $table->double('min_lat', 10, 6);
            $table->double('min_lon', 10, 6);
            $table->double('max_lat', 10, 6);
            $table->double('max_lon', 10, 6);

            $table->string('image_path')->nullable();
            $table->string('image_mime')->nullable();
            $table->string('fetch_status')->default('pending'); // pending | done | failed
            $table->text('fetch_error')->nullable();
            $table->timestamp('fetched_at')->nullable();

            $table->string('detect_status')->default('pending'); // pending | done | failed
            $table->text('detect_error')->nullable();
            $table->timestamp('detected_at')->nullable();

            $table->timestamps();

            $table->index('yard_scan_id');
            $table->index(['yard_scan_id', 'source']);
            $table->index(['zoom', 'tile_x', 'tile_y']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('yard_scan_sectors');
    }
};