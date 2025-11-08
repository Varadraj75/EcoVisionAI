# EcoVision AI - Sustainability Analytics Platform

## Overview
EcoVision AI is a comprehensive sustainability analytics platform combining a polished React dashboard, secure backend API with Firebase authentication, and ML-powered consumption predictions. The platform helps users visualize, predict, and reduce their energy, water, and transportation-related carbon impact.

## Project Status
**Current Phase**: MVP Implementation Complete - Integration Phase

### Completed Features
✅ Beautiful homepage with hero section and smooth animations
✅ Firebase Google Sign-In authentication setup
✅ User consumption input feature with PostgreSQL persistence
✅ Dashboard with sidebar navigation and metric visualizations
✅ Predictions page with ML energy forecasting
✅ Eco-route optimization page
✅ AI sustainability assistant chat interface
✅ Dark/light mode theme toggle
✅ Backend API endpoints for all features
✅ PostgreSQL database for user data and consumption profiles
✅ In-memory storage with real Kaggle datasets
✅ Responsive design with Tailwind CSS

### Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Shadcn UI
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon) for user profiles and consumption data
- **Auth**: Firebase Authentication (Google Sign-In + Email/Password)
- **Data**: PostgreSQL + In-memory storage with Kaggle sustainability datasets
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
- `POST /api/auth/signup` - Register new user with email/password
- `POST /api/auth/login` - Authenticate user with email/password
- `GET /api/auth/user/:uid` - Get user by Firebase UID

### User Consumption Profiles
- `GET /api/consumption/profile/:userId` - Get user's consumption profile
- `POST /api/consumption/profile` - Save or update user's monthly consumption data
  - Body: `{ userId: number, monthlyEnergyKwh?: number, monthlyWaterLiters?: number, monthlyCo2Kg?: number }`

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
Required configuration (already set in Replit Secrets):
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Express session secret
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID
- `VITE_FIREBASE_API_KEY` - Firebase API key

## Data Sources
All consumption data is sourced from real Kaggle sustainability datasets including:
- Energy consumption patterns (kWh daily usage)
- Water usage trends (liters per day)
- Carbon emissions (kg CO₂ per day)
- Transportation carbon footprint data

## Recent Changes (Nov 8, 2025)
- **User Consumption Input Feature**: Added consumption data entry form after login
  - Created `userConsumptionProfiles` PostgreSQL table
  - Built ConsumptionInput.tsx page with form validation
  - Added GET/POST API endpoints for consumption profiles
  - Integrated into login flow: users enter baseline consumption data before accessing dashboard
  - Data persists to database and pre-populates form on subsequent visits
  - **Dashboard Integration**: User's consumption data now displays in "Your Monthly Targets" section
    - Shows monthly baseline values for energy, water, and carbon footprint
    - Automatically calculates and displays daily averages
    - Updates in real-time when user modifies their consumption profile
    - Fixed decimal data type handling for all usage metrics
  - **Bug Fixes**:
    - Fixed mutation request body construction by removing spread operator
    - Added proper authentication checks and response validation
    - Improved error handling with console logging for debugging
- Replaced all Leaf icons with custom logo (finallogo_1762610950666.png)
- Fixed mobile header overflow on landing page with responsive design
- Set up PostgreSQL database integration with Drizzle ORM
- Added comprehensive end-to-end testing for consumption input and dashboard display

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
1. User lands on beautiful homepage with custom logo branding
2. Signs in with Google or Email/Password via Firebase
3. New users redirected to consumption input page to enter baseline data:
   - Monthly energy consumption (kWh)
   - Monthly water usage (Liters)
   - Monthly carbon footprint (kg CO₂)
4. After saving (or skipping), redirected to dashboard showing consumption analytics
5. Dashboard displays user's monthly baseline targets with daily averages
6. Can navigate to predictions, eco-routes, or AI assistant via sidebar
7. Consumption profile data persists in PostgreSQL database and updates across all pages
8. All historical data from Kaggle datasets available for analytics
