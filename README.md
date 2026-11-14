# KOro

A minimal, dark-themed notes application built with React, TypeScript, Laravel, and PostgreSQL.

## About

KOro is a personal notes application designed to make writing and organizing notes simple. It combines a minimal interface with a backend designed for secure and reliable data management.

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- CSS

**Backend**
- PHP
- Laravel
- Eloquent ORM

**Database**
- PostgreSQL

## Features

- Create and manage notes
- Edit and delete existing notes
- Search through notes
- Persistent note storage

## Development Status

KOro is currently under active development.

The frontend design is largely complete. Current development focuses on:

- **Authentication:** Implementing a secure login and registration system.
- **Database:** Building a proper PostgreSQL database structure and data management system.
- **Security:** Implementing HTTPS, secure sessions, and appropriate security measures.
- **Integration:** Connecting the React frontend with the Laravel backend.

## Project Structure

```text
koro/
├── frontend/       # React application
└── backend/        # Laravel API
```

## Getting Started

### Prerequisites

- Node.js and npm
- PHP
- Composer
- PostgreSQL

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure your PostgreSQL credentials in `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=koro
DB_USERNAME=koro_user
DB_PASSWORD=your_password
```

Run migrations and start the development server:

```bash
php artisan migrate
php artisan serve
```

## License

This project is currently unlicensed.
