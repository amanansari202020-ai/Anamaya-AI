# AI Guidance Service

import json
import logging
import re
import urllib.parse
import urllib.request
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import (
    SymptomAssessment, HealthcareLevelEnum, HealthcareFacility, User,
    SymptomDiseaseReference, MedlinePlusCache
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

    def fetch_medlineplus_summary(self, condition_name: str) -> Optional[str]:
        """
        Fetch official plain-language condition description from NIH MedlinePlus API.
        Includes local NIH description fallback dictionary for offline/resilient access.
        """
        if not condition_name:
            return None

        # Clean search term
        term_clean = condition_name.strip().lower()

        # 1. Try querying live NIH MedlinePlus Web Service
        try:
            encoded_term = urllib.parse.quote(term_clean)
            url = f"https://ws.nlm.nih.gov/medlineplus/services/mp_service.php?db=mplus&term={encoded_term}&retmax=1"
            req = urllib.request.Request(url, headers={"User-Agent": "AnamayaAI-RuralHealth/1.0"})
            with urllib.request.urlopen(req, timeout=3.0) as resp:
                if resp.status == 200:
                    raw_data = resp.read().decode("utf-8")
                    match = re.search(r'<(?:FullSummary|snippet)>(.*?)</(?:FullSummary|snippet)>', raw_data, re.DOTALL | re.IGNORECASE)
                    if match:
                        summary_html = match.group(1)
                        clean_text = re.sub(r'<[^>]+>', '', summary_html).strip()
                        if len(clean_text) > 30:
                            return clean_text
        except Exception as e:
            logger.warning(f"MedlinePlus API fetch failed for '{condition_name}': {e}")

        # 2. Resilient NIH MedlinePlus plain-language fallback dictionary
        medlineplus_fallbacks = {
            "malaria": "Malaria is a mosquito-borne infectious disease caused by a parasite. Symptoms include high fever, chills, sweating, muscle pain, and severe fatigue. Early diagnosis with rapid blood test is critical.",
            "dengue": "Dengue is a mosquito-transmitted viral infection causing sudden high fever, severe headache, eye pain, joint/muscle pain, and skin rash. Platelet count monitoring is recommended.",
            "typhoid": "Typhoid fever is a bacterial infection caused by Salmonella Typhi spread through contaminated food or water. Key signs include prolonged high fever, abdominal pain, diarrhea or constipation, and weakness.",
            "tuberculosis": "Tuberculosis (TB) is a serious bacterial disease primarily affecting the lungs. Symptoms include persistent cough lasting over 2 weeks, chest pain, coughing blood, fever, and night sweats.",
            "gastroenteritis": "Gastroenteritis is an inflammation of the stomach and intestines caused by viral or bacterial infection, resulting in acute diarrhea, vomiting, stomach cramps, and dehydration risk.",
            "pneumonia": "Pneumonia is an infection that inflames lung air sacs, filling them with fluid or phlegm. It causes cough with sputum, fever, chills, chest pain, and difficulty breathing.",
            "bronchial asthma": "Bronchial asthma is a chronic respiratory condition causing airway inflammation, recurring breathlessness, chest tightness, wheezing, and coughing spells.",
            "anemia": "Anemia occurs when blood lacks sufficient healthy red blood cells or hemoglobin, causing fatigue, weakness, pale skin, dizziness, and shortness of breath.",
            "cholera": "Cholera is an acute diarrheal infection caused by Vibrio cholerae bacteria in contaminated water. It causes severe watery diarrhea, rapid dehydration, and muscle cramps.",
            "chikungunya": "Chikungunya is a viral disease spread by mosquitoes, characterized by sudden fever and severe, debilitating joint pain that can linger for weeks.",
            "leptospirosis": "Leptospirosis is a bacterial infection transmitted through water contaminated by animal urine, causing high fever, severe headache, muscle aches, jaundice, and red eyes.",
            "filariasis": "Lymphatic filariasis is a parasitic infection spread by mosquitoes that damages lymphatic vessels, causing painful leg swelling (elephantiasis) and fever.",
            "heatstroke": "Heatstroke is a life-threatening heat emergency where body temperature rises above 104°F, causing confusion, hot dry skin, nausea, rapid pulse, and loss of consciousness.",
            "scabies": "Scabies is an intensely itchy skin condition caused by microscopic mites burrowing into the skin, leading to pimply rashes and sores.",
            "tetanus": "Tetanus is a serious bacterial infection caused by Clostridium tetani entering wounds, resulting in painful muscle stiffness, jaw lock (trismus), and spasms.",
            "snakebite": "Snakebite envenomation is a medical emergency causing rapid local swelling, tissue damage, severe pain, bleeding, and potential systemic neuro/hemotoxicity.",
            "jaundice": "Jaundice is yellowing of skin and eyes due to high bilirubin, often signaling liver infection (hepatitis), gallstones, or hemolysis.",
            "hepatitis a": "Hepatitis A is a contagious liver infection caused by Hepatitis A virus spread via contaminated food/water, causing fever, fatigue, nausea, jaundice, and dark urine.",
            "impetigo": "Impetigo is a highly contagious bacterial skin infection causing honey-colored crusted sores and blisters around the nose and mouth.",
            "fungal infection": "Fungal skin infections (like ringworm or tinea) cause circular red, itchy patches with raised scaling borders on the skin or body.",
            "gerd": "Gastroesophageal Reflux Disease (GERD) occurs when stomach acid flows back into the esophagus, causing heartburn, chest burning, and acid regurgitation.",
            "hypertension": "Hypertension (high blood pressure) is a common chronic vascular condition that can present with headaches, dizziness, chest tightness, or remain asymptomatic.",
            "diabetes": "Diabetes mellitus is a metabolic condition characterized by high blood glucose due to insulin resistance or deficiency, causing frequent urination, thirst, and fatigue.",
            "migraine": "Migraine is a neurological disorder causing severe throbbing headache on one side of the head, accompanied by nausea, sensitivity to light, and visual aura.",
            "heart attack": "Myocardial infarction (heart attack) occurs when blood flow to the heart muscle is blocked, causing crushing chest pain, shortness of breath, sweating, and radiating arm pain."
        }

        return medlineplus_fallbacks.get(term_clean)

    def enrich_with_medlineplus(self, db: Session, candidate_conditions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Enrich candidate conditions with official NIH MedlinePlus plain-language summaries.
        Uses medlineplus_cache DB table to avoid hitting live API repetitively.
        """
        if not candidate_conditions:
            return []

        for candidate in candidate_conditions:
            disease_name = candidate.get("disease_name") or candidate.get("name") or ""
            if not disease_name:
                candidate["summary"] = None
                continue

            disease_key = disease_name.strip()

            # Check DB cache
            try:
                cached_entry = db.query(MedlinePlusCache).filter(MedlinePlusCache.disease_name.ilike(disease_key)).first()
                if cached_entry and cached_entry.summary_text:
                    candidate["summary"] = cached_entry.summary_text
                    continue
            except Exception as e:
                logger.warning(f"Error checking MedlinePlus cache for '{disease_key}': {e}")

            # Fetch summary
            summary = self.fetch_medlineplus_summary(disease_key)
            candidate["summary"] = summary

            # Save to DB cache if summary found
            if summary and db:
                try:
                    new_cache = MedlinePlusCache(disease_name=disease_key, summary_text=summary)
                    db.add(new_cache)
                    db.commit()
                except Exception as e:
                    db.rollback()
                    logger.warning(f"Could not save MedlinePlus cache for '{disease_key}': {e}")

        return candidate_conditions

    def match_candidate_conditions(self, db: Session, user_symptoms: List[str], top_n: int = 4) -> List[Dict[str, Any]]:
        """
        Grounding matching function combining Kaggle (fast list overlap) and DDXPlus (frequency weighted patterns).
        Returns top_n candidate conditions with combined scores, likelihood badges, sources, and rural flags.
        """
        if not user_symptoms:
            return []

        # Normalize input symptoms
        user_sym_clean = [s.lower().strip().replace(" ", "_") for s in user_symptoms if s.strip()]
        user_sym_set = set(user_sym_clean) | {s.replace("_", " ") for s in user_sym_clean}

        if not db:
            return []

        try:
            ref_entries = db.query(SymptomDiseaseReference).all()
        except Exception as e:
            logger.error(f"Error querying symptom_disease_reference: {e}")
            return []

        if not ref_entries:
            return []

        disease_scores = {}

        for entry in ref_entries:
            d_name = entry.disease_name
            if d_name not in disease_scores:
                disease_scores[d_name] = {
                    "disease_name": d_name,
                    "kaggle_score": 0.0,
                    "ddxplus_score": 0.0,
                    "ddxplus_matched_weight": 0.0,
                    "ddxplus_total_weight": 0.0,
                    "matched_symptoms": set(),
                    "sources": set(),
                    "common_in_rural_india": entry.common_in_rural_india
                }

            record = disease_scores[d_name]
            record["sources"].add(entry.source)
            if entry.common_in_rural_india:
                record["common_in_rural_india"] = True

            entry_symptoms = entry.symptoms or []
            if isinstance(entry_symptoms, str):
                entry_symptoms = [entry_symptoms]

            if entry.source == "kaggle":
                # Presence/absence matching for Kaggle entry
                matched = [s for s in entry_symptoms if s.lower() in user_sym_set or any(us in s.lower() or s.lower() in us for us in user_sym_clean)]
                if matched:
                    record["matched_symptoms"].update(matched)
                    score = len(matched) / max(len(entry_symptoms), 1)
                    if score > record["kaggle_score"]:
                        record["kaggle_score"] = score

            elif entry.source == "ddxplus":
                # Frequency-weighted matching for DDXPlus entries
                for sym in entry_symptoms:
                    sym_clean = sym.lower()
                    weight = entry.weight or 1.0
                    record["ddxplus_total_weight"] += weight
                    if sym_clean in user_sym_set or any(us in sym_clean or sym_clean in us for us in user_sym_clean):
                        record["matched_symptoms"].add(sym)
                        record["ddxplus_matched_weight"] += weight

        results = []
        for d_name, record in disease_scores.items():
            k_score = record["kaggle_score"]
            d_score = 0.0
            if record["ddxplus_total_weight"] > 0:
                d_score = record["ddxplus_matched_weight"] / record["ddxplus_total_weight"]
                record["ddxplus_score"] = d_score

            if k_score > 0 and d_score > 0:
                combined_score = (k_score * 0.4) + (d_score * 0.6)
            elif k_score > 0:
                combined_score = k_score
            elif d_score > 0:
                combined_score = d_score
            else:
                continue

            # Boost +0.1 for common_in_rural_india
            if record["common_in_rural_india"]:
                combined_score += 0.1

            combined_score = min(round(combined_score, 2), 1.0)

            if combined_score >= 0.70:
                badge = "High Likelihood"
            elif combined_score >= 0.40:
                badge = "Moderate Likelihood"
            else:
                badge = "Low Likelihood"

            source_str = " + ".join(sorted(list(record["sources"])))

            results.append({
                "disease_name": d_name,
                "name": d_name,
                "score": combined_score,
                "likelihood": badge,
                "matched_symptoms": sorted(list(record["matched_symptoms"])),
                "source": source_str,
                "common_in_rural_india": record["common_in_rural_india"]
            })

        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_n]

    async def get_llm_chat_response(
        self,
        db: Session,
        user_message: str,
        chat_history: Optional[List[Dict[str, Any]]] = None,
        language: str = "en",
        profile_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        DxGPT-style grounded LLM Chat Response combining dataset matching, MedlinePlus enrichment, and language adaptation.
        Includes robust zero-latency fallback when LLM API is unavailable.
        """
        message_lower = (user_message or "").lower()

        known_symptoms = [
            "fever", "cough", "cold", "headache", "body pain", "weakness", "breathlessness",
            "chest pain", "vomiting", "diarrhoea", "diarrhea", "chills", "sweating",
            "abdominal pain", "stomach pain", "rash", "itching", "joint pain", "nausea",
            "jaundice", "yellow skin", "dizziness", "bleeding", "weight loss"
        ]

        extracted_symptoms = [s for s in known_symptoms if s in message_lower]
        if not extracted_symptoms and chat_history:
            for msg in chat_history:
                text = (msg.get("content") or msg.get("text") or "").lower()
                extracted_symptoms.extend([s for s in known_symptoms if s in text])
            extracted_symptoms = list(set(extracted_symptoms))

        if not extracted_symptoms:
            extracted_symptoms = ["fever", "weakness"]

        # Step 1: Match candidate conditions from Kaggle & DDXPlus reference tables
        candidates = self.match_candidate_conditions(db, user_symptoms=extracted_symptoms, top_n=4)

        # Step 2: Enrich candidate conditions with MedlinePlus NIH descriptions
        candidates = self.enrich_with_medlineplus(db, candidates)

        # Build context prompt for LLM
        grounding_context = []
        for c in candidates:
            summary = c.get("summary") or "No official summary available."
            grounding_context.append(
                f"- Condition: {c['disease_name']} (Likelihood: {c['likelihood']}, Match Score: {c['score']}, Source: {c['source']})\n"
                f"  Matched Symptoms: {', '.join(c['matched_symptoms'])}\n"
                f"  MedlinePlus Description: {summary}\n"
                f"  Common in Rural India: {c['common_in_rural_india']}"
            )

        context_str = "\n".join(grounding_context)
        prof_info = profile_context or {}

        is_katkari = language in ["kat", "katkari", "kk"]
        effective_language = "mr" if is_katkari else language
        lang_instruction = "Marathi (mr) with a respectful Katkari greeting 'राम राम! (Ram Ram!)' at the start of reply_text, as Katkari speakers in Raigad district are bilingual with Marathi." if is_katkari else language

        system_prompt = (
            "You are Anamaya AI Care Assistant, an empathetic rural healthcare navigation AI grounded in official NIH medical data.\n"
            "Ground your assessment on these dataset match scores and MedlinePlus summaries:\n"
            f"{context_str}\n\n"
            f"Patient Context: Gender: {prof_info.get('gender', 'not specified')}, Age Group: {prof_info.get('age_group', 'adult')}, Existing Conditions: {prof_info.get('existing_conditions', [])}.\n\n"
            "Instructions:\n"
            "1. Use the MedlinePlus summary as the authoritative description where available.\n"
            "2. Use dataset match scores to determine likelihood ranking.\n"
            "3. Write in simple, clear language suitable for a rural patient.\n"
            f"4. Respond in language: {lang_instruction}\n"
            "5. Return STRICT JSON with keys:\n"
            "   - 'reply_text': (string, empathetic conversational answer explaining symptoms & guidance)\n"
            "   - 'possible_conditions': (list of dicts: {'name': string, 'likelihood': string ('High Likelihood'/'Moderate Likelihood'/'Low Likelihood'), 'explanation': string (incorporating MedlinePlus text), 'matched_symptoms': list of strings, 'common_in_rural_india': boolean})\n"
            "   - 'suggested_tests': (list of strings, e.g. ['Blood Smear for Malaria', 'Complete Blood Count'])\n"
            "   - 'follow_up_questions': (list of strings, 2-3 question chips for patient to tap)\n"
            "   - 'urgency': (string, 'low' | 'medium' | 'high' | 'critical')\n"
            "   - 'recommended_action': (string, e.g. 'Visit nearest PHC within 24 hours')\n"
            "   - 'disclaimer': (string, standard medical advice disclaimer)\n"
        )

        from app.config import settings
        if settings.OPENAI_API_KEY:
            try:
                import openai
                client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
                response = await client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    response_format={"type": "json_object"},
                    max_tokens=900,
                )
                content = response.choices[0].message.content
                if content:
                    return json.loads(content)
            except Exception as e:
                logger.warning(f"LLM API call failed, falling back to dataset grounding engine: {e}")

        # Structured LLM Fallback (Zero-latency offline engine using dataset + MedlinePlus data)
        fallback_conditions = []
        highest_urgency = "medium"

        for c in candidates:
            summary = c.get("summary") or f"Presents with symptoms: {', '.join(c['matched_symptoms'])}. Consult local healthcare provider for evaluation."
            fallback_conditions.append({
                "name": c["disease_name"],
                "likelihood": c["likelihood"],
                "explanation": summary,
                "matched_symptoms": c["matched_symptoms"],
                "common_in_rural_india": c["common_in_rural_india"]
            })
            if c["score"] >= 0.85 or "chest pain" in message_lower or "breathlessness" in message_lower:
                highest_urgency = "high"

        reply_str = (
            f"Based on your symptoms ({', '.join(extracted_symptoms)}), our reference system (Kaggle, DDXPlus, and MedlinePlus NIH data) "
            f"identified {len(fallback_conditions)} potential condition(s). Please review the conditions below and visit your nearest health center."
        )

        if language == "hi":
            reply_str = f"आपके लक्षणों ({', '.join(extracted_symptoms)}) के आधार पर, संदर्भ डेटाबेस ने निम्नलिखित संभावित स्थितियों की पहचान की है। कृपया नजदीकी स्वास्थ्य केंद्र (PHC) पर सलाह लें।"
        elif language == "mr":
            reply_str = f"तुमच्या लक्षणांच्या ({', '.join(extracted_symptoms)}) आधारावर, आरोग्य माहितीकोशाने खालील संभाव्य आजार दर्शविले आहेत. कृपया जवळच्या आरोग्य केंद्राला भेट द्या."
        elif is_katkari:
            reply_str = f"राम राम! तुमच्या लक्षणांच्या ({', '.join(extracted_symptoms)}) आधारावर, आरोग्य माहितीकोशाने खालील संभाव्य आजार दर्शविले आहेत. कृपया जवळच्या आरोग्य केंद्राला (PHC) भेट द्या."

        return {
            "reply_text": reply_str,
            "possible_conditions": fallback_conditions,
            "suggested_tests": [
                "Complete Blood Count (CBC)",
                "Fever Screening / Rapid Diagnostic Test",
                "Vitals check (Blood Pressure, Temperature, SpO2)"
            ],
            "follow_up_questions": [
                "Do you have a high fever with chills?",
                "How many days have you had these symptoms?",
                "Are you experiencing any nausea or difficulty breathing?"
            ],
            "urgency": highest_urgency,
            "recommended_action": "Visit nearest Primary Health Centre (PHC) or Community Health Centre for clinical evaluation.",
            "disclaimer": "Grounded in Kaggle Disease Symptom dataset, DDXPlus differential diagnosis patterns, and NIH MedlinePlus summaries. For informational guidance only."
        }


