# MadiSynthia Customer Portal

The customer-facing web app for MadiSynthia Courier. Customers can book and track parcels, manage their account, view delivery history, and apply to become a rider.

## Features

- Parcel booking and delivery progress tracking
- Shipping estimates, zone rates, and service coverage
- Customer accounts, order history, and notifications
- Rider applications and application status
- English and Bangla interface

## Tech stack

React, Vite, React Router, Axios, Tailwind CSS, and Lucide icons.

## Getting started

Requirements: Node.js and npm, plus the Courier backend running locally or at a configured API URL.

```bash
cd UserFrontend
npm install
cp .env.example .env
npm run dev
```

Vite serves the portal at [http://localhost:5174](http://localhost:5174).

Set the backend API URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5003/api
```

For local development, make sure the backend allows the portal origin `http://localhost:5174` in its CORS configuration.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Main routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/book-delivery` | Book a parcel |
| `/tracking` | Track a shipment |
| `/zone-rates` | Zone rates |
| `/calculate-shipping` | Shipping calculator |
| `/orders` | Customer orders |
| `/profile` | Customer profile |
| `/notifications` | Notifications |
| `/apply-as-rider` | Rider application |

## Project structure

```text
src/
├── api/          Backend API clients
├── components/   Shared interface and feature components
├── context/      Authentication, language, and notification state
├── hooks/        Reusable React hooks
├── pages/        Route-level screens
└── utils/        Formatting, media, and order helpers
```
# courier-frontend
