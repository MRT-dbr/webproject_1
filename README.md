# Full-Stack Software Engineer Portfolio

A premium modern portfolio for a software engineering student, built with:
- Frontend: Next.js + Tailwind CSS + Framer Motion
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Deployment: Vercel (frontend) + Render (backend)

## Features

### Frontend
- Animated hero, typing role animation, glassmorphism + neon gradient theme
- Dark/light mode toggle
- Projects with category filters and search
- Skills progress bars, services, timeline, testimonials, blog preview
- Contact form with API integration
- SEO metadata + sitemap + robots
- Responsive navigation/footer and custom 404 page
- Google Analytics-ready integration

### Backend
- JWT admin authentication
- CRUD APIs for projects and blog posts
- Contact form endpoint with optional email notification
- Cloudinary image upload support
- MongoDB models and validation with Zod
- Centralized security middleware and error handling
- Visitor counter endpoint

## Folder Structure

`frontend/` - Next.js app, UI components, animations, SEO  
`backend/` - Express API, auth, DB models, routes, middleware  
`docs/` - API docs and deployment references

## Installation Guide

1. Install dependencies:
   - `npm install --prefix frontend`
   - `npm install --prefix backend`
2. Configure environment variables:
   - Copy `frontend/.env.example` to `frontend/.env.local`
   - Copy `backend/.env.example` to `backend/.env`
3. Start development:
   - Backend: `npm run dev --prefix backend`
   - Frontend: `npm run dev --prefix frontend`
4. Seed admin user (dev):
   - `POST http://localhost:5000/api/auth/seed-admin`

## Environment Variables

See:
- `frontend/.env.example`
- `backend/.env.example`

## Deployment Guide

### 1) MongoDB Atlas
- Create cluster and database user
- Add IP access for Render backend
- Copy connection string into `MONGODB_URI`

### 2) Render (Backend)
- Create a Web Service from `backend/`
- Build command: `npm install`
- Start command: `npm start`
- Add env vars from `backend/.env.example`
- Set `FRONTEND_URL` to your Vercel domain

### 3) Vercel (Frontend)
- Import `frontend/` as project
- Framework preset: Next.js
- Add env vars from `frontend/.env.example`
- Set `NEXT_PUBLIC_API_URL` to your Render URL + `/api`

## API Documentation

Detailed endpoints are in `docs/API.md`.

## Production Notes

- Replace placeholder resume file at `frontend/public/resume-placeholder.txt` with `resume.pdf`
- Add real social and GitHub links in `frontend/components/PortfolioPage.tsx`
- Add secure random `JWT_SECRET` and rotate secrets regularly
- Configure monitoring (Vercel Analytics, Render logs, MongoDB Atlas metrics)
