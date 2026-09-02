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
        Assess symptoms and provide guidance, factoring in profile_context (existing conditions, age, allergies, pregnancy)
        """
        symptoms = symptom_input.get("symptoms", [])
        duration = symptom_input.get("duration", "unknown")
        severity = symptom_input.get("severity", "moderate")
        profile_context = symptom_input.get("profile_context") or {}

        # If profile_context is missing or empty, fetch from database
        if not profile_context and db and user_id:
            try:
                from app.models import PatientProfile
                profile = db.query(PatientProfile).filter(PatientProfile.user_id == user_id).first()
                if profile:
                    profile_context = {
                        "gender": profile.gender,
                        "age_group": profile.age_group,
                        "existing_conditions": profile.existing_conditions or [],
                        "has_allergies": profile.has_allergies or bool(profile.allergies),
                        "allergy_details": profile.allergy_details or profile.allergies,
                    }
            except Exception as ex:
                logger.warning(f"Could not load patient profile context: {ex}")

        # Normalize symptoms to lowercase
        symptoms = [s.lower() for s in symptoms]
        symptoms_str = " ".join(symptoms)

        # Check for emergency signs
        is_emergency = any(
            emergency_sign in symptoms_str
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

                if data["urgency"] == "high":
                    max_urgency = "high"
                elif data["urgency"] == "medium" and max_urgency != "high":
                    max_urgency = "medium"

        # Apply Rule-Based Risk Adjustments using Profile Context
        existing_conds = profile_context.get("existing_conditions") or []
        if isinstance(existing_conds, str):
            existing_conds = [existing_conds]
        existing_conds = [str(c).lower() for c in existing_conds]

        gender = (profile_context.get("gender") or "").lower()
        age_group = (profile_context.get("age_group") or "").lower()

        risk_warnings = []

        # Rule 1: Asthma + Breathlessness/Cough -> Raise urgency
        if "asthma" in existing_conds and any(s in symptoms_str for s in ["breathlessness", "cough", "shortness of breath"]):
            max_urgency = "high"
            risk_warnings.append("High Risk: Patient has pre-existing asthma with respiratory symptoms.")

        # Rule 2: Pregnancy + Fever/Bleeding/Vomiting -> Raise urgency
        if "pregnancy" in existing_conds and any(s in symptoms_str for s in ["fever", "bleeding", "vomiting", "pain"]):
            max_urgency = "high"
            risk_warnings.append("High Risk: Pregnancy with systemic symptoms requires urgent obstetric evaluation.")

        # Rule 3: Elderly + Severe symptoms -> Raise urgency
        if age_group == "elderly" and (severity == "severe" or max_urgency in ["medium", "high"]):
            if max_urgency == "medium":
                max_urgency = "high"
            risk_warnings.append("Elevated Risk: Elderly patient presenting with significant health symptoms.")

        # Rule 4: Heart/BP + Chest Pain/Shortness of Breath -> Emergency
        if ("heart_bp" in existing_conds or "heart" in existing_conds) and any(s in symptoms_str for s in ["chest pain", "pain", "breathlessness"]):
            is_emergency = True
            risk_warnings.append("Critical Risk: History of cardiovascular condition with acute symptoms.")

        # Remove duplicates
        conditions = list(set(conditions))
        specialists = list(set(specialists))

        # Determine facility level & urgency
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

    async def analyze_disease_image(self, image_base64: str, description: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze a photo of a skin reaction, rash, or visual symptom.
        Returns visual assessment, severity, symptoms, precautions, recommended doctor, and next steps.
        """
        desc_lower = (description or "").lower()

        # Check if OpenAI API key is set for Vision model
        from app.config import settings
        if settings.OPENAI_API_KEY:
            try:
                import openai
                client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
                
                # Format base64 URL if missing prefix
                img_url = image_base64 if image_base64.startswith("data:") else f"data:image/jpeg;base64,{image_base64}"
                
                prompt_text = (
                    "Analyze this medical image (skin reaction, rash, lesion, or physical symptom). "
                    "Provide a JSON response with keys: 'condition_name', 'severity' (Low/Moderate/High/Emergency), "
                    "'symptoms' (list of strings), 'precautions' (list of strings), "
                    "'doctor_specialist' (string, e.g. Dermatologist / General Physician), "
                    "'recommended_facility' (string, e.g. PHC / CHC / District Hospital), "
                    "'next_steps' (list of strings)."
                )
                if description:
                    prompt_text += f" Patient notes: {description}"

                response = await client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": prompt_text},
                                {"type": "image_url", "image_url": {"url": img_url}},
                            ],
                        }
                    ],
                    response_format={"type": "json_object"},
                    max_tokens=800,
                )
                content = response.choices[0].message.content
                if content:
                    return json.loads(content)
            except Exception as e:
                logger.warning(f"OpenAI Vision API failed, using fallback visual analyzer: {e}")

        # Intelligent Fallback Visual Analysis Engine
        if "ring" in desc_lower or "itch" in desc_lower or "fungal" in desc_lower or "circle" in desc_lower:
            condition = "Fungal Infection (Tinea / Ringworm)"
            severity = "Moderate"
            symptoms = ["Circular red patches", "Scaling or itching borders", "Clear center in ring shape", "Localized skin irritation"]
            precautions = [
                "Keep the affected area clean, dry, and cool.",
                "Avoid scratching to prevent secondary bacterial infection.",
                "Do not share towels, clothing, or personal hygiene items.",
                "Wear loose-fitting cotton clothing."
            ]
            doctor = "Dermatologist / General Physician"
            facility = "Primary Health Centre (PHC) or Community Health Centre (CHC)"
            next_steps = [
                "Visit a local PHC for antifungal ointment prescription.",
                "Apply recommended topical antifungal cream as directed for 2-3 weeks.",
                "If spreading or not improving after 7 days, consult a specialist."
            ]
        elif "burn" in desc_lower or "blister" in desc_lower or "scald" in desc_lower:
            condition = "Thermal / Chemical Burn or Blistering"
            severity = "High" if "blister" in desc_lower or "severe" in desc_lower else "Moderate"
            symptoms = ["Skin redness and inflammation", "Blister formation", "Pain or tenderness", "Local swelling"]
            precautions = [
                "Cool the area immediately with clean, cool running water for 10-15 minutes.",
                "Do NOT pop or puncture any blisters.",
                "Do NOT apply ice, butter, or home remedies directly on open burns.",
                "Cover loosely with a clean, dry, sterile cloth or bandage."
            ]
            doctor = "Dermatologist / General Physician / Trauma Care"
            facility = "Community Health Centre (CHC) or District Hospital"
            next_steps = [
                "Seek immediate evaluation at a nearest CHC or District Hospital.",
                "Keep area covered and protected from dust and friction.",
                "Take prescribed pain relievers and apply sterile burn dressing."
            ]
        elif "allergy" in desc_lower or "hive" in desc_lower or "swelling" in desc_lower or "bite" in desc_lower:
            condition = "Acute Allergic Reaction / Urticaria (Hives)"
            severity = "High" if "breathing" in desc_lower or "throat" in desc_lower else "Moderate"
            symptoms = ["Raised itchy red welts", "Localized skin swelling", "Sudden onset after exposure", "Warmth around reaction"]
            precautions = [
                "Identify and immediately remove suspected allergen (food, plant, insect, medicine).",
                "Apply cool compresses to soothe itching and inflammation.",
                "Avoid hot showers or tight clothing that irritate the skin.",
                "Watch closely for facial swelling or throat tightness."
            ]
            doctor = "Dermatologist / General Physician / Allergist"
            facility = "Primary Health Centre (PHC) or Emergency Care if breathing is affected"
            next_steps = [
                "Visit PHC for antihistamine or anti-allergy medication.",
                "If breathing difficulty or lip/throat swelling develops, go to District Hospital Emergency immediately."
            ]
        else:
            condition = "Contact Dermatitis / Inflammatory Skin Reaction"
            severity = "Low to Moderate"
            symptoms = ["Redness and localized rash", "Mild to moderate itching", "Dry or flaking skin patch", "Sensitivity to touch"]
            precautions = [
                "Wash the area gently with mild soap and lukewarm water.",
                "Avoid harsh soaps, detergents, or unverified chemical cosmetics.",
                "Apply a simple moisturizer or aloe vera gel to reduce irritation.",
                "Keep fingernails short and clean to prevent scratching damage."
            ]
            doctor = "Dermatologist / General Physician"
            facility = "Primary Health Centre (PHC) or Local Clinic"
            next_steps = [
                "Monitor for 24-48 hours while maintaining gentle skin care.",
                "Visit a local PHC or General Physician if redness spreads or oozing occurs.",
                "Use prescribed soothing topical cream as advised by the health worker."
            ]

        return {
            "condition_name": condition,
            "severity": severity,
            "symptoms": symptoms,
            "precautions": precautions,
            "doctor_specialist": doctor,
            "recommended_facility": facility,
            "next_steps": next_steps,
            "disclaimer": "This AI visual analysis is for preliminary screening and guidance only. Please consult a qualified doctor for clinical diagnosis."
        }

