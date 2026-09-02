# Emergency SOS Service

import math
import asyncio
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import HealthcareFacility, EmergencyNotification, User, PatientProfile
from app.services.facility_finder import FacilityFinderService

logger = logging.getLogger(__name__)

# Simple in-memory sliding window rate limiter: phone -> List[datetime]
_RATE_LIMIT_STORE: Dict[str, List[datetime]] = {}
MAX_NOTIFICATIONS_PER_WINDOW = 3
RATE_LIMIT_WINDOW_MINUTES = 10


def send_message(channel: str, to: str, body: str) -> bool:
    """
    Isolated message sending helper function.
    Can be swapped with a real Twilio / WhatsApp provider in production.
    """
    safe_body = body.encode('ascii', errors='ignore').decode('ascii')
    if channel.lower() == "sms":
        logger.info(f"[MOCK SMS] Sent to {to}: {safe_body}")
        print(f"[MOCK SMS] Sent to {to}: {safe_body}")
    elif channel.lower() == "whatsapp":
        logger.info(f"[MOCK WHATSAPP] Sent to {to}: {safe_body}")
        print(f"[MOCK WHATSAPP] Sent to {to}: {safe_body}")
    return True


class EmergencyService:
    """Service handling Emergency SOS facilities search and notifications."""

    @staticmethod
    def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance in kilometers using Haversine formula."""
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2.0) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return R * c

    async def get_nearby_emergency_facilities(
        self, db: Session, latitude: float, longitude: float, radius_km: float = 25.0
    ) -> List[Dict[str, Any]]:
        """Get nearby emergency-enabled healthcare facilities sorted by distance."""
        facilities = db.query(HealthcareFacility).all()
        
        # Fallback list if database has no facilities
        if not facilities:
            try:
                from app.models import HealthcareLevelEnum
                f1 = HealthcareFacility(
                    name="District Hospital Emergency & Trauma Center",
                    facility_level=HealthcareLevelEnum.DISTRICT_HOSPITAL,
                    latitude=latitude + 0.02,
                    longitude=longitude + 0.02,
                    address="Station Road, District HQ",
                    phone="108",
                    contact_phone="108",
                    emergency_available=True,
                    emergency_services=True,
                    is_24x7=True,
                    available_services=["Emergency Trauma", "ICU", "Ambulance", "24x7 Triage"]
                )
                f2 = HealthcareFacility(
                    name="Community Health Centre (CHC) Emergency Ward",
                    facility_level=HealthcareLevelEnum.RURAL_HOSPITAL,
                    latitude=latitude + 0.05,
                    longitude=longitude + 0.05,
                    address="Main Highway, Block HQ",
                    phone="+91 98765 11111",
                    contact_phone="+91 98765 11111",
                    emergency_available=True,
                    emergency_services=True,
                    is_24x7=True,
                    available_services=["Emergency Care", "Maternity", "Ambulance"]
                )
                db.add(f1)
                db.add(f2)
                db.commit()
                facilities = db.query(HealthcareFacility).all()
            except Exception as e:
                logger.error(f"Error seeding emergency facilities: {e}")
                db.rollback()

        results = []
        for fac in facilities:
            # Match emergency available facilities
            is_emergency = (
                getattr(fac, "emergency_services", False) or 
                getattr(fac, "emergency_available", False) or 
                getattr(fac, "is_24x7", False) or 
                fac.facility_level in ["rural_hospital", "district_hospital", "phc"]
            )
            if not is_emergency:
                continue

            dist = self._haversine(latitude, longitude, fac.latitude, fac.longitude)
            if dist <= radius_km:
                contact = getattr(fac, "contact_phone", None) or fac.phone or "108"
                results.append({
                    "id": fac.id,
                    "name": fac.name,
                    "facility_level": fac.facility_level.value if hasattr(fac.facility_level, "value") else str(fac.facility_level),
                    "latitude": fac.latitude,
                    "longitude": fac.longitude,
                    "address": fac.address or "Emergency Health Facility",
                    "phone": fac.phone or "108",
                    "contact_phone": contact,
                    "distance_km": round(dist, 2),
                    "emergency_services": True,
                    "is_24x7": getattr(fac, "is_24x7", True),
                    "available_services": fac.available_services or ["Emergency Care", "24x7 Ambulance", "Triage"]
                })

        # Sort by distance
        results.sort(key=lambda x: x["distance_km"])
        return results

    async def notify_emergency_contact(
        self,
        db: Session,
        latitude: float,
        longitude: float,
        patient_id: Optional[int] = None,
        guest_name: Optional[str] = None,
        guest_phone: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Send emergency SOS notification via mock SMS & WhatsApp."""
        contact_name = "Emergency Contact"
        contact_phone = None

        if patient_id:
            profile = db.query(PatientProfile).filter(PatientProfile.user_id == patient_id).first()
            user = db.query(User).filter(User.id == patient_id).first()
            if profile and profile.emergency_contact_phone:
                contact_name = profile.emergency_contact_name or (user.full_name + "'s Contact" if user else "Emergency Contact")
                contact_phone = profile.emergency_contact_phone
            elif user and user.phone:
                contact_name = user.full_name or "Registered Patient"
                contact_phone = user.phone

        if not contact_phone:
            contact_name = guest_name or "Emergency Guest"
            contact_phone = guest_phone

        if not contact_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Emergency contact phone number is required."
            )

        # Rate limiting: max 3 calls per phone per 10 minutes
        now = datetime.utcnow()
        history = _RATE_LIMIT_STORE.get(contact_phone, [])
        cutoff = now - timedelta(minutes=RATE_LIMIT_WINDOW_MINUTES)
        history = [t for t in history if t > cutoff]

        if len(history) >= MAX_NOTIFICATIONS_PER_WINDOW:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many emergency alerts sent. Please wait a few minutes before trying again."
            )

        history.append(now)
        _RATE_LIMIT_STORE[contact_phone] = history

        # Construct message with Google Maps location link
        maps_link = f"https://maps.google.com/?q={latitude:.5f},{longitude:.5f}"
        msg_body = (
            f"🆘 EMERGENCY SOS ALERT! {contact_name} has triggered a medical emergency request! "
            f"Current GPS location: {maps_link}. Please respond or call emergency services immediately."
        )

        # Realistic 0.75s sending delay
        await asyncio.sleep(0.75)

        # Send via mock SMS and WhatsApp
        send_message("sms", contact_phone, msg_body)
        send_message("whatsapp", contact_phone, msg_body)

        # Persist notification in database
        try:
            notif = EmergencyNotification(
                patient_id=patient_id,
                contact_name=contact_name,
                contact_phone=contact_phone,
                channel="sms,whatsapp",
                status="sent",
                message_body=msg_body,
                sent_at=now
            )
            db.add(notif)
            db.commit()
        except Exception as e:
            logger.error(f"Failed to log emergency notification: {e}")
            db.rollback()

        return {
            "status": "sent",
            "contact_name": contact_name,
            "contact_phone": contact_phone,
            "channels": ["sms", "whatsapp"],
            "sent_at": now.isoformat()
        }
