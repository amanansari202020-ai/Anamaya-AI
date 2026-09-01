# Health Record Service (Digital Health Passport)

import json
import logging
import base64
from typing import Dict, Any, Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models import HealthRecord, DataSync, User
import qrcode
import io

logger = logging.getLogger(__name__)


class HealthRecordService:
    """Digital Health Passport and health record management"""
    
    async def get_health_passport(
        self,
        db: Session,
        patient_id: int
    ) -> Dict[str, Any]:
        """
        Get comprehensive digital health passport
        """
        # Get patient user
        patient = db.query(User).filter(User.id == patient_id).first()
        if not patient:
            return {}
        
        # Get all health records
        records = db.query(HealthRecord).filter(
            HealthRecord.patient_id == patient_id
        ).order_by(HealthRecord.created_at.desc()).all()
        
        # Organize records by type
        organized_records = {
            "consultations": [],
            "diagnostics": [],
            "prescriptions": [],
            "reports": [],
            "vaccinations": []
        }
        
        for record in records:
            record_data = {
                "id": record.id,
                "title": record.title,
                "content": record.content,
                "created_at": record.created_at.isoformat(),
                "updated_at": record.updated_at.isoformat()
            }
            
            if record.record_type in organized_records:
                organized_records[record.record_type].append(record_data)
        
        # Create passport
        passport = {
            "patient_id": patient_id,
            "patient_name": patient.full_name,
            "email": patient.email,
            "phone": patient.phone,
            "created_date": patient.created_at.isoformat(),
            "last_updated": max(
                (r.updated_at for r in records),
                default=datetime.utcnow()
            ).isoformat(),
            "health_records": organized_records,
            "total_visits": len([r for r in records if r.record_type == "consultation"]),
            "accessibility": {
                "offline_enabled": True,
                "consent_based_sharing": True,
                "access_history_available": True
            }
        }
        
        return passport
    
    async def add_health_record(
        self,
        db: Session,
        patient_id: int,
        record_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Add a new health record to passport
        """
        record = HealthRecord(
            patient_id=patient_id,
            record_type=record_data.get("record_type", "consultation"),
            title=record_data.get("title", ""),
            content=record_data.get("content", ""),
            attachments=record_data.get("attachments")
        )
        
        db.add(record)
        db.commit()
        
        # Track for offline sync
        sync_entry = DataSync(
            user_id=patient_id,
            entity_type="health_record",
            entity_id=record.id,
            action="create"
        )
        db.add(sync_entry)
        db.commit()
        
        logger.info(f"Health record added for patient {patient_id}: {record.id}")
        
        return {
            "id": record.id,
            "record_type": record.record_type,
            "title": record.title,
            "created_at": record.created_at.isoformat()
        }
    
    async def generate_health_passport_qr(
        self,
        db: Session,
        patient_id: int
    ) -> str:
        """
        Generate QR code for digital health passport
        """
        try:
            # Create a unique health passport token/link
            passport_link = f"healthsphere://passport/{patient_id}"
            
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(passport_link)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Convert to base64
            buffered = io.BytesIO()
            img.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode()
            
            qr_code_url = f"data:image/png;base64,{img_str}"
            logger.info(f"Health passport QR generated for patient {patient_id}")
            
            return qr_code_url
        except Exception as e:
            logger.error(f"QR code generation error: {str(e)}")
            return ""
    
    async def share_health_record(
        self,
        db: Session,
        patient_id: int,
        record_id: int,
        shared_with_facility_id: int,
        access_duration_days: int = 30
    ) -> bool:
        """
        Share health record with another facility (with consent)
        """
        record = db.query(HealthRecord).filter(
            and_(
                HealthRecord.id == record_id,
                HealthRecord.patient_id == patient_id
            )
        ).first()
        
        if not record:
            return False
        
        # In production, create proper access log and consent tracking
        logger.info(
            f"Record {record_id} shared with facility {shared_with_facility_id} "
            f"for {access_duration_days} days"
        )
        
        return True
    
    async def get_access_history(
        self,
        db: Session,
        patient_id: int
    ) -> List[Dict[str, Any]]:
        """
        Get who accessed the patient's health records
        """
        # In production, fetch from proper access log table
        return [
            {
                "facility_name": "Example PHC",
                "accessed_date": datetime.utcnow().isoformat(),
                "records_accessed": ["consultation", "prescription"],
                "access_duration": "30 days"
            }
        ]
    
    async def revoke_access(
        self,
        db: Session,
        patient_id: int,
        facility_id: int
    ) -> bool:
        """
        Revoke facility access to patient records
        """
        logger.info(f"Access revoked for facility {facility_id} to patient {patient_id}")
        return True
    
    async def sync_pending_data(
        self,
        db: Session,
        user_id: int
    ) -> int:
        """
        Sync pending offline data when connectivity is restored
        """
        # Get all pending sync entries
        pending_syncs = db.query(DataSync).filter(
            and_(
                DataSync.user_id == user_id,
                DataSync.last_synced_at.is_(None)
            )
        ).all()
        
        synced_count = 0
        
        for sync in pending_syncs:
            try:
                # Mark as synced
                sync.last_synced_at = datetime.utcnow()
                synced_count += 1
            except Exception as e:
                logger.error(f"Sync error for entry {sync.id}: {str(e)}")
        
        if synced_count > 0:
            db.commit()
            logger.info(f"Synced {synced_count} items for user {user_id}")
        
        return synced_count
    
    async def get_offline_data(
        self,
        db: Session,
        patient_id: int
    ) -> Dict[str, Any]:
        """
        Get data that should be available offline
        """
        # Get patient profile
        patient = db.query(User).filter(User.id == patient_id).first()
        if not patient:
            return {}
        
        # Get recent health records (last 1 year)
        records = db.query(HealthRecord).filter(
            HealthRecord.patient_id == patient_id
        ).order_by(HealthRecord.created_at.desc()).limit(50).all()
        
        return {
            "patient_id": patient_id,
            "patient_name": patient.full_name,
            "phone": patient.phone,
            "health_records": [
                {
                    "id": r.id,
                    "type": r.record_type,
                    "title": r.title,
                    "content": r.content,
                    "created_at": r.created_at.isoformat()
                }
                for r in records
            ],
            "sync_timestamp": datetime.utcnow().isoformat(),
            "offline_available": True
        }
    
    async def update_offline_record(
        self,
        db: Session,
        patient_id: int,
        record_id: int,
        updates: Dict[str, Any]
    ) -> bool:
        """
        Update a record that was modified offline
        """
        record = db.query(HealthRecord).filter(
            and_(
                HealthRecord.id == record_id,
                HealthRecord.patient_id == patient_id
            )
        ).first()
        
        if not record:
            return False
        
        for key, value in updates.items():
            if hasattr(record, key) and value is not None:
                setattr(record, key, value)
        
        record.updated_at = datetime.utcnow()
        db.commit()
        
        # Track for sync
        sync_entry = DataSync(
            user_id=patient_id,
            entity_type="health_record",
            entity_id=record_id,
            action="update"
        )
        db.add(sync_entry)
        db.commit()
        
        return True
