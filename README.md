# ScanOps | AI-Powered Logistics & Yard Management System

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![YOLOv8](https://img.shields.io/badge/YOLOv8-00FFFF?style=for-the-badge&logo=yolo&logoColor=black)

**ScanOps** is an enterprise-grade B2B platform designed specifically for the construction and logistics sectors. It bridges the gap between modern web applications and computer vision, enabling operations teams to scan large logistical yards via satellite imagery and automatically detect commercial truck fleets using advanced Machine Learning models.

## Core Features

*   **Interactive Geo-Scanning:** Draw precision polygons over target logistical zones using Mapbox and Leaflet integrations, breaking down massive yards into manageable processing sectors.
*   **AI Fleet Detection:** Seamless integration with a custom-trained **YOLOv8** object detection model (managed via Roboflow) to identify and pinpoint commercial trucks with high confidence scores.
*   **Real-Time Progress Tracking:** Utilizes optimized concurrent API requests and long-polling to provide live feedback on sector processing and truck detection without page reloads.
*   **Enterprise Dashboard:** A custom-built, zero-dependency analytics dashboard featuring native Tailwind CSS charts, tracking system health, team performance, and fleet detection volumes.
*   **Role-Based Access Control (RBAC):** Hierarchical access levels (`Admin`, `Manager`, `Dispatcher`) powered by strict Laravel Middleware, ensuring data security and operational integrity.

## Technical Architecture

This system is built with a focus on performance, scalability, and clean code principles.

**Backend (The Engine):**
*   **Laravel 11:** Serves as a robust API and logic handler.
*   **Eloquent Optimization:** Utilizes Eager Loading and direct Database Pagination to handle potentially thousands of fleet records without memory bottlenecks (N+1 query prevention).
*   **Laravel Breeze:** Secure, modern authentication scaffolding.

**Frontend (The Interface):**
*   **React 18 & Inertia.js:** Delivers a lightning-fast Single Page Application (SPA) experience without the complexity of a standalone API and state management like Redux.
*   **Tailwind CSS:** Fully responsive, modern "Glassmorphism" UI design, ensuring the dashboard looks phenomenal across all devices.

**AI & Computer Vision:**
*   **YOLOv8:** Trained on a custom dataset for high-accuracy commercial truck detection.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
*   PHP 8.2+
*   Composer
*   Node.js & npm
*   MySQL / PostgreSQL
*   Mapbox API Token

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/alaa2980/scanops.git](https://github.com/alaa2980/scanops.git)
    cd scanops
    ```

2.  **Install PHP dependencies:**
    ```bash
    composer install
    ```

3.  **Install Node dependencies:**
    ```bash
    npm install
    ```

4.  **Environment Setup:**
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
    *Make sure to configure your database credentials and add your `VITE_MAPBOX_TOKEN` in the `.env` file.*

5.  **Run Migrations & Seeders:**
    ```bash
    php artisan migrate --seed
    ```

6.  **Serve the Application:**
    Open two terminal windows to run both the backend and the frontend build tool:
    ```bash
    # Terminal 1
    php artisan serve

    # Terminal 2
    npm run dev
    ```

## Developer

Developed with passion by a **Full-Stack Software Engineer** specializing in modern web, mobile development, and AI integrations. Built to solve real-world operational challenges.