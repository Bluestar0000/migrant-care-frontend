# MigrantCare — HealthBridge Platform

A full stack healthcare platform designed to provide accessible medical care for migrant workers, with role-based dashboards, QR-based patient identification, and AI-powered health recommendations.

## Live Demo
- Frontend: https://migrant-care-frontend.vercel.app
- Backend API: https://migrant-care-backend.onrender.com

## Features

### Patient Dashboard
- Personal health QR code for doctor scanning
- Emergency contact display (blood group, language, contact)
- Symptom input with AI-powered recommendations
- Medical records and eligible government schemes

### Doctor Dashboard
- QR code / Migrant ID patient lookup
- Full patient profile — blood group, language, emergency contact
- Medical history and previous records

### Authority Dashboard
- Real-time disease outbreak monitoring
- Color-coded risk map by region (Critical/High/Medium/Low)
- One-click alert system for outbreak regions
- Metrics — total migrants, scheme eligibility, AI alerts

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router |
| Backend | Django, Django REST Framework |
| Database | PostgreSQL (SQLite dev) + MongoDB (MongoEngine) |
| Auth | Token-based authentication |
| Deployment | Vercel (frontend), Render (backend) |
| Cloud DB | MongoDB Atlas |

## Setup

### Backend
```bash
git clone https://github.com/Bluestar0000/HealChain
cd HealChain
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # fill in MONGO_URI and DJANGO_SECRET_KEY
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
git clone https://github.com/Bluestar0000/migrant-care-frontend
cd migrant-care-frontend
npm install
npm start
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/login/ | Role-based login |
| GET | /api/my-profile/ | Logged-in patient profile + QR |
| POST | /api/qr-lookup/ | Doctor patient lookup |
| POST | /api/ai-recommendations/ | Symptom-based recommendations |
| GET | /api/outbreak-summary/ | Disease outbreak data |
| GET | /authority_dashboard_metrics/ | Region and metrics data |

## Screenshots
### Login
<img width="920" height="383" alt="image" src="https://github.com/user-attachments/assets/ce6e8feb-0256-449f-90e3-6ea18edb59fc" />
### Patient Dashboard
<img width="938" height="431" alt="image" src="https://github.com/user-attachments/assets/a9c7cf5f-4681-4329-a140-37ff623cb7f7" />
### Doctor Dashboard
<img width="937" height="428" alt="image" src="https://github.com/user-attachments/assets/508ac49d-84f7-4cfb-99f9-bead7687c7cf" />
### Authority Dashboard
<img width="662" height="232" alt="image" src="https://github.com/user-attachments/assets/2fffd0c1-c6e6-43b6-a1ba-2ecad9d1b648" />



