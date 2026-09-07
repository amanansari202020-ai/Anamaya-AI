# Database Models for HealthSphere AI

from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    PATIENT = "patient"
    HEALTHCARE_WORKER = "healthcare_worker"
    ADMIN = "admin"


class HealthcareLevelEnum(str, enum.Enum):
    HOME_GUIDANCE = "home_guidance"
    SUB_CENTRE = "sub_centre"
    PHC = "phc"
    RURAL_HOSPITAL = "rural_hospital"
    DISTRICT_HOSPITAL = "district_hospital"


class ReferralStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# Users
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255))
    full_name = Column(String(255))
    role = Column(SQLEnum(UserRole), default=UserRole.PATIENT)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)
    health_records = relationship("HealthRecord", back_populates="patient")
    referrals = relationship("Referral", foreign_keys="Referral.patient_id", back_populates="patient")
    consultations = relationship("Consultation", foreign_keys="Consultation.patient_id", back_populates="patient")


# Patient Profile
class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    date_of_birth = Column(DateTime, nullable=True)
    gender = Column(String(20), nullable=True)
    age_group = Column(String(20), nullable=True)  # child, adult, elderly
    blood_group = Column(String(10), nullable=True)
    allergies = Column(Text, nullable=True)
    has_allergies = Column(Boolean, default=False)
    allergy_details = Column(Text, nullable=True)
    chronic_conditions = Column(Text, nullable=True)
    existing_conditions = Column(JSON, nullable=True)  # diabetes, heart_bp, asthma, pregnancy, injury, none
    preferred_language = Column(String(20), default="en")
    location_latitude = Column(Float, nullable=True)
    location_longitude = Column(Float, nullable=True)
    insurance_provider = Column(String(255), nullable=True)
    emergency_contact_name = Column(String(255), nullable=True)
    emergency_contact_phone = Column(String(50), nullable=True)
    emergency_contact_relation = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="patient_profile")


# Health Records
class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    record_type = Column(String(50))  # consultation, diagnostic, prescription, etc.
    title = Column(String(255))
    content = Column(Text)
    attachments = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    patient = relationship("User", back_populates="health_records")


# Symptom Assessment
class SymptomAssessment(Base):
    __tablename__ = "symptom_assessments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    symptoms = Column(JSON)  # List of symptoms
    ai_assessment = Column(JSON)  # AI guidance and recommendations
    recommended_facility_level = Column(SQLEnum(HealthcareLevelEnum))
    recommended_specialists = Column(JSON)  # List of recommended specialists
    urgency_level = Column(String(50))  # low, medium, high, critical
    is_emergency = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Healthcare Facilities
class HealthcareFacility(Base):
    __tablename__ = "healthcare_facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    facility_level = Column(SQLEnum(HealthcareLevelEnum))
    latitude = Column(Float)
    longitude = Column(Float)
    address = Column(Text)
    phone = Column(String(20), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    opening_hours = Column(String(255), nullable=True)
    is_government = Column(Boolean, default=True)
    available_services = Column(JSON)  # List of available services
    available_specialists = Column(JSON)  # List of available specialists
    emergency_available = Column(Boolean, default=False)
    emergency_services = Column(Boolean, default=False)
    is_24x7 = Column(Boolean, default=False)
    beds_available = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    referrals = relationship("Referral", foreign_keys="Referral.to_facility_id", back_populates="facility")


# Emergency Notifications
class EmergencyNotification(Base):
    __tablename__ = "emergency_notifications"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    contact_name = Column(String(255), nullable=True)
    contact_phone = Column(String(50))
    channel = Column(String(50))  # sms, whatsapp
    status = Column(String(50))  # sent, failed
    message_body = Column(Text)
    sent_at = Column(DateTime, default=datetime.utcnow)


# Referrals
class Referral(Base):
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True)
    referral_id = Column(String(50), unique=True, index=True)  # Unique referral code
    patient_id = Column(Integer, ForeignKey("users.id"))
    from_facility_id = Column(Integer, ForeignKey("healthcare_facilities.id"), nullable=True)
    to_facility_id = Column(Integer, ForeignKey("healthcare_facilities.id"))
    referral_reason = Column(Text)
    symptoms = Column(JSON)
    ai_assessment = Column(JSON, nullable=True)
    status = Column(SQLEnum(ReferralStatus), default=ReferralStatus.PENDING)
    qr_code = Column(String(500), nullable=True)  # QR code URL
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    patient = relationship("User", foreign_keys=[patient_id], back_populates="referrals")
    facility = relationship("HealthcareFacility", foreign_keys=[to_facility_id], back_populates="referrals")


# Consultations
class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    facility_id = Column(Integer, ForeignKey("healthcare_facilities.id"), nullable=True)
    healthcare_worker_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    diagnosis = Column(Text, nullable=True)
    prescription = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)
    follow_up_required = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    patient = relationship("User", foreign_keys=[patient_id], back_populates="consultations")


# Government Schemes
class GovernmentScheme(Base):
    __tablename__ = "government_schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    description = Column(Text)
    eligibility_criteria = Column(JSON)
    benefits = Column(JSON)
    required_documents = Column(JSON)
    application_process = Column(Text)
    official_website = Column(String(500), nullable=True)
    state = Column(String(100), nullable=True)  # State-specific scheme
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Medicine Information
class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    generic_name = Column(String(255), nullable=True)
    uses = Column(Text)
    side_effects = Column(JSON)
    warnings = Column(JSON)
    is_prescription_required = Column(Boolean, default=False)
    dosage_info = Column(Text, nullable=True)
    interactions = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Data Sync (for offline support)
class DataSync(Base):
    __tablename__ = "data_sync"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    entity_type = Column(String(50))  # health_record, referral, etc.
    entity_id = Column(Integer)
    action = Column(String(20))  # create, update, delete
    synced_at = Column(DateTime, default=datetime.utcnow)
    last_synced_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# Symptom Disease Reference (Unified dataset grounding Kaggle & DDXPlus)
class SymptomDiseaseReference(Base):
    __tablename__ = "symptom_disease_reference"

    id = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String(255), index=True)
    symptoms = Column(JSON)  # JSON array of normalized lowercase symptom strings
    source = Column(String(50), default="kaggle")  # "kaggle" | "ddxplus"
    weight = Column(Float, default=1.0)
    common_in_rural_india = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# MedlinePlus Cache (NIH plain language disease summary cache)
class MedlinePlusCache(Base):
    __tablename__ = "medlineplus_cache"

    id = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String(255), unique=True, index=True)
    summary_text = Column(Text)
    fetched_at = Column(DateTime, default=datetime.utcnow)

