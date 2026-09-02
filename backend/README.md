# HealthSphere AI Backend

FastHub Repository: https://github.com/amanansari202020-ai/Anamaya-AI

FastAPI-based backend for HealthSphere AI - an AI-powered rural healthcare navigation platform.

## 🚀 Features

- **AI Health Guidance**: Symptom assessment and healthcare recommendations
- **Healthcare Facility Discovery**: Find nearby facilities with distance calculation
- **Smart Referral System**: Intelligent patient referral management with QR codes
- **Digital Health Passport**: Comprehensive health record management
- **Offline Support**: Data sync and offline capability tracking
- **Government Scheme Matcher**: Find relevant healthcare support schemes
- **Budget Estimation**: Healthcare cost estimation and affordability analysis
- **Authentication**: JWT-based secure authentication
- **Role-Based Access**: Patient and Healthcare Worker roles

## 📋 Prerequisites

- Python 3.9+
- PostgreSQL (or SQLite for development)
- Redis (optional, for caching)
- Git

## 🔧 Installation & Setup

### 1. Clone and Setup Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# Update DATABASE_URL, SECRET_KEY, API keys, etc.
```

### 4. Setup Database

```bash
# Create database (PostgreSQL)
createdb healthsphere_db

# Run migrations (if using Alembic)
alembic upgrade head

# Or tables will be created automatically on first run
```

### 5. Run Development Server

```bash
# Using Python directly
python app/main.py

# Or using Uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will be available at: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs` (Swagger UI)

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Main FastAPI app
│   ├── config.py            # Configuration settings
│   ├── schemas.py           # Pydantic schemas
│   ├── models/
│   │   └── __init__.py      # SQLAlchemy models
│   ├── database/
│   │   └── __init__.py      # Database connection
│   └── services/            # Business logic services
│       ├── auth.py
│       ├── ai_guidance.py
│       ├── facility_finder.py
│       ├── referral.py
│       ├── health_record.py
│       └── government_scheme.py
├── tests/                   # Unit tests
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🔐 Authentication

### Register User

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "User Name",
  "phone": "9876543210",
  "role": "patient"
}
```

### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

# Returns:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

Use the token in Authorization header:
```
Authorization: Bearer <access_token>
```

## 🏥 Main API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile

### AI Health Guidance
- `POST /api/health/assess` - Assess symptoms
- `GET /api/health/assessment/{id}` - Get assessment details

### Healthcare Facilities
- `GET /api/facilities/nearby` - Find nearby facilities
- `GET /api/facilities/{id}` - Get facility details
- `POST /api/facilities` - Create facility (admin)

### Healthcare Journey
- `GET /api/journey/{assessment_id}` - Get recommended journey path

### Smart Referral
- `POST /api/referral/create` - Create referral
- `GET /api/referral/{referral_id}` - Get referral details
- `PUT /api/referral/{referral_id}` - Update referral status

### Digital Health Passport
- `GET /api/health-passport` - Get patient's health passport
- `POST /api/health-passport/record` - Add health record
- `GET /api/health-passport/export-qr` - Export as QR code

### Government Schemes
- `POST /api/schemes/match` - Match eligible schemes
- `GET /api/schemes/{id}` - Get scheme details

### Budget Estimation
- `POST /api/budget/estimate` - Estimate healthcare costs

### Offline Sync
- `POST /api/sync/pending` - Sync pending offline data

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

## 📊 Database Schema

### Core Tables
- **users** - User accounts (patients, healthcare workers, admins)
- **patient_profiles** - Detailed patient information
- **health_records** - Digital health passport entries
- **symptom_assessments** - AI assessment results
- **healthcare_facilities** - Healthcare facility information
- **referrals** - Referral management
- **consultations** - Consultation records
- **government_schemes** - Healthcare schemes database
- **medicines** - Medicine information database
- **data_sync** - Offline sync tracking

## 🚨 Important Notes

1. **Demo Data**: Uses mock data for facilities and schemes. Integrate real data sources in production.
2. **Security**: Always use HTTPS in production. Update SECRET_KEY before deployment.
3. **Database**: For production, use PostgreSQL instead of SQLite.
4. **Scaling**: Consider adding Redis caching for better performance.
5. **Rate Limiting**: Implement rate limiting for production APIs.

## 📝 API Documentation

Comprehensive Swagger UI documentation available at:
```
http://localhost:8000/docs
```

ReDoc documentation available at:
```
http://localhost:8000/redoc
```

## 🔄 Integration with Frontend

The React Native frontend communicates with these base URLs:
- Development: `http://localhost:8000/api`
- Production: Configure in frontend `.env` file

## 🛠 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Import Errors
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt --force-reinstall`

### Port Already in Use
```bash
# Use different port
uvicorn app.main:app --port 8001
```

## 📦 Dependencies

Key packages:
- **fastapi** - Modern web framework
- **sqlalchemy** - ORM for database
- **pydantic** - Data validation
- **python-jose** - JWT tokens
- **passlib** - Password hashing
- **psycopg2** - PostgreSQL adapter
- **qrcode** - QR code generation
- **geopy** - Geocoding and distance

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Submit pull request

## 📄 License

This project is part of the HealthSphere AI hackathon initiative.

## 🎯 Next Steps

1. Set up database
2. Configure environment variables
3. Run development server
4. Test API endpoints using Swagger UI
5. Connect with React Native frontend
6. Deploy to production environment

---

For more information, visit: [HealthSphere AI Documentation]
