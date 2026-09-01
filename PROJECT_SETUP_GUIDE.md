# HealthSphere AI - Complete Project Setup Guide

**"Connecting Every Patient to the Right Care, at the Right Place, at the Right Time."**

---

## 📋 Project Overview

HealthSphere AI is an AI-powered rural healthcare navigation and continuity platform designed to solve critical healthcare challenges in rural and underserved communities:

✅ **Solves Real Problems:**
- 🏥 Reduces unnecessary travel to wrong healthcare facilities
- 🔗 Maintains continuity of medical records across facilities
- 🚀 Enables faster patient referrals between healthcare levels
- 💡 Provides intelligent healthcare guidance
- 💰 Estimates affordable healthcare pathways
- 🏛️ Connects patients to government health schemes
- 📱 Works offline with auto-sync capability

## 🏗️ Complete Architecture

### Backend Stack
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (or SQLite for development)
- **ORM**: SQLAlchemy
- **Auth**: JWT with Passlib
- **API**: RESTful with comprehensive documentation
- **Port**: 8000

### Frontend Stack
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **UI Library**: React Native Paper
- **Navigation**: React Navigation
- **Storage**: AsyncStorage + SQLite (offline)

### Database Models (16 Core Tables)
1. **users** - User accounts
2. **patient_profiles** - Detailed patient info
3. **health_records** - Digital health passport
4. **symptom_assessments** - AI assessment results
5. **healthcare_facilities** - Facility database
6. **referrals** - Referral management
7. **consultations** - Consultation records
8. **government_schemes** - Health schemes
9. **medicines** - Medicine information
10. **data_sync** - Offline sync tracking
11. And more...

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 12+ (or use SQLite for dev)
- Android Studio or XCode (for emulator)
- Git

### Step 1: Clone Project
```bash
# Navigate to workspace
cd "c:\Users\shahreena\OneDrive\Desktop\HealthSphere AI"

# Verify structure
ls -la
# Should show: backend/ frontend/ README.md
```

### Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env

# Edit .env with your configuration
# For development, you can use SQLite:
# DATABASE_URL=sqlite:///./healthsphere.db

# Start backend server
python app/main.py
# Or with Uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will be available at: **http://localhost:8000**
API Docs: **http://localhost:8000/docs**

### Step 3: Setup Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Start Expo dev server
npm start

# Choose platform:
# Press 'a' for Android emulator
# Press 'i' for iOS simulator
# Press 'w' for web browser
```

## 📊 Testing the Complete System

### 1. Register New Patient
```bash
POST http://localhost:8000/auth/register
{
  "email": "patient@example.com",
  "password": "securepassword123",
  "full_name": "Test Patient",
  "phone": "9876543210",
  "role": "patient"
}
```

### 2. Login
```bash
POST http://localhost:8000/auth/login
{
  "email": "patient@example.com",
  "password": "securepassword123"
}
```

### 3. Assess Symptoms
```bash
POST http://localhost:8000/api/health/assess
Authorization: Bearer <token>
{
  "symptoms": ["fever", "headache", "body pain"],
  "duration": "2 days",
  "severity": "moderate"
}
```

### 4. Find Nearby Facilities
```bash
GET http://localhost:8000/api/facilities/nearby?latitude=19.0760&longitude=72.8777&facility_level=phc&radius_km=50
Authorization: Bearer <token>
```

### 5. Create Referral
```bash
POST http://localhost:8000/api/referral/create
Authorization: Bearer <token>
{
  "referral_reason": "Needs specialist evaluation",
  "symptoms": ["fever", "headache"],
  "to_facility_id": 1
}
```

## 🎯 Core Features Walkthrough

### 1. AI Health Guidance
- Patient enters symptoms (text or voice)
- AI analyzes symptoms using symptom-condition mapping
- Detects emergency warning signs
- Recommends appropriate healthcare facility level
- Suggests relevant specialists
- Provides medical disclaimer

**Files**: 
- Backend: `app/services/ai_guidance.py`
- Frontend: `src/screens/health/HealthCheckScreen.tsx`

### 2. Healthcare Facility Discovery
- Location-based search using Haversine formula
- Filter by facility level (Sub-centre → District Hospital)
- Shows distance, services, specialists, emergency availability
- Integration-ready for Google Maps/OpenStreetMap

**Files**:
- Backend: `app/services/facility_finder.py`
- Frontend: `src/screens/facilities/`

### 3. Smart Referral System
- AI-assisted referral generation
- Unique referral IDs with QR codes
- Status tracking (Pending → Accepted → Completed)
- Structured referral with patient history
- Access control and logging

**Files**:
- Backend: `app/services/referral.py`
- Frontend: `src/screens/referral/ReferralScreen.tsx`

### 4. Digital Health Passport
- Comprehensive health record organization
- Record types: Consultations, Diagnostics, Prescriptions
- Consent-based sharing with facilities
- Access history tracking
- Ability to revoke access
- QR code export

**Files**:
- Backend: `app/services/health_record.py`
- Frontend: `src/screens/health/HealthPassportScreen.tsx`

### 5. Offline Sync
- Download essential data locally
- Create referrals offline
- View health records offline
- View government schemes offline
- Auto-sync when connectivity returns
- Conflict resolution mechanism

**Files**:
- Backend: `app/models/__init__.py` (DataSync table)
- Frontend: Implemented in stores and services

### 6. Government Schemes Matcher
- 50+ government healthcare schemes
- Eligibility assessment based on:
  - Age group
  - State
  - Income category
  - Employment status
- Shows benefits, eligibility, application process
- Links to official websites

**Files**:
- Backend: `app/services/government_scheme.py`
- Frontend: `src/screens/schemes/GovernmentSchemesScreen.tsx`

### 7. Budget Estimator
- Estimates healthcare costs by facility level
- Categories: Consultation, Diagnostics, Travel, Medicine
- Shows government scheme options
- Clear cost disclaimers

**Files**:
- Backend: `app/services/ai_guidance.py` (estimate_budget method)
- Frontend: `src/screens/budget/BudgetEstimatorScreen.tsx`

## 📱 Frontend Navigation Structure

```
Login/Register
    ↓
Dashboard (Home)
    ├── AI Health Check
    │   ├── Symptom Input
    │   ├── Assessment Result
    │   └── Healthcare Journey
    ├── Find Healthcare
    │   ├── Search Interface
    │   ├── Nearby Facilities
    │   └── Facility Details
    ├── Digital Health Passport
    │   ├── Health Records
    │   ├── Export QR Code
    │   └── Manage Sharing
    ├── Profile
    │   └── User Settings
    └── Quick Actions
        ├── Government Schemes
        ├── Budget Estimator
        └── Offline Mode
```

## 🔐 API Endpoints Summary

### Authentication (Public)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Health Guidance
- `POST /api/health/assess` - AI symptom assessment
- `GET /api/health/assessment/{id}` - Get assessment
- `GET /api/journey/{assessment_id}` - Healthcare journey

### Healthcare Facilities  
- `GET /api/facilities/nearby` - Find nearby facilities
- `GET /api/facilities/{id}` - Facility details
- `POST /api/facilities` - Add facility (admin)

### Referrals
- `POST /api/referral/create` - Create referral
- `GET /api/referral/{id}` - Get referral
- `PUT /api/referral/{id}` - Update referral status

### Digital Health Passport
- `GET /api/health-passport` - Get patient passport
- `POST /api/health-passport/record` - Add health record
- `GET /api/health-passport/export-qr` - Export QR

### Government Schemes
- `POST /api/schemes/match` - Match schemes
- `GET /api/schemes/{id}` - Scheme details

### Budget
- `POST /api/budget/estimate` - Estimate costs

### Offline Sync
- `POST /api/sync/pending` - Sync offline data

## 🔑 Default Test Credentials

```
Email: user@example.com
Password: password123
```

Use these to test the app immediately after setup.

## 💾 Database Setup

### Option 1: Using SQLite (Quick Development)
```python
# In backend/.env
DATABASE_URL=sqlite:///./healthsphere.db
# Tables auto-create on first run
```

### Option 2: Using PostgreSQL (Production)
```bash
# Create database
createdb healthsphere_db

# In backend/.env
DATABASE_URL=postgresql://username:password@localhost:5432/healthsphere_db
```

## 🎯 MVP Feature Checklist

### Must Work (Phase 1)
- [x] User authentication (Login/Register)
- [x] Patient profile management
- [x] AI symptom assessment
- [x] Facility recommendation and search
- [x] Smart referral creation
- [x] Digital health passport
- [x] Government schemes matching
- [x] Offline mode infrastructure
- [x] Healthcare journey visualization
- [x] Budget estimation

### Secondary Features (Phase 2)
- [ ] Voice input for symptoms
- [ ] Multi-language support
- [ ] Medicine information database
- [ ] Mood-based UI themes
- [ ] Health gamification

### Demo Features (Showcase)
- [ ] Real healthcare facility data integration
- [ ] Google Maps integration
- [ ] Advanced AI models
- [ ] Blockchain health records (future)

## 🚨 Important Notes

1. **Security**
   - Change SECRET_KEY before production
   - Use HTTPS in production
   - Store API keys securely
   - Never commit .env files

2. **Data Privacy**
   - All health data is sensitive
   - Implement proper access controls
   - Log all data access
   - Comply with HIPAA/GDPR

3. **Healthcare Compliance**
   - Not a diagnostic tool
   - Always recommend professional consultation
   - Include medical disclaimers
   - Maintain audit trails

4. **Performance**
   - Backend: Use caching for schemes/facilities
   - Frontend: Lazy load screens
   - Database: Index commonly searched columns
   - API: Implement rate limiting

5. **Scalability**
   - Add Redis for caching
   - Use Celery for background jobs
   - Implement pagination for large datasets
   - Add load balancing for multiple instances

## 📚 File Organization

### Key Backend Files
- `app/main.py` - Core API endpoints
- `app/models/__init__.py` - Database schemas
- `app/services/` - Business logic
- `app/schemas.py` - Request/response models
- `app/config.py` - Configuration

### Key Frontend Files
- `App.tsx` - Navigation and app setup
- `src/screens/` - UI screens
- `src/services/api.ts` - API client
- `src/stores/` - State management
- `src/utils/` - Helpers and theme

## 🆘 Troubleshooting

### Backend Won't Start
```bash
# Check if port 8000 is in use
lsof -i :8000
# Kill process if needed
kill -9 <PID>

# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +
```

### Frontend Build Errors
```bash
# Clear cache
npm cache clean --force
expo r -c

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error
```bash
# Test connection
python -c "from sqlalchemy import create_engine; engine = create_engine(DATABASE_URL); print('OK')"

# Check PostgreSQL running
pg_isready -h localhost
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build backend image
cd backend
docker build -t healthsphere-backend .
docker run -p 8000:8000 healthsphere-backend

# Build frontend with Expo
eas build --platform android
eas build --platform ios
```

### Cloud Deployment
- Backend: AWS EC2, Heroku, Railway
- Database: AWS RDS, Firebase
- Frontend: Expo, AWS S3, Firebase Hosting

## 📞 Support & Documentation

- **API Docs**: http://localhost:8000/docs (Swagger)
- **Backend README**: backend/README.md
- **Frontend README**: frontend/README.md
- **Database Schema**: See `app/models/__init__.py`

## 🎓 Learning Resources

1. **FastAPI**: https://fastapi.tiangolo.com/
2. **React Native**: https://reactnative.dev/
3. **Expo**: https://docs.expo.dev/
4. **SQLAlchemy**: https://docs.sqlalchemy.org/
5. **Zustand**: https://github.com/pmndrs/zustand

## 🏆 Success Metrics

After complete setup, you should be able to:

1. ✅ Register and login as patient
2. ✅ Enter symptoms and get AI assessment
3. ✅ View nearby healthcare facilities
4. ✅ Create and track referrals
5. ✅ View digital health passport
6. ✅ Find government schemes
7. ✅ Estimate healthcare costs
8. ✅ Sync data offline
9. ✅ View complete healthcare journey
10. ✅ Export health records as QR code

---

## 🎉 Hackathon Demo Scenario

**Time: 3 minutes, complete end-to-end workflow**

1. **Patient Registration** (15 sec)
   - User registers with email and phone

2. **Symptom Entry** (20 sec)
   - "I have fever, weakness, and difficulty breathing"
   - AI assessment shows urgency level

3. **Facility Search** (30 sec)
   - Shows nearest District Hospital (critical)
   - Shows alternative facilities at different levels

4. **Healthcare Journey** (30 sec)
   - Step 1: Visit Primary Health Centre for initial eval
   - Step 2: Get diagnostic tests
   - Step 3: Referral to specialist if needed
   - Shows estimated costs

5. **Create Referral** (20 sec)
   - Generate referral with QR code
   - Display unique referral ID

6. **Health Passport** (15 sec)
   - Show health records created
   - Export as QR code

7. **Government Schemes** (15 sec)
   - Show relevant schemes based on profile
   - Show eligibility and benefits

8. **Offline Sync Demo** (10 sec)
   - Toggle offline mode
   - Show all data still accessible
   - Turn online, show auto-sync

**Total: 3:15 minutes for complete end-to-end demonstration**

---

**Status**: ✅ Ready for Development
**Next Step**: Follow "Step 1-3" in Quick Start Guide above
**Estimated Setup Time**: 30-45 minutes
**Estimated First Run**: 2 hours complete workflow

Good luck! 🚀
