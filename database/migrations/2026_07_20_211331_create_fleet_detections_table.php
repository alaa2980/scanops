<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('fleet_detections', function (Blueprint $table) {
            $table->id();

            $table->foreignId('yard_scan_id')->constrained('yard_scans')->cascadeOnDelete();
            $table->foreignId('sector_id')->constrained('yard_scan_sectors')->cascadeOnDelete();

            $table->string('vehicle_type')->comment('مثال: truck, container_handler');
            $table->float('confidence_score');

            $table->unsignedInteger('pixel_x');
            $table->unsignedInteger('pixel_y');

            $table->unsignedInteger('bbox_x1')->nullable();
            $table->unsignedInteger('bbox_y1')->nullable();
            $table->unsignedInteger('bbox_x2')->nullable();
            $table->unsignedInteger('bbox_y2')->nullable();

            $table->double('latitude', 10, 7);
            $table->double('longitude', 10, 7);

            $table->timestamp('detected_at');
            $table->timestamps();

            $table->index(['yard_scan_id', 'sector_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fleet_detections');
    }
};