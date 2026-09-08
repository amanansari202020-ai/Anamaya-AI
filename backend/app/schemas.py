# Pydantic Schemas for Request/Response Validation

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserRegister(UserBase):
    password: str = Field(min_length=8)
    phone: Optional[str] = None
    role: str = "patient"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Patient Profile Schemas
class PatientProfileBase(BaseModel):
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    age_group: Optional[str] = None  # child, adult, elderly
    blood_group: Optional[str] = None
    allergies: Optional[str] = None
    has_allergies: bool = False
    allergy_details: Optional[str] = None
    chronic_conditions: Optional[str] = None
    existing_conditions: Optional[List[str]] = None  # diabetes, heart_bp, asthma, pregnancy, injury, none
    preferred_language: str = "en"
    location_latitude: Optional[float] = None
    location_longitude: Optional[float] = None
    insurance_provider: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relation: Optional[str] = None


class PatientProfileCreate(PatientProfileBase):
    pass


class PatientProfileResponse(PatientProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Symptom Assessment Schemas
class SymptomInput(BaseModel):
    symptoms: List[str]
    duration: Optional[str] = None
    severity: Optional[str] = None  # mild, moderate, severe
    associated_symptoms: Optional[List[str]] = None
    relevant_medical_history: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    profile_context: Optional[Dict[str, Any]] = None


class SymptomAssessmentResponse(BaseModel):
    id: int
    symptoms: List[str]
    ai_assessment: Dict[str, Any]
    recommended_facility_level: str
    recommended_specialists: List[str]
    urgency_level: str
    is_emergency: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Healthcare Facility Schemas
class HealthcareFacilityBase(BaseModel):
    name: str
    facility_level: str
    latitude: float
    longitude: float
    address: str
    phone: Optional[str] = None
    contact_phone: Optional[str] = None
    email: Optional[str] = None
    opening_hours: Optional[str] = None
    is_government: bool = True
    ownership_type: str = "government"
    available_services: List[str] = []
    available_specialists: List[str] = []
    emergency_available: bool = False
    emergency_services: bool = False
    is_24x7: bool = False
    beds_available: Optional[int] = None
    accepted_schemes: List[str] = []


class HealthcareFacilityCreate(HealthcareFacilityBase):
    pass


class HealthcareFacilityResponse(HealthcareFacilityBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Doctor Schemas
class DoctorBase(BaseModel):
    name: str
    degree: str
    specialization: str
    years_experience: int = 5
    available_days: List[str] = []
    available_hours: str


class DoctorResponse(DoctorBase):
    id: int
    facility_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class HealthcareFacilityWithDoctorsResponse(HealthcareFacilityResponse):
    doctors: List[DoctorResponse] = []
    distance_km: Optional[float] = None


class NearbyFacilitiesWithDoctorsGroupedResponse(BaseModel):
    success: bool = True
    government: List[Dict[str, Any]] = []
    private: List[Dict[str, Any]] = []
    total_count: int = 0


# Appointment Schemas
class AppointmentRequestCreate(BaseModel):
    doctor_id: int
    facility_id: int
    patient_id: Optional[int] = None
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None
    requested_date: str
    requested_time_slot: str


class AppointmentRequestResponse(BaseModel):
    id: int
    patient_id: Optional[int] = None
    doctor_id: int
    facility_id: int
    doctor_name: Optional[str] = None
    facility_name: Optional[str] = None
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None
    requested_date: str
    requested_time_slot: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Emergency SOS Schemas
class EmergencyFacilityResponse(BaseModel):
    id: int
    name: str
    facility_level: str
    latitude: float
    longitude: float
    address: str
    phone: Optional[str] = None
    contact_phone: Optional[str] = None
    distance_km: float
    emergency_services: bool = True
    is_24x7: bool = True
    available_services: List[str] = []


class EmergencyNotifyRequest(BaseModel):
    patient_id: Optional[int] = None
    latitude: float
    longitude: float
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None


class EmergencyNotifyResponse(BaseModel):
    status: str
    contact_name: str
    contact_phone: str
    channels: List[str]
    sent_at: str


# Referral Schemas
class ReferralBase(BaseModel):
    referral_reason: str
    symptoms: List[str]
    to_facility_id: int
    from_facility_id: Optional[int] = None


class ReferralCreate(ReferralBase):
    pass


class ReferralResponse(ReferralBase):
    id: int
    referral_id: str
    patient_id: int
    status: str
    ai_assessment: Optional[Dict[str, Any]] = None
    qr_code: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReferralUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


# Government Scheme Schemas
class GovernmentSchemeResponse(BaseModel):
    id: int
    name: str
    description: str
    eligibility_criteria: Dict[str, Any]
    benefits: List[str]
    required_documents: List[str]
    application_process: str
    official_website: Optional[str] = None
    state: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SchemeMatcher(BaseModel):
    age_group: Optional[str] = None
    state: str
    income_category: Optional[str] = None
    employment_category: Optional[str] = None
    is_student: bool = False
    is_senior_citizen: bool = False


# Medicine Schemas
class MedicineResponse(BaseModel):
    id: int
    name: str
    generic_name: Optional[str] = None
    uses: str
    side_effects: List[str]
    warnings: List[str]
    is_prescription_required: bool
    dosage_info: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class MedicineSearch(BaseModel):
    name: Optional[str] = None
    generic_name: Optional[str] = None


# Health Record Schemas
class HealthRecordBase(BaseModel):
    record_type: str  # consultation, diagnostic, prescription
    title: str
    content: str
    attachments: Optional[List[str]] = None


class HealthRecordCreate(HealthRecordBase):
    pass


class HealthRecordResponse(HealthRecordBase):
    id: int
    patient_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Authentication Response
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


# Healthcare Journey Schema
class HealthcareJourneyStep(BaseModel):
    step_number: int
    title: str
    description: str
    action: str
    facility_level: Optional[str] = None
    distance: Optional[float] = None
    estimated_cost: Optional[float] = None


class HealthcareJourney(BaseModel):
    assessment_id: int
    steps: List[HealthcareJourneyStep]
    estimated_total_cost: float
    recommended_path_description: str


# Budget Estimation Schema
class BudgetEstimate(BaseModel):
    consultation_cost: Dict[str, float]  # min, max
    diagnostic_cost: Dict[str, float]
    travel_cost: Optional[Dict[str, float]] = None
    medicine_cost: Dict[str, float]
    treatment_cost: Dict[str, float]
    total_estimated: Dict[str, float]
    government_options: List[str]


class ImageAnalysisRequest(BaseModel):
    image: str
    description: Optional[str] = ""


# Patient Satisfaction & Feedback Schemas
class AppointmentFeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    tags: List[str] = []
    comment: Optional[str] = None
    patient_id: Optional[int] = None


class AppointmentFeedbackResponse(BaseModel):
    id: int
    appointment_id: int
    patient_id: Optional[int] = None
    rating: int
    tags: List[str] = []
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class DoctorRatingSummary(BaseModel):
    doctor_id: int
    doctor_name: Optional[str] = None
    average_rating: Optional[float] = None
    total_reviews: int = 0
    most_common_tags: List[str] = []


class ReferralOutcomeCreate(BaseModel):
    outcome: str = Field(..., description="resolved | partially_resolved | not_resolved | no_response")
    comment: Optional[str] = None
    patient_id: Optional[int] = None


class ReferralOutcomeResponse(BaseModel):
    id: int
    referral_id: int
    patient_id: Optional[int] = None
    outcome: str
    comment: Optional[str] = None
    asked_at: datetime
    responded_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FacilityRatingSummary(BaseModel):
    facility_id: int
    facility_name: str
    average_rating: float
    feedback_count: int


class ReferralOutcomeBreakdown(BaseModel):
    resolved_count: int = 0
    resolved_percentage: float = 0.0
    partially_resolved_count: int = 0
    partially_resolved_percentage: float = 0.0
    not_resolved_count: int = 0
    not_resolved_percentage: float = 0.0
    no_response_count: int = 0
    no_response_percentage: float = 0.0


class SatisfactionOverviewResponse(BaseModel):
    overall_average_rating: float
    total_feedback_count: int
    facility_ratings: List[FacilityRatingSummary] = []
    referral_outcomes: ReferralOutcomeBreakdown


