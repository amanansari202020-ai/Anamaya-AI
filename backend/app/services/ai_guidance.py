# AI Guidance Service

import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import (
    SymptomAssessment, HealthcareLevelEnum, HealthcareFacility, User
)
from app.schemas import SymptomAssessmentResponse

logger = logging.getLogger(__name__)


class AIGuidanceService:
    """AI-powered health guidance service"""
    
    # Symptom to condition mappings for demo
    SYMPTOM_CONDITIONS_MAP = {
        "fever": {
            "conditions": ["flu", "covid-19", "bacterial infection", "malaria"],
            "specialists": ["general_physician", "infectious_disease"],
            "urgency": "medium"
        },
        "headache": {
            "conditions": ["migraine", "tension headache", "sinusitis"],
            "specialists": ["general_physician", "neurologist"],
            "urgency": "low"
        },
        "chest pain": {
            "conditions": ["heart condition", "anxiety", "muscle strain"],
            "specialists": ["cardiologist", "general_physician"],
            "urgency": "high"
        },
        "difficulty breathing": {
            "conditions": ["asthma", "pneumonia", "heart condition", "anxiety"],
            "specialists": ["pulmonologist", "cardiologist"],
            "urgency": "high"
        },
        "body pain": {
            "conditions": ["flu", "muscle strain", "arthritis"],
            "specialists": ["general_physician", "orthopedist"],
            "urgency": "low"
        },
        "weakness": {
            "conditions": ["anemia", "malnutrition", "chronic disease"],
            "specialists": ["general_physician", "nutritionist"],
            "urgency": "medium"
        },
        "skin rash": {
            "conditions": ["dermatitis", "ringworm", "allergic reaction"],
            "specialists": ["dermatologist"],
            "urgency": "low"
        },
        "stomach pain": {
            "conditions": ["gastroenteritis", "ulcer", "appendicitis"],
            "specialists": ["general_physician", "gastroenterologist"],
            "urgency": "medium"
        },
    }
    
    # Emergency warning signs
    EMERGENCY_SIGNS = {
        "severe chest pain",
        "difficulty breathing",
        "loss of consciousness",
        "severe bleeding",
        "poisoning",
        "severe allergic reaction",
        "high fever with stiff neck",
        "severe headache",
    }
    
    async def assess_symptoms(
        self,
        db: Session,
        user_id: int,
        symptom_input: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Assess symptoms and provide guidance
        """
        symptoms = symptom_input.get("symptoms", [])
        duration = symptom_input.get("duration", "unknown")
        severity = symptom_input.get("severity", "moderate")
        
        # Normalize symptoms to lowercase
        symptoms = [s.lower() for s in symptoms]
        
        # Check for emergency signs
        is_emergency = any(
            emergency_sign in " ".join(symptoms).lower()
            for emergency_sign in self.EMERGENCY_SIGNS
        )
        
        # Analyze symptoms
        conditions = []
        specialists = []
        max_urgency = "low"
        
        for symptom in symptoms:
            if symptom in self.SYMPTOM_CONDITIONS_MAP:
                data = self.SYMPTOM_CONDITIONS_MAP[symptom]
                conditions.extend(data["conditions"])
                specialists.extend(data["specialists"])
                
                # Update urgency level
                if data["urgency"] == "high":
                    max_urgency = "high"
                elif data["urgency"] == "medium" and max_urgency != "high":
                    max_urgency = "medium"
        
        # Remove duplicates
        conditions = list(set(conditions))
        specialists = list(set(specialists))
        
        # Determine facility level
        if is_emergency:
            facility_level = HealthcareLevelEnum.DISTRICT_HOSPITAL
            urgency_level = "critical"
        elif max_urgency == "high":
            facility_level = HealthcareLevelEnum.RURAL_HOSPITAL
            urgency_level = "high"
        elif max_urgency == "medium":
            facility_level = HealthcareLevelEnum.PHC
            urgency_level = "medium"
        else:
            facility_level = HealthcareLevelEnum.SUB_CENTRE
            urgency_level = "low"
        
        # Create assessment record
        assessment = SymptomAssessment(
            patient_id=user_id,
            symptoms=symptoms,
            ai_assessment={
                "possible_conditions": conditions,
                "analysis": f"Based on reported symptoms ({', '.join(symptoms)}), these conditions may require evaluation.",
                "recommendations": [
                    "Consult with a healthcare professional for proper diagnosis",
                    "Keep track of symptom progression",
                    "Follow-up if symptoms worsen or persist"
                ]
            },
            recommended_facility_level=facility_level,
            recommended_specialists=specialists,
            urgency_level=urgency_level,
            is_emergency=is_emergency
        )
        
        db.add(assessment)
        db.commit()
        
        return {
            "assessment_id": assessment.id,
            "symptoms": symptoms,
            "possible_conditions": conditions,
            "recommended_facility_level": facility_level.value,
            "recommended_specialists": specialists,
            "urgency_level": urgency_level,
            "is_emergency": is_emergency,
            "ai_guidance": assessment.ai_assessment,
            "disclaimer": "HealthSphere AI provides informational guidance and does not replace professional medical advice."
        }
    
    async def get_assessment(
        self,
        db: Session,
        assessment_id: int,
        user_id: int
    ) -> Optional[Dict[str, Any]]:
        """Get existing assessment"""
        assessment = db.query(SymptomAssessment).filter(
            and_(
                SymptomAssessment.id == assessment_id,
                SymptomAssessment.patient_id == user_id
            )
        ).first()
        
        if not assessment:
            return None
        
        return {
            "assessment_id": assessment.id,
            "symptoms": assessment.symptoms,
            "recommended_facility_level": assessment.recommended_facility_level.value,
            "recommended_specialists": assessment.recommended_specialists,
            "urgency_level": assessment.urgency_level,
            "is_emergency": assessment.is_emergency,
            "ai_guidance": assessment.ai_assessment,
            "created_at": assessment.created_at
        }
    
    async def generate_healthcare_journey(
        self,
        db: Session,
        assessment_id: int,
        user: User
    ) -> Optional[Dict[str, Any]]:
        """
        Generate recommended healthcare journey path
        """
        assessment = db.query(SymptomAssessment).filter(
            and_(
                SymptomAssessment.id == assessment_id,
                SymptomAssessment.patient_id == user.id
            )
        ).first()
        
        if not assessment:
            return None
        
        # Build healthcare journey steps
        steps = []
        
        if assessment.is_emergency:
            steps.append({
                "step_number": 1,
                "title": "Emergency Care",
                "description": "Immediate professional medical evaluation required",
                "action": "Go to nearest District Hospital emergency department",
                "facility_level": "district_hospital",
                "estimated_cost": {"min": 5000, "max": 20000}
            })
        else:
            # Step 1: Initial facility
            step1_facility = assessment.recommended_facility_level.value
            step1_cost = self._estimate_step_cost(step1_facility, "consultation")
            
            steps.append({
                "step_number": 1,
                "title": f"Initial Consultation",
                "description": f"Visit a {step1_facility.replace('_', ' ').title()} for initial assessment",
                "action": f"Schedule appointment at recommended {step1_facility}",
                "facility_level": step1_facility,
                "estimated_cost": {"min": step1_cost["min"], "max": step1_cost["max"]}
            })
            
            # Step 2: Diagnostics if needed
            if assessment.urgency_level in ["high", "medium"]:
                steps.append({
                    "step_number": 2,
                    "title": "Diagnostic Tests",
                    "description": "Undergo recommended diagnostic tests if advised",
                    "action": "Follow healthcare provider's recommendations",
                    "facility_level": step1_facility,
                    "estimated_cost": {"min": 500, "max": 3000}
                })
            
            # Step 3: Specialist if needed
            if assessment.recommended_specialists:
                steps.append({
                    "step_number": 3,
                    "title": "Specialist Consultation",
                    "description": f"Consult with {assessment.recommended_specialists[0].replace('_', ' ').title()}",
                    "action": "Referral to specialist if needed",
                    "facility_level": "district_hospital",
                    "estimated_cost": {"min": 800, "max": 2500}
                })
            
            # Step 4: Follow-up
            steps.append({
                "step_number": len(steps) + 1,
                "title": "Follow-up Care",
                "description": "Regular monitoring and follow-up consultations",
                "action": "Schedule follow-up appointments as advised",
                "facility_level": "phc",
                "estimated_cost": {"min": 300, "max": 800}
            })
        
        # Calculate total estimated cost
        total_min = sum(step.get("estimated_cost", {}).get("min", 0) for step in steps)
        total_max = sum(step.get("estimated_cost", {}).get("max", 0) for step in steps)
        
        return {
            "assessment_id": assessment_id,
            "steps": steps,
            "estimated_total_cost": {
                "min": total_min,
                "max": total_max,
                "currency": "INR"
            },
            "recommended_path_description": (
                "Follow the recommended healthcare pathway for optimal care continuity. "
                "Each step builds on previous information to ensure better diagnosis and treatment."
            ),
            "offline_capable": True,
            "sync_available": True
        }
    
    async def estimate_budget(
        self,
        db: Session,
        estimate_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Estimate healthcare costs for a journey
        """
        facility_level = estimate_data.get("facility_level", "phc")
        has_diagnostics = estimate_data.get("has_diagnostics", True)
        needs_specialist = estimate_data.get("needs_specialist", False)
        
        budget = {
            "consultation": self._estimate_step_cost(facility_level, "consultation"),
            "diagnostics": {"min": 500, "max": 2000} if has_diagnostics else {"min": 0, "max": 0},
            "medicine": {"min": 200, "max": 1500},
            "travel": {"min": 100, "max": 500},
        }
        
        if needs_specialist:
            budget["specialist"] = {"min": 800, "max": 2500}
        
        # Calculate total
        total_min = sum(v.get("min", 0) for v in budget.values())
        total_max = sum(v.get("max", 0) for v in budget.values())
        
        return {
            "consultation": budget["consultation"],
            "diagnostics": budget["diagnostics"],
            "medicine": budget["medicine"],
            "travel": budget["travel"],
            "specialist": budget.get("specialist", {"min": 0, "max": 0}),
            "total_estimated": {"min": total_min, "max": total_max},
            "currency": "INR",
            "government_options": [
                "Ayushman Bharat Scheme",
                "State Health Insurance Scheme",
                "National Health Mission"
            ],
            "disclaimer": "These are estimated costs. Actual costs may vary by location and facility."
        }
    
    @staticmethod
    def _estimate_step_cost(facility_level: str, service_type: str) -> Dict[str, int]:
        """Estimate cost for a facility and service type"""
        costs = {
            "sub_centre": {"consultation": 100, "diagnostics": 200},
            "phc": {"consultation": 300, "diagnostics": 500},
            "rural_hospital": {"consultation": 500, "diagnostics": 1000},
            "district_hospital": {"consultation": 800, "diagnostics": 2000},
        }
        
        facility_costs = costs.get(facility_level, {"consultation": 300, "diagnostics": 500})
        service_cost = facility_costs.get(service_type, 300)
        
        return {
            "min": service_cost,
            "max": int(service_cost * 1.5)
        }
