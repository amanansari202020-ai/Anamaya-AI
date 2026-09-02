# Anamaya AI 🏥

## Connecting Every Patient to the Right Care, at the Right Place, at the Right Time.

### An AI-Powered Rural Healthcare Navigation & Continuity Platform

**GitHub Repository**: [https://github.com/amanansari202020-ai/Anamaya-AI](https://github.com/amanansari202020-ai/Anamaya-AI)  
**Live Local Preview**: [http://localhost:8001](http://localhost:8001) | **Backend API**: [http://localhost:8000](http://localhost:8000)

---

## 🎯 Project Overview

**Anamaya AI** (formerly HealthSphere AI) is an end-to-end, multilingual healthcare navigation platform designed specifically for rural, remote, and underserved communities. It bridges critical healthcare access gaps by providing:

- 🤖 **Interactive AI Health Guidance**: Conversational symptom assessment wizard with urgency detection and instant treatment cost estimates.
- 📷 **AI Photo Symptom Analysis**: Visual reaction screening for skin rashes, burns, or lesions with medical precautions and specialist guidance.
- 💬 **AI Care Assistant Chatbox**: Embedded conversational chatbox in the AI Assessment suite with `Enter` key submit and voice output support.
- 🗺️ **Real Location-Based Facility Discovery**: GPS Geolocation integration (`navigator.geolocation`), Nominatim search, Leaflet interactive map, and OpenStreetMap Overpass API for real hospitals, clinics, PHCs, and CHCs with Haversine distance calculations.
- 🚨 **Real 24x7 Emergency SOS**: Instant location-based emergency medical facility search with direct phone dialers (`tel:`), Google Maps directions, and 1-click SMS/WhatsApp location alerts.
- 💳 **Digital Health Passport**: Portable medical history card with Patient Name, Blood Group, Last Visit, Conditions, and `HS-2048` passport code, fully responsive to Dark and Light theme toggled modes.
- 🏷️ **Interactive 2-Step Registration**: Clean dark-theme auth cards with tap-to-select chips for Gender, Age Group, Existing Conditions, Allergies, and Emergency Contacts.
- 🌐 **Multilingual & Voice Support**: Seamless English (`en`), Hindi (`hi`), and Marathi (`mr`) internationalization across 412+ translation keys with voice assistant speech output (`speakAssistant`).
- 🐷 **Community Support**: Floating orange gradient donation button and modal for rural healthcare access funding.

---

## 🏗️ Technology Stack

### Web Frontend & UI Engine
- **Core Technology**: Vanilla HTML5, Modern JavaScript (ES6+), Vanilla CSS Design System.
- **Theme Architecture**: CSS Custom Properties (`--bg`, `--panel-solid`, `--text`, `--muted`, `--border`, `--shadow`) supporting dynamic Dark Mode (`body[data-theme="dark"]`) and Light Mode transitions.
- **Mapping & GIS**: Leaflet.js (Interactive OpenStreetMap tile layer), Geolocation API (`navigator.geolocation`), Nominatim Geocoding API, OpenStreetMap Overpass API (`amenity=hospital`, `amenity=clinic`).
- **Audio & Voice**: Web Speech API (`SpeechSynthesisUtterance`) for multilingual voice guidance.

### Backend API
- **Framework**: FastAPI (Python 3.9+)
- **Database & ORM**: PostgreSQL / SQLite + SQLAlchemy ORM (16 Core Tables)
- **Authentication**: JWT tokens (OAuth2 with Passlib & bcrypt)
- **API Docs**: OpenAPI / Swagger UI at `http://localhost:8000/docs`

---

## 📦 Project Structure

```
Anamaya-AI/
├── website/                   # Production Web Application
│   ├── index.html            # Main Single-Page Application (SPA) shell & workspace panels
│   ├── script.js             # Client logic (Routing, Geolocation, Leaflet map, i18n, Chatbot, SOS)
│   ├── styles.css            # Complete design system & Dark/Light mode theme CSS tokens
│   └── translations.js       # Multilingual dictionary (English, Hindi, Marathi - 412 keys)
│
├── backend/                   # FastAPI Python backend
│   ├── app/
│   │   ├── models/           # SQLAlchemy DB models (Users, Facilities, Assessments, Passport)
│   │   ├── services/         # AI Guidance engine, Image analysis, Facility search logic
│   │   ├── database/         # SQLite/PostgreSQL connection & DB migration scripts
│   │   ├── schemas.py        # Pydantic data validation
│   │   └── main.py           # FastAPI application entry point
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Backend environment configuration
│
├── frontend/                  # React Native + Expo Mobile Application (Optional build)
├── index.html                 # Root web entry point (synced with website/index.html)
├── start_app.bat              # 1-Click Windows launch script
└── README.md                  # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.9+** (For backend API)
- **Node.js 16+** (Optional for scratch testing/tooling)
- Modern web browser (Chrome, Edge, Firefox, Safari with Geolocation enabled)

### Running the Platform (1-Click)

On Windows, double-click **`start_app.bat`** or run:

```powershell
.\start_app.bat
```

### Manual Setup Steps

#### 1. Launch Backend API (Terminal 1)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python app/main.py
```
> Backend runs at: `http://localhost:8000` (Swagger docs: `http://localhost:8000/docs`)

#### 2. Launch Web Application (Terminal 2)
```bash
cd website
python -m http.server 8001
```
> Web Application runs at: `http://localhost:8001`

---

## 🌟 Key Application Features & Workflows

### 1. Public Landing vs. Post-Registration Workspace Isolation
- **Public Landing Page**: Features hero eyebrow, patient journey, feature cards, impact statistics, and floating donation pig button 🐷.
- **Workspace App Shell**: Shown post-registration/login at `http://localhost:8001/#workspace/dashboard`. Automatically hides landing marketing sections for a clean, focused application dashboard with sidebar navigation.

### 2. Interactive 2-Step Registration & Health Profile
- **Step 1**: Basic Details (Full Name, Email, Phone Number, Home Address).
- **Step 2**: Interactive Health Profile Chips:
  - **Gender**: `👨 Male`, `👩 Female`, `⚧ Other`
  - **Age Group**: `👶 Child (under 12)`, `🧑 Adult (12-60)`, `👴 Elderly (60+)`
  - **Existing Conditions**: `🩸 Diabetes`, `❤️ Heart / BP`, `😮💨 Asthma`, `🤰 Pregnancy`, `🦴 Injury / Disability`, `✅ None of these`
  - **Allergies**: `❌ No` / `⚠️ Yes` toggle with voice input button 🎤.
  - **Emergency Contact**: Name, Phone Number, and Relationship.

### 3. Real Location-Based Facilities Discovery
- **Geolocation API**: Requests browser GPS coordinates (`navigator.geolocation.getCurrentPosition`).
- **OpenStreetMap Overpass API**: Queries real hospitals and clinics within configurable radii (10 km, 25 km, 50 km).
- **Fallback Database**: 10 real Maharashtra healthcare facilities (*Navi Mumbai Municipal Hospital Vashi*, *MGM Hospital Kamothe*, *Panvel Sub-District Hospital*, *KEM Hospital Mumbai*, *Civil Hospital Alibag*, etc.).
- **Haversine Distance**: Displays exact calculated distances (`📍 X.X km away`).
- **Interactive Leaflet Map**: Renders map pins for user location and nearby facilities with clickable popups.

### 4. Digital Health Passport
- Structured rounded card (`.passport-card`) displaying:
  - **Patient**: Registered user name (dynamically synced)
  - **Blood group**: `O+`
  - **Last visit**: `12 Aug 2026`
  - **Conditions**: Registered profile health conditions
  - **Consent**: `Shared with PHC`
  - **Passport Code**: `HS-2048`
- **Theme Responsiveness**: Card background, borders, and text automatically change between Dark Mode (`#10263a` dark card background) and Light Mode (`#ffffff` card background) when toggling themes.

### 5. Real 24x7 Emergency SOS
- Location-based 24x7 emergency medical centers and trauma units query.
- Instant 1-click **Send My Location Now** button that sends current GPS coordinates via simulated SMS & WhatsApp to your emergency contact.
- Direct **📞 Call Facility** dialer buttons (`tel:`) and **🗺️ Get Directions** Google Maps route links.

### 6. AI Assessment & AI Care Assistant Chatbox
- **5-Step Assessment Wizard**: Symptoms selection, severity chips (`🙂 Mild`, `😟 Moderate`, `😰 Severe`), duration, location, and health check summary.
- **Cost Estimator**: Displays estimated consultation, diagnostics, and medicine expenses (`Total estimate: ₹1,050`).
- **Embedded AI Chatbox (`.chatbot-box`)**:
  - Text-based health Q&A with `Enter` key submit listener.
  - Photo attachment 📷 for visual skin rash/lesion analysis (`/api/health/analyze-image`).
  - Multilingual voice output 🔊 using `speakAssistant()`.

### 7. Multilingual Internationalization (i18n)
- 412+ synchronized translation keys across **English (`en`)**, **Hindi (`hi`)**, and **Marathi (`mr`)**.
- Fallback hierarchy in `setLanguage(lang)` ensures 100% of UI elements (including wizard chips, sidebar Emergency SOS, and chat prompts) switch languages seamlessly.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new patient account |
| `POST` | `/auth/login` | Authenticate user & get JWT token |
| `GET` | `/api/emergency/nearby-facilities` | Fetch nearby emergency hospitals by lat, lon & radius |
| `POST` | `/api/health/analyze-image` | AI visual analysis for symptom photos |
| `POST` | `/api/health/guidance` | AI conversational health guidance |
| `GET` | `/api/health-passport` | Retrieve digital health passport data |
| `POST` | `/api/schemes/match` | Assessment of government health scheme eligibility |

---

## 📄 License & Attribution

Developed for hackathons and community healthcare initiatives. OpenStreetMap data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).

---

*"Connecting Every Patient to the Right Care, at the Right Place, at the Right Time." 🏥*
