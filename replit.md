# EcoVision AI - Sustainability Analytics Platform

## Overview
EcoVision AI is a comprehensive sustainability analytics platform combining a polished React dashboard, secure backend API with Firebase authentication, and ML-powered consumption predictions. The platform helps users visualize, predict, and reduce their energy, water, and transportation-related carbon impact.

## Project Status
**Current Phase**: MVP Implementation Complete - Integration Phase

### Completed Features
✅ Beautiful homepage with hero section and smooth animations
✅ Firebase Google Sign-In authentication setup
✅ Dashboard with sidebar navigation and metric visualizations
✅ Predictions page with ML energy forecasting
✅ Eco-route optimization page
✅ AI sustainability assistant chat interface
✅ Dark/light mode theme toggle
✅ Backend API endpoints for all features
✅ In-memory storage with real Kaggle datasets
✅ Responsive design with Tailwind CSS

### Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Shadcn UI
- **Backend**: Express.js + TypeScript
- **Auth**: Firebase Authentication (Google Sign-In)
- **Data**: In-memory storage with Kaggle sustainability datasets
- **Styling**: Neo-glass aesthetic with Framer Motion animations

## Tech Stack
- React 18 with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Firebase Authentication
- Recharts for data visualization
- Framer Motion for animations
- Shadcn UI components
- Tailwind CSS for styling

## API Endpoints

### Authentication
- `POST /api/auth/upsert` - Create or update user profile
- `GET /api/auth/user/:uid` - Get user by Firebase UID

### Usage Data
- `GET /api/usage/history/:uid` - Get user's consumption history

### Predictions
- `POST /api/predictions/energy` - Get ML-powered energy prediction
  - Body: `{ temperature: number, day: number, usage_prev: number }`

### Routes
- `POST /api/eco/route` - Get eco-friendly route options
  - Body: `{ origin: string, destination: string }`
- `GET /api/routes/history/:uid` - Get user's route history
- `POST /api/routes/log` - Log a selected route

### Tips
- `GET /api/tips/daily` - Get sustainability tips

## Environment Variables
Required Firebase configuration (already set in Replit Secrets):
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_API_KEY`

## Data Sources
All consumption data is sourced from real Kaggle sustainability datasets including:
- Energy consumption patterns (kWh daily usage)
- Water usage trends (liters per day)
- Carbon emissions (kg CO₂ per day)
- Transportation carbon footprint data

## Recent Changes
- Moved Kaggle data from client to server (proper separation of concerns)
- Implemented all backend API endpoints
- Created comprehensive frontend UI with all pages
- Set up Firebase authentication flow
- Added dark/light mode support

## Next Steps
- Continue integration of frontend with backend APIs
- Add comprehensive testing
- Optimize performance
- Add more sophisticated ML models

## Development
The app runs on port 5000 with:
- Express backend serving API routes
- Vite dev server for frontend with HMR
- Concurrent mode for seamless development

## User Flow
1. User lands on beautiful homepage
2. Signs in with Google via Firebase
3. Redirected to dashboard showing consumption analytics
4. Can navigate to predictions, routes, or AI assistant
5. All data persists in memory during session
