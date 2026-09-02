# Automatic database migration script for new fields and tables

import logging
from sqlalchemy import inspect, text
from app.database import engine, Base
from app.models import (
    User, PatientProfile, HealthRecord, SymptomAssessment,
    HealthcareFacility, Referral, EmergencyNotification
)

logger = logging.getLogger(__name__)


def run_migrations():
    """Safely apply database schema updates for emergency & health profile features."""
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()

        # Create any missing tables (e.g. emergency_notifications)
        Base.metadata.create_all(bind=engine)

        with engine.begin() as conn:
            # 1. Update patient_profiles table columns
            if "patient_profiles" in tables:
                columns = [c["name"] for c in inspector.get_columns("patient_profiles")]
                
                profile_cols_to_add = [
                    ("age_group", "VARCHAR(20)"),
                    ("has_allergies", "BOOLEAN DEFAULT 0"),
                    ("allergy_details", "TEXT"),
                    ("existing_conditions", "TEXT"),  # Stored as JSON string or text in SQLite
                    ("emergency_contact_name", "VARCHAR(255)"),
                    ("emergency_contact_phone", "VARCHAR(50)"),
                    ("emergency_contact_relation", "VARCHAR(100)"),
                ]
                
                for col_name, col_type in profile_cols_to_add:
                    if col_name not in columns:
                        logger.info(f"Adding missing column '{col_name}' to 'patient_profiles'")
                        conn.execute(text(f"ALTER TABLE patient_profiles ADD COLUMN {col_name} {col_type}"))

            # 2. Update healthcare_facilities table columns
            if "healthcare_facilities" in tables:
                fac_columns = [c["name"] for c in inspector.get_columns("healthcare_facilities")]
                
                fac_cols_to_add = [
                    ("emergency_services", "BOOLEAN DEFAULT 0"),
                    ("is_24x7", "BOOLEAN DEFAULT 0"),
                    ("contact_phone", "VARCHAR(50)"),
                ]
                
                for col_name, col_type in fac_cols_to_add:
                    if col_name not in fac_columns:
                        logger.info(f"Adding missing column '{col_name}' to 'healthcare_facilities'")
                        conn.execute(text(f"ALTER TABLE healthcare_facilities ADD COLUMN {col_name} {col_type}"))

        # Seed real healthcare facilities if table is empty or sparse
        from app.database import SessionLocal
        db = SessionLocal()
        try:
            count = db.query(HealthcareFacility).count()
            if count < 5:
                logger.info("Seeding real regional healthcare facilities into database...")
                from app.models import HealthcareLevelEnum

                real_facilities = [
                    HealthcareFacility(
                        name="Navi Mumbai Municipal General Hospital Vashi",
                        facility_level=HealthcareLevelEnum.DISTRICT_HOSPITAL,
                        latitude=19.0330,
                        longitude=73.0297,
                        address="Sector 10, Vashi, Navi Mumbai, Maharashtra 400703",
                        phone="022-27899999",
                        contact_phone="022-27899999",
                        opening_hours="24 Hours",
                        is_government=True,
                        emergency_available=True,
                        emergency_services=True,
                        is_24x7=True,
                        beds_available=320,
                        available_services=["Emergency Trauma", "ICU", "Pediatrics", "Cardiology", "Maternity"],
                        available_specialists=["Trauma Surgeon", "Cardiologist", "Pediatrician", "Gynecologist"]
                    ),
                    HealthcareFacility(
                        name="Panvel Sub-District Hospital & Trauma Care",
                        facility_level=HealthcareLevelEnum.RURAL_HOSPITAL,
                        latitude=18.9894,
                        longitude=73.1175,
                        address="Old Panvel, Near ST Stand, Panvel, Raigad 410206",
                        phone="022-27452333",
                        contact_phone="022-27452333",
                        opening_hours="24 Hours",
                        is_government=True,
                        emergency_available=True,
                        emergency_services=True,
                        is_24x7=True,
                        beds_available=150,
                        available_services=["Emergency Ward", "Maternity", "Ambulance", "General Medicine"],
                        available_specialists=["General Surgeon", "Gynecologist", "Anesthetist"]
                    ),
                    HealthcareFacility(
                        name="Raigad District Civil Hospital Alibag",
                        facility_level=HealthcareLevelEnum.DISTRICT_HOSPITAL,
                        latitude=18.6604,
                        longitude=72.8752,
                        address="District Hospital Road, Alibag, Raigad, Maharashtra 402201",
                        phone="02141-222045",
                        contact_phone="108",
                        opening_hours="24 Hours",
                        is_government=True,
                        emergency_available=True,
                        emergency_services=True,
                        is_24x7=True,
                        beds_available=250,
                        available_services=["Trauma ICU", "Blood Bank", "Orthopedics", "TB Care"],
                        available_specialists=["Orthopedic Surgeon", "Pathologist", "Radiologist"]
                    ),
                    HealthcareFacility(
                        name="Community Health Centre (CHC) Karjat",
                        facility_level=HealthcareLevelEnum.RURAL_HOSPITAL,
                        latitude=18.9102,
                        longitude=73.3283,
                        address="Station Road, Karjat, Raigad, Maharashtra 410201",
                        phone="02148-222120",
                        contact_phone="02148-222120",
                        opening_hours="24 Hours",
                        is_government=True,
                        emergency_available=True,
                        emergency_services=True,
                        is_24x7=True,
                        beds_available=60,
                        available_services=["Emergency Stabilization", "Maternity Care", "Pharmacy"],
                        available_specialists=["Medical Officer", "Gynecologist"]
                    ),
                    HealthcareFacility(
                        name="Primary Health Centre (PHC) Uran",
                        facility_level=HealthcareLevelEnum.PHC,
                        latitude=18.8789,
                        longitude=72.9412,
                        address="Mora Road, Uran, Navi Mumbai, Maharashtra 400702",
                        phone="022-27222340",
                        contact_phone="022-27222340",
                        opening_hours="8:00 AM - 8:00 PM",
                        is_government=True,
                        emergency_available=False,
                        emergency_services=False,
                        is_24x7=False,
                        beds_available=12,
                        available_services=["Fever Screening", "Immunization", "Maternal Care", "Outpatient"],
                        available_specialists=["Primary Care Doctor", "Nurse Practitioner"]
                    ),
                    HealthcareFacility(
                        name="MGM Hospital & Medical College Kamothe",
                        facility_level=HealthcareLevelEnum.DISTRICT_HOSPITAL,
                        latitude=19.0194,
                        longitude=73.0975,
                        address="Sector 1, Kamothe, Navi Mumbai, Maharashtra 410209",
                        phone="022-27437900",
                        contact_phone="022-27437900",
                        opening_hours="24 Hours",
                        is_government=False,
                        emergency_available=True,
                        emergency_services=True,
                        is_24x7=True,
                        beds_available=850,
                        available_services=["Super Specialty ICU", "Trauma", "Cardiology", "Neurology", "Oncology"],
                        available_specialists=["Neurosurgeon", "Cardiologist", "Oncologist", "Trauma Specialist"]
                    ),
                    HealthcareFacility(
                        name="Primary Health Centre (PHC) Khopoli",
                        facility_level=HealthcareLevelEnum.PHC,
                        latitude=18.7885,
                        longitude=73.3448,
                        address="Lonavala Highway, Khopoli, Raigad, Maharashtra 410203",
                        phone="02192-263050",
                        contact_phone="02192-263050",
                        opening_hours="24 Hours",
                        is_government=True,
                        emergency_available=True,
                        emergency_services=True,
                        is_24x7=True,
                        beds_available=30,
                        available_services=["Emergency Triage", "First Aid", "General OPD"],
                        available_specialists=["Medical Officer", "General Physician"]
                    ),
                    HealthcareFacility(
                        name="King Edward Memorial (KEM) Hospital Mumbai",
                        facility_level=HealthcareLevelEnum.DISTRICT_HOSPITAL,
                        latitude=19.0022,
                        longitude=72.8427,
                        address="Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012",
                        phone="022-24107000",
                        contact_phone="108",
                        opening_hours="24 Hours",
                        is_government=True,
                        emergency_available=True,
                        emergency_services=True,
                        is_24x7=True,
                        beds_available=1800,
                        available_services=["Tertiary Trauma Center", "Organ Transplant", "Pediatrics", "Cardiology"],
                        available_specialists=["Cardiothoracic Surgeon", "Pediatric Surgeon", "Neurologist"]
                    ),
                    HealthcareFacility(
                        name="District Government Hospital Nagpur",
                        facility_level=HealthcareLevelEnum.DISTRICT_HOSPITAL,
                        latitude=21.1458,
                        longitude=79.0882,
                        address="Sitabuldi, Nagpur, Maharashtra 440001",
                        phone="0712-2560011",
                        contact_phone="108",
                        opening_hours="24 Hours",
                        is_government=True,
                        emergency_available=True,
                        emergency_services=True,
                        is_24x7=True,
                        beds_available=500,
                        available_services=["Emergency ICU", "Trauma Unit", "Burn Ward", "Dialysis"],
                        available_specialists=["Trauma Specialist", "Nephrologist", "Pulmonologist"]
                    ),
                    HealthcareFacility(
                        name="Sub-District Hospital Talegaon Dabhade",
                        facility_level=HealthcareLevelEnum.RURAL_HOSPITAL,
                        latitude=18.7308,
                        longitude=73.6775,
                        address="Station Road, Talegaon, Pune, Maharashtra 410507",
                        phone="02114-222300",
                        contact_phone="02114-222300",
                        opening_hours="24 Hours",
                        is_government=True,
                        emergency_available=True,
                        emergency_services=True,
                        is_24x7=True,
                        beds_available=100,
                        available_services=["Emergency Ward", "Maternity", "General Surgery"],
                        available_specialists=["General Physician", "Surgeon"]
                    )
                ]

                db.add_all(real_facilities)
                db.commit()
                logger.info("Successfully seeded 10 real healthcare facilities into database.")
        except Exception as se:
            logger.error(f"Error seeding facilities: {se}")
            db.rollback()
        finally:
            db.close()

        logger.info("Database migrations completed successfully.")
    except Exception as e:
        logger.error(f"Error during schema migration: {e}")
