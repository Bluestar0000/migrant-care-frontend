# MigrantCare Frontend

A role-based healthcare platform built for migrant workers, enabling QR-based patient identification, AI-assisted health recommendations, and real-time outbreak monitoring across regions.

## Live Deployment
- Frontend: https://migrant-care-frontend.vercel.app
- Backend API: https://migrant-care-backend.onrender.com

## Overview

MigrantCare addresses healthcare accessibility challenges faced by migrant workers, particularly in situations involving language barriers, lack of medical history, and emergency identification. The platform provides three role-specific dashboards tailored to patient, clinical, and administrative workflows.

## Role-Based Dashboards

**Patient Dashboard**
Patients receive a unique QR health card encoding their migrant ID. The card displays blood group and preferred language for emergency situations, along with emergency contact information. Patients can enter symptoms and receive rule-based health recommendations with guidance on home care, doctor visits, and precautions.

**Doctor Dashboard**
Doctors look up patients by scanning or entering a QR/migrant ID. Patient details are returned instantly — name, age, blood group, language, home hospital, and emergency contact — designed for use in low-connectivity and language-barrier situations.

**Authority Dashboard**
Government and health authority users see aggregated outbreak data with color-coded risk levels per disease and region. A one-click alert system allows authorities to dispatch region-specific outbreak notifications. Summary metrics include total registered migrants, scheme eligibility counts, and AI-generated health alerts.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router v6 |
| Backend | Django REST Framework |
| Database | MongoDB Atlas (MongoEngine) + SQLite |
| Authentication | DRF Token Authentication |
| Deployment | Vercel (frontend), Render (backend) |

## Getting Started

**Prerequisites:** Node.js 16+, npm

```bash
git clone https://github.com/Bluestar0000/migrant-care-frontend.git
cd migrant-care-frontend
npm install
npm start
