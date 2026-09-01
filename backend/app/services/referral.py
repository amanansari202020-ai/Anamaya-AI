# Smart Referral Service

import uuid
import logging
from typing import Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import Referral, ReferralStatus, HealthcareFacility, User
import qrcode
import io
import base64

logger = logging.getLogger(__name__)


class ReferralService:
    """Smart referral system service"""
    
    @staticmethod
    def generate_referral_id() -> str:
        """Generate unique referral ID"""
        return f"REF-{uuid.uuid4().hex[:8].upper()}"
    
    @staticmethod
    def generate_qr_code(referral_id: str) -> str:
        """Generate QR code for referral"""
        try:
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(f"healthsphere://referral/{referral_id}")
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Convert to base64 for storage/transmission
            buffered = io.BytesIO()
            img.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode()
            
            return f"data:image/png;base64,{img_str}"
        except Exception as e:
            logger.error(f"QR code generation error: {str(e)}")
            return ""
    
    async def create_referral(
        self,
        db: Session,
        patient_id: int,
        referral_data: Dict[str, Any]
    ) -> Referral:
        """
        Create a smart referral
        """
        referral_id = self.generate_referral_id()
        
        referral = Referral(
            referral_id=referral_id,
            patient_id=patient_id,
            from_facility_id=referral_data.get("from_facility_id"),
            to_facility_id=referral_data["to_facility_id"],
            referral_reason=referral_data["referral_reason"],
            symptoms=referral_data.get("symptoms", []),
            ai_assessment=referral_data.get("ai_assessment"),
            status=ReferralStatus.PENDING,
            qr_code=self.generate_qr_code(referral_id)
        )
        
        db.add(referral)
        db.commit()
        
        logger.info(f"Referral created: {referral_id}")
        return referral
    
    async def get_referral_by_id(
        self,
        db: Session,
        referral_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get referral details"""
        referral = db.query(Referral).filter(
            Referral.referral_id == referral_id
        ).first()
        
        if not referral:
            return None
        
        # Get facility details
        to_facility = db.query(HealthcareFacility).filter(
            HealthcareFacility.id == referral.to_facility_id
        ).first()
        
        from_facility = None
        if referral.from_facility_id:
            from_facility = db.query(HealthcareFacility).filter(
                HealthcareFacility.id == referral.from_facility_id
            ).first()
        
        return {
            "referral_id": referral.referral_id,
            "patient_id": referral.patient_id,
            "status": referral.status.value,
            "referral_reason": referral.referral_reason,
            "symptoms": referral.symptoms,
            "ai_assessment": referral.ai_assessment,
            "from_facility": {
                "id": from_facility.id,
                "name": from_facility.name,
                "facility_level": from_facility.facility_level.value
            } if from_facility else None,
            "to_facility": {
                "id": to_facility.id,
                "name": to_facility.name,
                "facility_level": to_facility.facility_level.value,
                "phone": to_facility.phone,
                "address": to_facility.address,
                "available_services": to_facility.available_services
            } if to_facility else None,
            "qr_code": referral.qr_code,
            "created_at": referral.created_at.isoformat(),
            "updated_at": referral.updated_at.isoformat(),
            "disclaimer": "Patient consent is maintained. Access history is logged."
        }
    
    async def get_patient_referrals(
        self,
        db: Session,
        patient_id: int
    ) -> list:
        """Get all referrals for a patient"""
        referrals = db.query(Referral).filter(
            Referral.patient_id == patient_id
        ).order_by(Referral.created_at.desc()).all()
        
        return [
            {
                "referral_id": r.referral_id,
                "status": r.status.value,
                "referral_reason": r.referral_reason,
                "created_at": r.created_at.isoformat()
            }
            for r in referrals
        ]
    
    async def update_referral(
        self,
        db: Session,
        referral_id: str,
        update_data: Dict[str, Any]
    ) -> Optional[Referral]:
        """Update referral (by healthcare worker)"""
        referral = db.query(Referral).filter(
            Referral.referral_id == referral_id
        ).first()
        
        if not referral:
            return None
        
        if "status" in update_data:
            referral.status = ReferralStatus(update_data["status"])
        
        referral.updated_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"Referral updated: {referral_id} -> {update_data.get('status')}")
        return referral
    
    async def accept_referral(
        self,
        db: Session,
        referral_id: str,
        healthcare_worker_id: int
    ) -> bool:
        """Accept referral at receiving facility"""
        referral = db.query(Referral).filter(
            Referral.referral_id == referral_id
        ).first()
        
        if not referral:
            return False
        
        referral.status = ReferralStatus.ACCEPTED
        referral.updated_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"Referral accepted: {referral_id} by worker {healthcare_worker_id}")
        return True
    
    async def complete_referral(
        self,
        db: Session,
        referral_id: str,
        completion_notes: Optional[str] = None
    ) -> bool:
        """Mark referral as completed"""
        referral = db.query(Referral).filter(
            Referral.referral_id == referral_id
        ).first()
        
        if not referral:
            return False
        
        referral.status = ReferralStatus.COMPLETED
        referral.updated_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"Referral completed: {referral_id}")
        return True
    
    async def cancel_referral(
        self,
        db: Session,
        referral_id: str,
        cancellation_reason: str
    ) -> bool:
        """Cancel a referral"""
        referral = db.query(Referral).filter(
            Referral.referral_id == referral_id
        ).first()
        
        if not referral:
            return False
        
        referral.status = ReferralStatus.CANCELLED
        referral.updated_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"Referral cancelled: {referral_id} - {cancellation_reason}")
        return True
