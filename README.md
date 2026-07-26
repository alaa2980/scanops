# ScanOps | AI-Powered Logistics & Yard Management System

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![YOLOv8](https://img.shields.io/badge/YOLOv8-00FFFF?style=for-the-badge&logo=yolo&logoColor=black)

**ScanOps** is an enterprise-grade B2B platform designed specifically for the construction and logistics sectors. It bridges the gap between modern web applications and computer vision, enabling operations teams to scan large logistical yards via satellite imagery and automatically detect commercial truck fleets using advanced Machine Learning models.

---

## Operational Workflow

ScanOps is built around a logical, step-by-step geospatial processing pipeline designed for high performance and strict operational control.

### 1. System Command Center
A comprehensive administrative dashboard providing a real-time overview of logistics scans, fleet detections, system health, and workforce management. Built with a zero-dependency, modern Glassmorphism UI.

![Admin Dashboard](./docs/images/Admin%20dashboard.png)

### 2. Geospatial Targeting
Dispatchers can draw precision polygons over target logistical zones using interactive mapping tools. The system automatically breaks down massive yards into manageable processing sectors (Grid System).

![Geospatial Targeting](./docs/images/After%20identifying%20four%20points.png)

### 3. Live AI Execution & Telemetry
Once a scan is initiated, the platform leverages optimized concurrent API requests and long-polling to provide live feedback. The YOLOv8 object detection model scans the sectors, pinpointing commercial trucks with high confidence scores in real-time.

![Processing Execution](./docs/images/Scan%20processing%20progress%20status.png)

![Scan Complete](./docs/images/After%20the%20scan%20processing%20is%20complete.png)

### 4. Operational Audit & Archive
A structured archive system for tracking historical operations. Every scan retains detailed coordinates, confidence scores, and processing timelines for auditing and future data analysis.

![Operations Archive](./docs/images/Archive%20of%20previous%20scan%20processes.png)

---

## Technical Architecture

This system is engineered with a strict focus on performance, scalability, and clean code principles.

### Backend (The Engine)
* **Laravel 11:** Serves as a robust API and logic handler.
* **Eloquent Optimization:** Utilizes Eager Loading and direct Database Pagination to handle thousands of fleet records without memory bottlenecks (Zero N+1 queries).
* **Job Queues & Background Processing:** Asynchronous handling of Mapbox satellite image fetching and heavy ML processing.
* **Laravel Breeze:** Secure, modern authentication scaffolding with Role-Based Access Control (RBAC).

### Frontend (The Interface)
* **React 18 & Inertia.js:** Delivers a lightning-fast Single Page Application (SPA) experience without the overhead of standalone API routing or complex state management architectures.
* **Tailwind CSS:** Fully responsive, modern UI design ensuring optimal viewing across all dispatch environments.
* **Leaflet & Mapbox:** High-performance, interactive geospatial mapping integration.

### AI & Computer Vision
* **YOLOv8:** Custom-trained object detection model (managed via Roboflow) specifically tuned for identifying commercial logistical assets from aerial perspectives.

---

## Getting Started

Follow these instructions to spin up the project in your local development environment.

### Prerequisites
* PHP 8.2+
* Composer
* Node.js & npm
* MySQL / PostgreSQL
* Mapbox API Token

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/alaa2980/scanops.git
cd scanops
```

**2. Install dependencies:**
```bash
composer install
npm install
```

**3. Environment Setup:**
```bash
cp .env.example .env
php artisan key:generate
```
Configure your database credentials and append your Mapbox token (MAPBOX_TOKEN & VITE_MAPBOX_TOKEN) in the .env file.


**4. Run Migrations & Link Storage:**
```bash
php artisan migrate --seed
php artisan storage:link
```

**5. Serve the Application:**
Open three terminal windows to run the backend, queue worker, and frontend build tool concurrently:

```bash
# Terminal 1: Backend Server
php artisan serve

# Terminal 2: Queue Worker (For AI Image Processing)
php artisan queue:work

# Terminal 3: Vite Dev Server
npm run dev
```

## Developer

Developed by Alaa Moh. Al-Waseai — A Full-Stack Software Engineer & Web/Mobile Developer specializing in modern architectures, logical system design, and AI integrations. Built to solve real-world operational challenges through structured frameworks.