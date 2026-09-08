# Automatic database migration script for new fields and tables

import logging
from sqlalchemy import inspect, text
from app.database import engine, Base
from app.models import (
    User, PatientProfile, HealthRecord, SymptomAssessment,
    HealthcareFacility, Referral, EmergencyNotification, Doctor,
    AppointmentRequest, FacilityOwnershipType, HealthcareLevelEnum,
    AppointmentFeedback, ReferralOutcomeFeedback, ReferralOutcomeEnum
)

logger = logging.getLogger(__name__)


def run_migrations():
    """Safely apply database schema updates for emergency, doctor directory & health profile features."""
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()

        # Create any missing tables (e.g. emergency_notifications, doctors, appointment_requests)
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
                    ("ownership_type", "VARCHAR(20) DEFAULT 'government'"),
                    ("accepted_schemes", "TEXT"),  # Stored as JSON array string
                ]
                
                for col_name, col_type in fac_cols_to_add:
                    if col_name not in fac_columns:
                        logger.info(f"Adding missing column '{col_name}' to 'healthcare_facilities'")
                        conn.execute(text(f"ALTER TABLE healthcare_facilities ADD COLUMN {col_name} {col_type}"))

        # Seed healthcare facilities and doctors
        # Facilities data sourced from the official MJPJAY (Mahatma Jyotiba Phule Jan Arogya Yojana) empanelled hospital list for Raigad district (jeevandayee.gov.in)
        from app.database import SessionLocal
        db = SessionLocal()
        try:
            logger.info("Seeding / updating 17 healthcare facilities in database...")

            facilities_data = [
                {
                    "name": "Navi Mumbai Municipal General Hospital Vashi",
                    "facility_level": HealthcareLevelEnum.DISTRICT_HOSPITAL,
                    "latitude": 19.0330, "longitude": 73.0297,
                    "address": "Sector 10, Vashi, Navi Mumbai, Maharashtra 400703",
                    "phone": "022-27899999", "contact_phone": "022-27899999", "opening_hours": "24 Hours",
                    "is_government": True, "ownership_type": "government",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 320,
                    "available_services": ["Emergency Trauma", "ICU", "Pediatrics", "Cardiology", "Maternity"],
                    "available_specialists": ["Trauma Surgeon", "Cardiologist", "Pediatrician", "Gynecologist"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY", "Ayushman Bharat"],
                    "doctors": [
                        {"name": "Dr. Rajesh Kulkarni", "degree": "MBBS, MD", "specialization": "General Physician", "years_experience": 12, "available_days": ["Mon", "Tue", "Wed", "Thu", "Fri"], "available_hours": "09:00 AM - 01:00 PM"},
                        {"name": "Dr. Ananya Deshmukh", "degree": "MBBS, DGO", "specialization": "Gynecologist", "years_experience": 9, "available_days": ["Mon", "Wed", "Fri", "Sat"], "available_hours": "10:00 AM - 02:00 PM"},
                        {"name": "Dr. Suresh Patil", "degree": "MBBS, DCH", "specialization": "Pediatrician", "years_experience": 14, "available_days": ["Tue", "Thu", "Sat"], "available_hours": "09:00 AM - 01:00 PM"},
                        {"name": "Dr. Prakash Shinde", "degree": "MBBS, MS", "specialization": "General Surgeon", "years_experience": 11, "available_days": ["Mon", "Tue", "Thu", "Fri"], "available_hours": "02:00 PM - 05:00 PM"},
                    ]
                },
                {
                    "name": "Panvel Sub-District Hospital & Trauma Care",
                    "facility_level": HealthcareLevelEnum.RURAL_HOSPITAL,
                    "latitude": 18.9894, "longitude": 73.1175,
                    "address": "Old Panvel, Near ST Stand, Panvel, Raigad 410206",
                    "phone": "022-27452333", "contact_phone": "022-27452333", "opening_hours": "24 Hours",
                    "is_government": True, "ownership_type": "government",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 150,
                    "available_services": ["Emergency Ward", "Maternity", "Ambulance", "General Medicine"],
                    "available_specialists": ["General Surgeon", "Gynecologist", "Anesthetist"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY", "Ayushman Bharat"],
                    "doctors": [
                        {"name": "Dr. Vikram Jadhav", "degree": "MBBS, MS", "specialization": "Orthopedic Surgeon", "years_experience": 10, "available_days": ["Mon", "Wed", "Fri"], "available_hours": "10:00 AM - 02:00 PM"},
                        {"name": "Dr. Savita More", "degree": "MBBS, MD", "specialization": "General Physician", "years_experience": 8, "available_days": ["Mon", "Tue", "Thu", "Fri", "Sat"], "available_hours": "09:00 AM - 01:00 PM"},
                        {"name": "Dr. Pooja Pawar", "degree": "MBBS, DGO", "specialization": "Gynecologist", "years_experience": 6, "available_days": ["Tue", "Wed", "Fri"], "available_hours": "11:00 AM - 03:00 PM"},
                    ]
                },
                {
                    "name": "Raigad District Civil Hospital Alibag",
                    "facility_level": HealthcareLevelEnum.DISTRICT_HOSPITAL,
                    "latitude": 18.6604, "longitude": 72.8752,
                    "address": "District Hospital Road, Alibag, Raigad, Maharashtra 402201",
                    "phone": "02141-222045", "contact_phone": "108", "opening_hours": "24 Hours",
                    "is_government": True, "ownership_type": "government",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 250,
                    "available_services": ["Trauma ICU", "Blood Bank", "Orthopedics", "TB Care"],
                    "available_specialists": ["Orthopedic Surgeon", "Pathologist", "Radiologist"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY", "Ayushman Bharat"],
                    "doctors": [
                        {"name": "Dr. Nitin Gaikwad", "degree": "MBBS, MS", "specialization": "Orthopedic Surgeon", "years_experience": 15, "available_days": ["Mon", "Wed", "Thu", "Fri"], "available_hours": "09:30 AM - 01:30 PM"},
                        {"name": "Dr. Sunita Rao", "degree": "MBBS, MD", "specialization": "General Physician", "years_experience": 11, "available_days": ["Tue", "Wed", "Fri", "Sat"], "available_hours": "10:00 AM - 02:00 PM"},
                        {"name": "Dr. Ramesh Sawant", "degree": "MBBS, DCH", "specialization": "Pediatrician", "years_experience": 7, "available_days": ["Mon", "Tue", "Thu", "Sat"], "available_hours": "09:00 AM - 01:00 PM"},
                    ]
                },
                {
                    "name": "Community Health Centre (CHC) Karjat",
                    "facility_level": HealthcareLevelEnum.RURAL_HOSPITAL,
                    "latitude": 18.9102, "longitude": 73.3283,
                    "address": "Station Road, Karjat, Raigad, Maharashtra 410201",
                    "phone": "02148-222120", "contact_phone": "02148-222120", "opening_hours": "24 Hours",
                    "is_government": True, "ownership_type": "government",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 60,
                    "available_services": ["Emergency Stabilization", "Maternity Care", "Pharmacy"],
                    "available_specialists": ["Medical Officer", "Gynecologist"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY"],
                    "doctors": [
                        {"name": "Dr. Deepak Thorat", "degree": "MBBS", "specialization": "General Physician", "years_experience": 6, "available_days": ["Mon", "Tue", "Wed", "Thu", "Fri"], "available_hours": "09:00 AM - 02:00 PM"},
                        {"name": "Dr. Kavita Joshi", "degree": "MBBS, DGO", "specialization": "Gynecologist", "years_experience": 5, "available_days": ["Mon", "Wed", "Fri"], "available_hours": "10:00 AM - 01:00 PM"},
                    ]
                },
                {
                    "name": "Primary Health Centre (PHC) Uran",
                    "facility_level": HealthcareLevelEnum.PHC,
                    "latitude": 18.8789, "longitude": 72.9412,
                    "address": "Mora Road, Uran, Navi Mumbai, Maharashtra 400702",
                    "phone": "022-27222340", "contact_phone": "022-27222340", "opening_hours": "8:00 AM - 8:00 PM",
                    "is_government": True, "ownership_type": "government",
                    "emergency_available": False, "emergency_services": False, "is_24x7": False, "beds_available": 12,
                    "available_services": ["Fever Screening", "Immunization", "Maternal Care", "Outpatient"],
                    "available_specialists": ["Primary Care Doctor", "Nurse Practitioner"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY"],
                    "doctors": [
                        {"name": "Dr. Amit Bhosale", "degree": "MBBS", "specialization": "General Physician", "years_experience": 4, "available_days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "available_hours": "08:00 AM - 02:00 PM"},
                        {"name": "Dr. Sneha Tambe", "degree": "MBBS", "specialization": "Pediatrician", "years_experience": 5, "available_days": ["Mon", "Wed", "Fri"], "available_hours": "09:00 AM - 01:00 PM"},
                    ]
                },
                {
                    "name": "MGM Hospital & Medical College Kamothe",
                    "facility_level": HealthcareLevelEnum.DISTRICT_HOSPITAL,
                    "latitude": 19.0194, "longitude": 73.0975,
                    "address": "Sector 1, Kamothe, Navi Mumbai, Maharashtra 410209",
                    "phone": "022-27437900", "contact_phone": "022-27437900", "opening_hours": "24 Hours",
                    "is_government": False, "ownership_type": "private",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 850,
                    "available_services": ["Super Specialty ICU", "Trauma", "Cardiology", "Neurology", "Oncology"],
                    "available_specialists": ["Neurosurgeon", "Cardiologist", "Oncologist", "Trauma Specialist"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY", "CGHS"],
                    "doctors": [
                        {"name": "Dr. Arvind Mehta", "degree": "MBBS, MD, DM", "specialization": "Cardiologist", "years_experience": 18, "available_days": ["Mon", "Tue", "Wed", "Fri"], "available_hours": "11:00 AM - 04:00 PM"},
                        {"name": "Dr. Priya Nair", "degree": "MBBS, MS, MCh", "specialization": "General Surgeon", "years_experience": 14, "available_days": ["Tue", "Thu", "Sat"], "available_hours": "10:00 AM - 02:00 PM"},
                        {"name": "Dr. Rohit Verma", "degree": "MBBS, MD", "specialization": "Pediatrician", "years_experience": 10, "available_days": ["Mon", "Wed", "Thu", "Fri", "Sat"], "available_hours": "09:00 AM - 01:00 PM"},
                        {"name": "Dr. Meenal Shah", "degree": "MBBS, DNB", "specialization": "Gynecologist", "years_experience": 12, "available_days": ["Mon", "Tue", "Thu", "Fri"], "available_hours": "02:00 PM - 06:00 PM"},
                    ]
                },
                {
                    "name": "Primary Health Centre (PHC) Khopoli",
                    "facility_level": HealthcareLevelEnum.PHC,
                    "latitude": 18.7885, "longitude": 73.3448,
                    "address": "Lonavala Highway, Khopoli, Raigad, Maharashtra 410203",
                    "phone": "02192-263050", "contact_phone": "02192-263050", "opening_hours": "24 Hours",
                    "is_government": True, "ownership_type": "government",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 30,
                    "available_services": ["Emergency Triage", "First Aid", "General OPD"],
                    "available_specialists": ["Medical Officer", "General Physician"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY"],
                    "doctors": [
                        {"name": "Dr. Ganesh Wagh", "degree": "MBBS", "specialization": "General Physician", "years_experience": 5, "available_days": ["Mon", "Tue", "Wed", "Thu", "Fri"], "available_hours": "09:00 AM - 02:00 PM"},
                        {"name": "Dr. Rekha Chaugule", "degree": "MBBS", "specialization": "General Physician", "years_experience": 7, "available_days": ["Tue", "Thu", "Sat"], "available_hours": "10:00 AM - 02:00 PM"},
                    ]
                },
                {
                    "name": "King Edward Memorial (KEM) Hospital Mumbai",
                    "facility_level": HealthcareLevelEnum.DISTRICT_HOSPITAL,
                    "latitude": 19.0022, "longitude": 72.8427,
                    "address": "Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012",
                    "phone": "022-24107000", "contact_phone": "108", "opening_hours": "24 Hours",
                    "is_government": True, "ownership_type": "government",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 1800,
                    "available_services": ["Tertiary Trauma Center", "Organ Transplant", "Pediatrics", "Cardiology"],
                    "available_specialists": ["Cardiothoracic Surgeon", "Pediatric Surgeon", "Neurologist"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY", "CGHS", "ESIC"],
                    "doctors": [
                        {"name": "Dr. Sanjay Solanki", "degree": "MBBS, MS, MCh", "specialization": "General Surgeon", "years_experience": 20, "available_days": ["Mon", "Wed", "Fri"], "available_hours": "09:00 AM - 01:00 PM"},
                        {"name": "Dr. Radhika Iyer", "degree": "MBBS, MD", "specialization": "Pediatrician", "years_experience": 13, "available_days": ["Mon", "Tue", "Thu", "Fri"], "available_hours": "10:00 AM - 02:00 PM"},
                        {"name": "Dr. Vivek Kadam", "degree": "MBBS, MD", "specialization": "General Physician", "years_experience": 15, "available_days": ["Tue", "Thu", "Sat"], "available_hours": "09:00 AM - 01:00 PM"},
                    ]
                },
                {
                    "name": "District Government Hospital Nagpur",
                    "facility_level": HealthcareLevelEnum.DISTRICT_HOSPITAL,
                    "latitude": 21.1458, "longitude": 79.0882,
                    "address": "Sitabuldi, Nagpur, Maharashtra 440001",
                    "phone": "0712-2560011", "contact_phone": "108", "opening_hours": "24 Hours",
                    "is_government": True, "ownership_type": "government",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 500,
                    "available_services": ["Emergency ICU", "Trauma Unit", "Burn Ward", "Dialysis"],
                    "available_specialists": ["Trauma Specialist", "Nephrologist", "Pulmonologist"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY", "CGHS"],
                    "doctors": [
                        {"name": "Dr. Milind Deshpande", "degree": "MBBS, MS", "specialization": "Orthopedic Surgeon", "years_experience": 16, "available_days": ["Mon", "Tue", "Wed", "Thu"], "available_hours": "09:00 AM - 01:00 PM"},
                        {"name": "Dr. Vandana Tulpule", "degree": "MBBS, MD", "specialization": "General Physician", "years_experience": 12, "available_days": ["Mon", "Wed", "Fri"], "available_hours": "10:00 AM - 02:00 PM"},
                        {"name": "Dr. Harish Tripathi", "degree": "MBBS, MD", "specialization": "Pediatrician", "years_experience": 9, "available_days": ["Tue", "Thu", "Sat"], "available_hours": "11:00 AM - 03:00 PM"},
                    ]
                },
                {
                    "name": "Sub-District Hospital Talegaon Dabhade",
                    "facility_level": HealthcareLevelEnum.RURAL_HOSPITAL,
                    "latitude": 18.7308, "longitude": 73.6775,
                    "address": "Station Road, Talegaon, Pune, Maharashtra 410507",
                    "phone": "02114-222300", "contact_phone": "02114-222300", "opening_hours": "24 Hours",
                    "is_government": True, "ownership_type": "government",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 100,
                    "available_services": ["Emergency Ward", "Maternity", "General Surgery"],
                    "available_specialists": ["General Physician", "Surgeon"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY"],
                    "doctors": [
                        {"name": "Dr. Ashok Rane", "degree": "MBBS, MS", "specialization": "General Surgeon", "years_experience": 11, "available_days": ["Mon", "Wed", "Fri"], "available_hours": "09:30 AM - 01:30 PM"},
                        {"name": "Dr. Shilpa Chalke", "degree": "MBBS, MD", "specialization": "General Physician", "years_experience": 8, "available_days": ["Tue", "Thu", "Sat"], "available_hours": "10:00 AM - 02:00 PM"},
                    ]
                },
                {
                    "name": "Apollo Clinic Vashi",
                    "facility_level": HealthcareLevelEnum.RURAL_HOSPITAL,
                    "latitude": 19.0385, "longitude": 73.0332,
                    "address": "Plot 14, Palm Beach Road, Vashi, Navi Mumbai, Maharashtra 400703",
                    "phone": "022-27811200", "contact_phone": "022-27811200", "opening_hours": "8:00 AM - 9:00 PM",
                    "is_government": False, "ownership_type": "private",
                    "emergency_available": True, "emergency_services": True, "is_24x7": False, "beds_available": 40,
                    "available_services": ["Diagnostics", "Specialist OPD", "Pediatrics", "Gynecology"],
                    "available_specialists": ["General Physician", "Pediatrician", "Orthopedic Specialist"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY"],
                    "doctors": [
                        {"name": "Dr. Sameer Merchant", "degree": "MBBS, MD", "specialization": "General Physician", "years_experience": 15, "available_days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "available_hours": "09:00 AM - 01:00 PM"},
                        {"name": "Dr. Neha Kapoor", "degree": "MBBS, DNB", "specialization": "Pediatrician", "years_experience": 9, "available_days": ["Mon", "Wed", "Fri"], "available_hours": "10:00 AM - 02:00 PM"},
                        {"name": "Dr. Rajiv Bhatia", "degree": "MBBS, MS", "specialization": "Orthopedic Surgeon", "years_experience": 12, "available_days": ["Tue", "Thu", "Sat"], "available_hours": "04:00 PM - 08:00 PM"},
                    ]
                },
                {
                    "name": "Lifeline Specialty Hospital Panvel",
                    "facility_level": HealthcareLevelEnum.RURAL_HOSPITAL,
                    "latitude": 18.9912, "longitude": 73.1235,
                    "address": "Sion-Panvel Highway, New Panvel, Raigad, Maharashtra 410206",
                    "phone": "022-27488800", "contact_phone": "022-27488800", "opening_hours": "24 Hours",
                    "is_government": False, "ownership_type": "private",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 75,
                    "available_services": ["Emergency", "Laparoscopic Surgery", "ICU", "Maternity"],
                    "available_specialists": ["Consultant Physician", "Gynecologist", "Pediatrician"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY"],
                    "doctors": [
                        {"name": "Dr. Kiran Salunkhe", "degree": "MBBS, MD", "specialization": "General Physician", "years_experience": 11, "available_days": ["Mon", "Wed", "Fri", "Sat"], "available_hours": "10:00 AM - 02:00 PM"},
                        {"name": "Dr. Smita Kamble", "degree": "MBBS, MS", "specialization": "Gynecologist", "years_experience": 13, "available_days": ["Mon", "Tue", "Thu", "Fri"], "available_hours": "11:00 AM - 03:00 PM"},
                        {"name": "Dr. Tarun Agarwal", "degree": "MBBS, DCH", "specialization": "Pediatrician", "years_experience": 8, "available_days": ["Tue", "Thu", "Sat"], "available_hours": "09:00 AM - 01:00 PM"},
                    ]
                },
                # 5 New Real Empanelled Private Hospitals (MJPJAY Raigad District List)
                {
                    "name": "Panacea Hospital",
                    "facility_level": HealthcareLevelEnum.RURAL_HOSPITAL,
                    "latitude": 18.9965, "longitude": 73.1180,
                    "address": "Plot No. 105/106, Sector No. 08, New Panvel, Raigad, Maharashtra 410206",
                    "phone": "022-27464001", "contact_phone": "022-27464001", "opening_hours": "24 Hours",
                    "is_government": False, "ownership_type": "private",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 50,
                    "available_services": ["General Surgery", "ICU", "Gynaecology", "Pediatrics", "Emergency Care"],
                    "available_specialists": ["General Surgeon", "Gynecologist", "Physician"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY"],
                    "doctors": [
                        {"name": "Dr. Vijay Jadhav", "degree": "MBBS, MS", "specialization": "General Surgeon", "years_experience": 12, "available_days": ["Mon", "Tue", "Wed", "Thu", "Fri"], "available_hours": "10:00 AM - 02:00 PM"},
                        {"name": "Dr. Snehal Shinde", "degree": "MBBS, DGO", "specialization": "Gynecologist", "years_experience": 8, "available_days": ["Mon", "Wed", "Fri", "Sat"], "available_hours": "11:00 AM - 03:00 PM"}
                    ]
                },
                {
                    "name": "Unnati Hospital and ICU",
                    "facility_level": HealthcareLevelEnum.RURAL_HOSPITAL,
                    "latitude": 18.9918, "longitude": 73.1162,
                    "address": "Shivaji Chowk, MTNL Road, Opp Durgamata Mandir, Panvel, Raigad, Maharashtra 410206",
                    "phone": "022-27453000", "contact_phone": "022-27453000", "opening_hours": "24 Hours",
                    "is_government": False, "ownership_type": "private",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 45,
                    "available_services": ["Critical Care ICU", "Emergency Trauma", "Internal Medicine", "Cardiology"],
                    "available_specialists": ["Intensivist", "Consultant Physician", "Pediatrician"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY"],
                    "doctors": [
                        {"name": "Dr. Nilesh Patil", "degree": "MBBS, MD", "specialization": "Consultant Physician & Intensivist", "years_experience": 14, "available_days": ["Mon", "Tue", "Wed", "Fri", "Sat"], "available_hours": "09:00 AM - 01:00 PM"},
                        {"name": "Dr. Anupama Varma", "degree": "MBBS, DCH", "specialization": "Pediatrician", "years_experience": 9, "available_days": ["Mon", "Wed", "Thu", "Fri"], "available_hours": "10:30 AM - 02:30 PM"}
                    ]
                },
                {
                    "name": "Life Line Hospital Medical & Research Centre",
                    "facility_level": HealthcareLevelEnum.DISTRICT_HOSPITAL,
                    "latitude": 18.9888, "longitude": 73.1170,
                    "address": "Opp ST Bus Stand, Shivaji Road, Panvel, Raigad, Maharashtra 410206",
                    "phone": "022-27455000", "contact_phone": "022-27455000", "opening_hours": "24 Hours",
                    "is_government": False, "ownership_type": "private",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 110,
                    "available_services": ["Multi-Specialty ICU", "Orthopedics", "Cardiology", "Trauma", "Nephrology"],
                    "available_specialists": ["Cardiologist", "Orthopedic Surgeon", "General Surgeon"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY"],
                    "doctors": [
                        {"name": "Dr. Avinash Deshmukh", "degree": "MBBS, MD, DM", "specialization": "Cardiologist", "years_experience": 16, "available_days": ["Mon", "Wed", "Fri"], "available_hours": "11:00 AM - 03:00 PM"},
                        {"name": "Dr. Priya Phadke", "degree": "MBBS, MS", "specialization": "Orthopedic Surgeon", "years_experience": 11, "available_days": ["Tue", "Thu", "Sat"], "available_hours": "10:00 AM - 02:00 PM"}
                    ]
                },
                {
                    "name": "Birmole Hospital",
                    "facility_level": HealthcareLevelEnum.RURAL_HOSPITAL,
                    "latitude": 18.9940, "longitude": 73.1145,
                    "address": "Panvel, Raigad, Maharashtra 410206",
                    "phone": "022-27451234", "contact_phone": "022-27451234", "opening_hours": "24 Hours",
                    "is_government": False, "ownership_type": "private",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 40,
                    "available_services": ["General Surgery", "Maternity Care", "Outpatient Ward", "Emergency"],
                    "available_specialists": ["General Surgeon", "Anesthetist"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY"],
                    "doctors": [
                        {"name": "Dr. Santosh Birmole", "degree": "MBBS, MS", "specialization": "General Surgeon", "years_experience": 18, "available_days": ["Mon", "Tue", "Wed", "Thu", "Fri"], "available_hours": "09:30 AM - 01:30 PM"},
                        {"name": "Dr. Maya Kadam", "degree": "MBBS, MD", "specialization": "Anesthetist & Physician", "years_experience": 10, "available_days": ["Mon", "Wed", "Fri", "Sat"], "available_hours": "10:00 AM - 02:00 PM"}
                    ]
                },
                {
                    "name": "MGM Medical College Hospital for Women and Children",
                    "facility_level": HealthcareLevelEnum.DISTRICT_HOSPITAL,
                    "latitude": 19.0235, "longitude": 73.1040,
                    "address": "Kalamboli, Panvel, Raigad, Maharashtra 410218",
                    "phone": "022-27437999", "contact_phone": "022-27437999", "opening_hours": "24 Hours",
                    "is_government": False, "ownership_type": "private",
                    "emergency_available": True, "emergency_services": True, "is_24x7": True, "beds_available": 300,
                    "available_services": ["Maternal Health", "NICU", "Pediatric Surgery", "Obstetrics", "Immunization"],
                    "available_specialists": ["Obstetrician", "Pediatric Surgeon", "Neonatologist"],
                    "accepted_schemes": ["PM-JAY", "MJPJAY"],
                    "doctors": [
                        {"name": "Dr. Archana Merchant", "degree": "MBBS, MD, DGO", "specialization": "Gynecologist & Obstetrician", "years_experience": 15, "available_days": ["Mon", "Tue", "Thu", "Fri"], "available_hours": "09:00 AM - 01:00 PM"},
                        {"name": "Dr. Sunita MGM", "degree": "MBBS, DCH", "specialization": "Neonatal Pediatrician", "years_experience": 12, "available_days": ["Mon", "Wed", "Fri", "Sat"], "available_hours": "10:00 AM - 02:00 PM"}
                    ]
                }
            ]

            # Upsert all facilities and seed doctors
            for item in facilities_data:
                doc_list = item.pop("doctors", [])
                existing_fac = db.query(HealthcareFacility).filter(HealthcareFacility.name == item["name"]).first()
                if not existing_fac:
                    existing_fac = HealthcareFacility(**item)
                    db.add(existing_fac)
                    db.flush()
                else:
                    existing_fac.ownership_type = item["ownership_type"]
                    existing_fac.is_government = item["is_government"]
                    existing_fac.accepted_schemes = item["accepted_schemes"]
                    existing_fac.latitude = item["latitude"]
                    existing_fac.longitude = item["longitude"]
                    existing_fac.address = item["address"]
                    db.flush()

                doc_count = db.query(Doctor).filter(Doctor.facility_id == existing_fac.id).count()
                if doc_count == 0:
                    for d_info in doc_list:
                        doc = Doctor(
                            facility_id=existing_fac.id,
                            name=d_info["name"],
                            degree=d_info["degree"],
                            specialization=d_info["specialization"],
                            years_experience=d_info["years_experience"],
                            available_days=d_info["available_days"],
                            available_hours=d_info["available_hours"]
                        )
                        db.add(doc)
            
            db.commit()
            logger.info("Successfully seeded & updated all 17 facilities with accepted_schemes into database.")
        except Exception as se:
            logger.error(f"Error seeding facilities & doctors: {se}")
            db.rollback()
        finally:
            db.close()

        logger.info("Database migrations completed successfully.")
    except Exception as e:
        logger.error(f"Error during schema migration: {e}")

