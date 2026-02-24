# HireHive

A full-stack, stunningly designed job portal (HireHive) built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS v4.

## Features

- **Authentication**: Secure JWT-based user authentication with integrated Captcha security.
- **Admin Panel**: Dedicated dashboard for overall platform management, including user and job cleanup.
- **Job Seeker**: Browse jobs, filter by skills/location/type, upload resumes, and apply seamlessly.
- **Recruiter**: Post new job listings, manage applicants, and review candidate profiles.
- **Premium Design**: Modern dark mode with glassmorphism aesthetics and smooth animations.

## Live Demo (Localtunnel)

## Deployment
The project is prepared for deployment. Follow the [Deployment Guide](file:///Users/priyanshusingh/.gemini/antigravity/brain/91bc7cb9-16f3-488c-b704-1364e35e0d97/deployment_guide.md) to go live on a production server.

## Getting Started

### 1. Prerequisites
- Node.js installed
- MongoDB installed and running locally, or a MongoDB connection URI

### 2. Backend Setup
```bash
cd backend
npm install
```
- A default `.env` is provided with `MONGO_URI=mongodb://127.0.0.1:27017/jobportal` and a sample `JWT_SECRET`.
- Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
- Start the Vite development server:
```bash
npm run dev
```

### 4. Seed Database (Optional)
To populate the database with a sample recruiter, a job seeker, and a few job listings:
```bash
cd backend
node seeder.js
```

- **Master Admin**: `admin@hirehive.com` / `AdminPassword123!`
- **Sample Recruiter**: `admin@example.com` / `123456`
- **Sample Seeker**: `john@example.com` / `123456`
