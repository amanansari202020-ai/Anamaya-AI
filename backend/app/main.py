# Main FastAPI Application

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import logging
from app.config import settings
from app.database import engine, get_db, Base
from app.models import User, UserRole
from app.schemas import UserRegister, UserLogin, TokenResponse
from app.services.auth import AuthService
from app.services.ai_guidance import AIGuidanceService
from app.services.facility_finder import FacilityFinderService
from app.services.referral import ReferralService
from app.services.health_record import HealthRecordService
from app.services.government_scheme import GovernmentSchemeService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description="AI-powered rural healthcare navigation platform",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
auth_service = AuthService()
ai_service = AIGuidanceService()
facility_service = FacilityFinderService()
referral_service = ReferralService()
health_record_service = HealthRecordService()
scheme_service = GovernmentSchemeService()


# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.API_VERSION,
        "service": "HealthSphere AI Backend"
    }


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.post("/auth/register", response_model=dict, tags=["Authentication"])
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        user = await auth_service.register_user(db, user_data)
        return {
            "success": True,
            "message": "Registration successful",
            "user_id": user.id,
            "email": user.email
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/auth/login", response_model=TokenResponse, tags=["Authentication"])
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    try:
        token_data = await auth_service.authenticate_user(db, credentials)
        return token_data
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


# ============================================================================
# PATIENT PROFILE ENDPOINTS
# ============================================================================

@app.get("/api/patient/profile", tags=["Patient Profile"])
async def get_patient_profile(
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Get current patient's profile"""
    profile = await auth_service.get_patient_profile(db, current_user.id)
    return profile


@app.put("/api/patient/profile", tags=["Patient Profile"])
async def update_patient_profile(
    profile_data: dict,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Update patient profile"""
    updated_profile = await auth_service.update_patient_profile(
        db, current_user.id, profile_data
    )
    return {"success": True, "profile": updated_profile}


# ============================================================================
# AI HEALTH GUIDANCE ENDPOINTS
# ============================================================================

@app.post("/api/health/assess", response_model=dict, tags=["AI Health Guidance"])
async def assess_symptoms(
    symptom_input: dict,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """AI-powered symptom assessment"""
    try:
        assessment = await ai_service.assess_symptoms(
            db, current_user.id, symptom_input
        )
        return {
            "success": True,
            "assessment": assessment
        }
    except Exception as e:
        logger.error(f"Assessment error: {str(e)}")
        raise HTTPException(status_code=500, detail="Assessment failed")


@app.get("/api/health/assessment/{assessment_id}", tags=["AI Health Guidance"])
async def get_assessment(
    assessment_id: int,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific assessment"""
    assessment = await ai_service.get_assessment(db, assessment_id, current_user.id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment


# ============================================================================
# HEALTHCARE FACILITY ENDPOINTS
# ============================================================================

@app.get("/api/facilities/nearby", tags=["Healthcare Facilities"])
async def find_nearby_facilities(
    latitude: float,
    longitude: float,
    facility_level: str = None,
    radius_km: float = 50,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Find nearby healthcare facilities"""
    facilities = await facility_service.find_nearby_facilities(
        db, latitude, longitude, facility_level, radius_km
    )
    return {
        "success": True,
        "count": len(facilities),
        "facilities": facilities
    }


@app.get("/api/facilities/{facility_id}", tags=["Healthcare Facilities"])
async def get_facility_details(
    facility_id: int,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Get facility details"""
    facility = await facility_service.get_facility(db, facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility


@app.post("/api/facilities", tags=["Healthcare Facilities"])
async def create_facility(
    facility_data: dict,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new healthcare facility (admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    facility = await facility_service.create_facility(db, facility_data)
    return {"success": True, "facility": facility}


# ============================================================================
# HEALTHCARE JOURNEY ENDPOINTS
# ============================================================================

@app.get("/api/journey/{assessment_id}", tags=["Healthcare Journey"])
async def get_healthcare_journey(
    assessment_id: int,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Get recommended healthcare journey for an assessment"""
    journey = await ai_service.generate_healthcare_journey(
        db, assessment_id, current_user
    )
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")
    return journey


# ============================================================================
# REFERRAL ENDPOINTS
# ============================================================================

@app.post("/api/referral/create", tags=["Smart Referral"])
async def create_referral(
    referral_data: dict,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a smart referral"""
    try:
        referral = await referral_service.create_referral(
            db, current_user.id, referral_data
        )
        return {
            "success": True,
            "referral": referral,
            "referral_id": referral.referral_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/referral/{referral_id}", tags=["Smart Referral"])
async def get_referral(
    referral_id: str,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Get referral details"""
    referral = await referral_service.get_referral_by_id(db, referral_id)
    if not referral:
        raise HTTPException(status_code=404, detail="Referral not found")
    return referral


@app.put("/api/referral/{referral_id}", tags=["Smart Referral"])
async def update_referral(
    referral_id: str,
    referral_data: dict,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Update referral status (healthcare worker)"""
    if current_user.role != UserRole.HEALTHCARE_WORKER:
        raise HTTPException(status_code=403, detail="Healthcare worker access required")
    
    referral = await referral_service.update_referral(db, referral_id, referral_data)
    return {"success": True, "referral": referral}


# ============================================================================
# DIGITAL HEALTH PASSPORT ENDPOINTS
# ============================================================================

@app.get("/api/health-passport", tags=["Digital Health Passport"])
async def get_health_passport(
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Get patient's digital health passport"""
    passport = await health_record_service.get_health_passport(db, current_user.id)
    return passport


@app.post("/api/health-passport/record", tags=["Digital Health Passport"])
async def add_health_record(
    record_data: dict,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Add a health record to passport"""
    record = await health_record_service.add_health_record(
        db, current_user.id, record_data
    )
    return {"success": True, "record": record}


@app.get("/api/health-passport/export-qr", tags=["Digital Health Passport"])
async def export_health_passport_qr(
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Export health passport as QR code"""
    qr_code = await health_record_service.generate_health_passport_qr(
        db, current_user.id
    )
    return {"success": True, "qr_code_url": qr_code}


# ============================================================================
# GOVERNMENT SCHEME ENDPOINTS
# ============================================================================

@app.post("/api/schemes/match", tags=["Government Schemes"])
async def match_schemes(
    matcher_data: dict,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Find relevant government schemes"""
    schemes = await scheme_service.match_schemes(db, matcher_data)
    return {
        "success": True,
        "count": len(schemes),
        "schemes": schemes
    }


@app.get("/api/schemes/{scheme_id}", tags=["Government Schemes"])
async def get_scheme(
    scheme_id: int,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Get scheme details"""
    scheme = await scheme_service.get_scheme(db, scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


# ============================================================================
# BUDGET ESTIMATION ENDPOINTS
# ============================================================================

@app.post("/api/budget/estimate", tags=["Budget Estimation"])
async def estimate_budget(
    estimate_data: dict,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Estimate healthcare journey budget"""
    estimate = await ai_service.estimate_budget(db, estimate_data)
    return {
        "success": True,
        "estimate": estimate,
        "disclaimer": "These are estimated costs. Actual costs may vary."
    }


# ============================================================================
# OFFLINE SYNC ENDPOINTS
# ============================================================================

@app.post("/api/sync/pending", tags=["Offline Sync"])
async def sync_pending_data(
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Sync pending offline data"""
    synced_count = await health_record_service.sync_pending_data(db, current_user.id)
    return {
        "success": True,
        "synced_items": synced_count,
        "message": "Healthcare data synchronized successfully"
    }


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail
        }
    )


# ============================================================================
# STARTUP/SHUTDOWN EVENTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    logger.info("HealthSphere AI Backend Starting Up")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("HealthSphere AI Backend Shutting Down")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
