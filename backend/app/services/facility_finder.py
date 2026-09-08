# Healthcare Facility Finder Service

import math
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models import HealthcareFacility, Doctor, AppointmentRequest, AppointmentFeedback

logger = logging.getLogger(__name__)


class FacilityFinderService:
    """Healthcare facility discovery and search service"""
    
    @staticmethod
    def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate distance between two coordinates using Haversine formula
        Returns distance in kilometers
        """
        R = 6371  # Earth radius in km
        
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        
        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlon / 2) ** 2)
        
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        
        return distance
    
    async def find_nearby_facilities(
        self,
        db: Session,
        user_latitude: float,
        user_longitude: float,
        facility_level: Optional[str] = None,
        radius_km: float = 50
    ) -> List[Dict[str, Any]]:
        """
        Find nearby healthcare facilities
        """
        # Query all facilities
        query = db.query(HealthcareFacility)
        
        if facility_level:
            query = query.filter(HealthcareFacility.facility_level == facility_level)
        
        facilities = query.all()
        
        # Calculate distances and filter
        nearby_facilities = []
        for facility in facilities:
            distance = self.calculate_distance(
                user_latitude,
                user_longitude,
                facility.latitude,
                facility.longitude
            )
            
            if distance <= radius_km:
                nearby_facilities.append({
                    "id": facility.id,
                    "name": facility.name,
                    "facility_level": facility.facility_level.value if hasattr(facility.facility_level, 'value') else str(facility.facility_level),
                    "address": facility.address,
                    "phone": facility.phone,
                    "email": facility.email,
                    "opening_hours": facility.opening_hours,
                    "is_government": facility.is_government,
                    "ownership_type": getattr(facility, 'ownership_type', 'government' if facility.is_government else 'private'),
                    "available_services": facility.available_services or [],
                    "available_specialists": facility.available_specialists or [],
                    "accepted_schemes": facility.accepted_schemes or [],
                    "emergency_available": facility.emergency_available,
                    "beds_available": facility.beds_available,
                    "distance_km": round(distance, 2),
                    "coordinates": {
                        "latitude": facility.latitude,
                        "longitude": facility.longitude
                    }
                })
        
        # Sort by distance
        nearby_facilities.sort(key=lambda x: x["distance_km"])
        
        return nearby_facilities

    async def find_nearby_facilities_with_doctors(
        self,
        db: Session,
        user_latitude: float,
        user_longitude: float,
        radius_km: float = 25
    ) -> Dict[str, Any]:
        """
        Find nearby healthcare facilities with nested doctors list, grouped into government and private.
        """
        facilities = db.query(HealthcareFacility).all()
        
        government_list = []
        private_list = []
        
        for facility in facilities:
            distance = self.calculate_distance(
                user_latitude,
                user_longitude,
                facility.latitude,
                facility.longitude
            )
            
            if distance <= radius_km:
                # Query doctors for this facility
                doctors = db.query(Doctor).filter(Doctor.facility_id == facility.id).all()
                doctors_data = []
                for d in doctors:
                    fb_list = db.query(AppointmentFeedback).join(
                        AppointmentRequest, AppointmentFeedback.appointment_id == AppointmentRequest.id
                    ).filter(AppointmentRequest.doctor_id == d.id).all()
                    
                    review_count = len(fb_list)
                    avg_rating = round(sum(f.rating for f in fb_list) / review_count, 1) if review_count > 0 else None
                    
                    doctors_data.append({
                        "id": d.id,
                        "facility_id": d.facility_id,
                        "name": d.name,
                        "degree": d.degree,
                        "specialization": d.specialization,
                        "years_experience": d.years_experience,
                        "available_days": d.available_days or [],
                        "available_hours": d.available_hours,
                        "average_rating": avg_rating,
                        "review_count": review_count
                    })
                
                ownership = getattr(facility, 'ownership_type', None)
                if not ownership:
                    ownership = "government" if facility.is_government else "private"
                
                fac_dict = {
                    "id": facility.id,
                    "name": facility.name,
                    "facility_level": facility.facility_level.value if hasattr(facility.facility_level, 'value') else str(facility.facility_level),
                    "address": facility.address,
                    "phone": facility.phone or facility.contact_phone,
                    "contact_phone": facility.contact_phone or facility.phone,
                    "email": facility.email,
                    "opening_hours": facility.opening_hours,
                    "is_government": facility.is_government,
                    "ownership_type": ownership,
                    "available_services": facility.available_services or [],
                    "available_specialists": facility.available_specialists or [],
                    "accepted_schemes": facility.accepted_schemes or [],
                    "emergency_available": facility.emergency_available,
                    "emergency_services": facility.emergency_services,
                    "is_24x7": facility.is_24x7,
                    "beds_available": facility.beds_available,
                    "distance_km": round(distance, 2),
                    "coordinates": {
                        "latitude": facility.latitude,
                        "longitude": facility.longitude
                    },
                    "doctors": doctors_data
                }
                
                if ownership == "private" or not facility.is_government:
                    private_list.append(fac_dict)
                else:
                    government_list.append(fac_dict)
        
        government_list.sort(key=lambda x: x["distance_km"])
        private_list.sort(key=lambda x: x["distance_km"])
        
        return {
            "success": True,
            "government": government_list,
            "private": private_list,
            "total_count": len(government_list) + len(private_list)
        }

    async def find_accepting_facilities(
        self,
        db: Session,
        scheme_name: str,
        user_latitude: float,
        user_longitude: float,
        radius_km: float = 50.0
    ) -> List[Dict[str, Any]]:
        """
        Find nearby healthcare facilities (government AND private) accepting a specific scheme.
        """
        facilities = db.query(HealthcareFacility).all()
        accepting = []
        scheme_clean = scheme_name.strip().upper()

        keywords = []
        if "PM-JAY" in scheme_clean or "PMJAY" in scheme_clean or "AYUSHMAN" in scheme_clean:
            keywords.extend(["PM-JAY", "PMJAY", "AYUSHMAN BHARAT"])
        if "MJPJAY" in scheme_clean or "MAHATMA JYOTIBA" in scheme_clean:
            keywords.extend(["MJPJAY"])
        if "CGHS" in scheme_clean:
            keywords.extend(["CGHS"])
        if "ESIC" in scheme_clean:
            keywords.extend(["ESIC"])
        if not keywords:
            keywords = [scheme_clean]
        
        for facility in facilities:
            schemes = facility.accepted_schemes or []
            matches = False
            for s in schemes:
                s_u = str(s).upper()
                for kw in keywords:
                    if kw in s_u or s_u in kw or kw.replace("-", "") == s_u.replace("-", ""):
                        matches = True
                        break
                if matches:
                    break

            if matches:
                dist = self.calculate_distance(user_latitude, user_longitude, facility.latitude, facility.longitude)
                if dist <= radius_km:
                    ownership = getattr(facility, 'ownership_type', None)
                    if not ownership:
                        ownership = "government" if facility.is_government else "private"
                    accepting.append({
                        "id": facility.id,
                        "name": facility.name,
                        "facility_level": facility.facility_level.value if hasattr(facility.facility_level, 'value') else str(facility.facility_level),
                        "address": facility.address,
                        "phone": facility.phone or facility.contact_phone,
                        "contact_phone": facility.contact_phone or facility.phone,
                        "email": facility.email,
                        "opening_hours": facility.opening_hours,
                        "is_government": facility.is_government,
                        "ownership_type": ownership,
                        "available_services": facility.available_services or [],
                        "available_specialists": facility.available_specialists or [],
                        "accepted_schemes": facility.accepted_schemes or [],
                        "emergency_available": facility.emergency_available,
                        "emergency_services": facility.emergency_services,
                        "is_24x7": facility.is_24x7,
                        "beds_available": facility.beds_available,
                        "distance_km": round(dist, 2),
                        "coordinates": {
                            "latitude": facility.latitude,
                            "longitude": facility.longitude
                        }
                    })
        
        accepting.sort(key=lambda x: x["distance_km"])
        return accepting

    async def create_appointment_request(
        self,
        db: Session,
        appointment_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create a pending appointment request and emit mock SMS log notification.
        """
        doctor_id = appointment_data.get("doctor_id")
        facility_id = appointment_data.get("facility_id")
        patient_id = appointment_data.get("patient_id")
        guest_name = appointment_data.get("guest_name")
        guest_phone = appointment_data.get("guest_phone")
        requested_date = appointment_data.get("requested_date")
        requested_time_slot = appointment_data.get("requested_time_slot")

        doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
        facility = db.query(HealthcareFacility).filter(HealthcareFacility.id == facility_id).first()

        doctor_name = doctor.name if doctor else "Doctor"
        facility_name = facility.name if facility else "Facility"

        new_request = AppointmentRequest(
            patient_id=patient_id,
            doctor_id=doctor_id,
            facility_id=facility_id,
            guest_name=guest_name,
            guest_phone=guest_phone,
            requested_date=requested_date,
            requested_time_slot=requested_time_slot,
            status="pending"
        )

        db.add(new_request)
        db.commit()
        db.refresh(new_request)

        # Mock SMS Log
        patient_label = guest_name or (f"Patient ID #{patient_id}" if patient_id else "Guest Patient")
        phone_label = guest_phone or "Registered Phone"
        print(f"[MOCK SMS] Appointment request received for {doctor_name} ({doctor.specialization if doctor else ''}) at {facility_name} on {requested_date} ({requested_time_slot}). Patient: {patient_label} ({phone_label}). Status: Pending.")
        logger.info(f"[MOCK SMS] Appointment request #{new_request.id} sent for {doctor_name} on {requested_date}")

        return {
            "id": new_request.id,
            "patient_id": new_request.patient_id,
            "doctor_id": new_request.doctor_id,
            "facility_id": new_request.facility_id,
            "doctor_name": doctor_name,
            "facility_name": facility_name,
            "guest_name": new_request.guest_name,
            "guest_phone": new_request.guest_phone,
            "requested_date": new_request.requested_date,
            "requested_time_slot": new_request.requested_time_slot,
            "status": new_request.status,
            "created_at": new_request.created_at.isoformat() if new_request.created_at else None
        }

    async def get_patient_appointments(
        self,
        db: Session,
        patient_id: int
    ) -> List[Dict[str, Any]]:
        """
        Get all appointment requests for a patient.
        """
        requests = db.query(AppointmentRequest).filter(
            (AppointmentRequest.patient_id == patient_id)
        ).order_by(AppointmentRequest.created_at.desc()).all()

        results = []
        for req in requests:
            doctor = db.query(Doctor).filter(Doctor.id == req.doctor_id).first()
            facility = db.query(HealthcareFacility).filter(HealthcareFacility.id == req.facility_id).first()
            
            fb = db.query(AppointmentFeedback).filter(AppointmentFeedback.appointment_id == req.id).first()
            fb_data = None
            if fb:
                fb_data = {
                    "rating": fb.rating,
                    "tags": fb.tags or [],
                    "comment": fb.comment,
                    "created_at": fb.created_at.isoformat() if fb.created_at else None
                }

            results.append({
                "id": req.id,
                "patient_id": req.patient_id,
                "doctor_id": req.doctor_id,
                "facility_id": req.facility_id,
                "doctor_name": doctor.name if doctor else "Doctor",
                "doctor_specialization": doctor.specialization if doctor else "Specialist",
                "facility_name": facility.name if facility else "Healthcare Center",
                "requested_date": req.requested_date,
                "requested_time_slot": req.requested_time_slot,
                "status": req.status,
                "has_feedback": fb is not None,
                "feedback": fb_data,
                "created_at": req.created_at.isoformat() if req.created_at else None
            })

        return results

    async def search_facilities(
        self,
        db: Session,
        query_str: str,
        facility_level: Optional[str] = None,
        is_government: Optional[bool] = None
    ) -> List[Dict[str, Any]]:
        """
        Search facilities by name or address
        """
        query = db.query(HealthcareFacility)
        
        # Search by name or address
        search_term = f"%{query_str}%"
        query = query.filter(
            or_(
                HealthcareFacility.name.ilike(search_term),
                HealthcareFacility.address.ilike(search_term)
            )
        )
        
        if facility_level:
            query = query.filter(HealthcareFacility.facility_level == facility_level)
        
        if is_government is not None:
            query = query.filter(HealthcareFacility.is_government == is_government)
        
        facilities = query.all()
        
        return [
            {
                "id": f.id,
                "name": f.name,
                "facility_level": f.facility_level.value,
                "address": f.address,
                "phone": f.phone,
                "is_government": f.is_government,
                "available_services": f.available_services,
                "available_specialists": f.available_specialists,
                "emergency_available": f.emergency_available
            }
            for f in facilities
        ]
    
    async def search_by_specialist(
        self,
        db: Session,
        specialist: str,
        user_latitude: Optional[float] = None,
        user_longitude: Optional[float] = None,
        radius_km: float = 50
    ) -> List[Dict[str, Any]]:
        """
        Find facilities with specific specialist
        """
        # Query facilities with the specialist
        query = db.query(HealthcareFacility)
        
        # Filter by specialist in available_specialists
        # Note: This is a simplified approach; in production, use proper JSON queries
        all_facilities = query.all()
        specialist_facilities = [
            f for f in all_facilities
            if f.available_specialists and specialist.lower() in [
                s.lower() for s in f.available_specialists
            ]
        ]
        
        # Filter by distance if coordinates provided
        if user_latitude and user_longitude:
            specialist_facilities = [
                f for f in specialist_facilities
                if self.calculate_distance(
                    user_latitude, user_longitude,
                    f.latitude, f.longitude
                ) <= radius_km
            ]
            
            # Add distance to results
            for f in specialist_facilities:
                f.distance = self.calculate_distance(
                    user_latitude, user_longitude,
                    f.latitude, f.longitude
                )
            
            specialist_facilities.sort(key=lambda x: x.distance)
        
        return [
            {
                "id": f.id,
                "name": f.name,
                "facility_level": f.facility_level.value,
                "address": f.address,
                "phone": f.phone,
                "is_government": f.is_government,
                "available_specialists": f.available_specialists,
                "emergency_available": f.emergency_available,
                "distance_km": round(getattr(f, 'distance', 0), 2)
            }
            for f in specialist_facilities
        ]
    
    async def get_facility(
        self,
        db: Session,
        facility_id: int
    ) -> Optional[Dict[str, Any]]:
        """Get facility details"""
        facility = db.query(HealthcareFacility).filter(
            HealthcareFacility.id == facility_id
        ).first()
        
        if not facility:
            return None
        
        return {
            "id": facility.id,
            "name": facility.name,
            "facility_level": facility.facility_level.value,
            "address": facility.address,
            "phone": facility.phone,
            "email": facility.email,
            "opening_hours": facility.opening_hours,
            "is_government": facility.is_government,
            "available_services": facility.available_services,
            "available_specialists": facility.available_specialists,
            "emergency_available": facility.emergency_available,
            "beds_available": facility.beds_available,
            "coordinates": {
                "latitude": facility.latitude,
                "longitude": facility.longitude
            },
            "service_details": self._get_service_descriptions(facility.facility_level.value)
        }
    
    async def create_facility(
        self,
        db: Session,
        facility_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create new healthcare facility"""
        new_facility = HealthcareFacility(**facility_data)
        db.add(new_facility)
        db.commit()
        
        return {
            "id": new_facility.id,
            "name": new_facility.name,
            "facility_level": new_facility.facility_level.value,
            "message": "Facility created successfully"
        }
    
    @staticmethod
    def _get_service_descriptions(facility_level: str) -> Dict[str, List[str]]:
        """Get typical services for each facility level"""
        services = {
            "home_guidance": [
                "Symptom monitoring",
                "Health advice",
                "Self-care guidance",
                "Medication reminders"
            ],
            "sub_centre": [
                "Basic health screening",
                "Immunization",
                "Maternal and child health",
                "Basic first aid",
                "Referral support"
            ],
            "phc": [
                "General medical consultation",
                "Basic diagnostic tests",
                "Treatment of common illnesses",
                "Maternal and child health services",
                "Referral to higher centres"
            ],
            "rural_hospital": [
                "Advanced diagnostic services",
                "Inpatient services",
                "Emergency care",
                "Surgical services",
                "Specialist consultation",
                "Referral coordination"
            ],
            "district_hospital": [
                "Comprehensive diagnostic services",
                "Advanced surgical care",
                "Specialist services (cardiology, neurology, etc.)",
                "Emergency and trauma care",
                "ICU facilities",
                "Advanced treatment options"
            ]
        }
        
        return services.get(facility_level, [])
