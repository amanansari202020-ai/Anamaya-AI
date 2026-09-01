# Government Healthcare Scheme Matcher Service

import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models import GovernmentScheme

logger = logging.getLogger(__name__)


class GovernmentSchemeService:
    """Government healthcare scheme matcher and information service"""
    
    # Sample government schemes database
    DEFAULT_SCHEMES = [
        {
            "name": "Ayushman Bharat - PMJAY",
            "description": "Pradhan Mantri Jan Arogya Yojana - Free health insurance for low-income families",
            "eligibility": {
                "income_limit": "Family annual income < 5 lakhs",
                "states": ["all"],
                "categories": ["BPL", "APL"]
            },
            "benefits": [
                "Free hospitalization",
                "Free investigation and treatment",
                "Cashless treatment across network hospitals",
                "Pre-hospitalization and post-hospitalization coverage",
                "Annual coverage of up to 5 lakhs per family"
            ],
            "required_documents": [
                "Aadhaar card",
                "Ration card or income certificate",
                "Address proof",
                "Bank account details"
            ],
            "application_process": "Apply through authorized centers or online",
            "official_website": "https://www.pmjay.gov.in",
            "state": None
        },
        {
            "name": "National Health Mission",
            "description": "Government health program providing affordable healthcare",
            "eligibility": {
                "income_limit": "Varies by state",
                "states": ["all"],
                "categories": ["economically weaker sections"]
            },
            "benefits": [
                "Subsidized healthcare",
                "Free preventive services",
                "Maternal and child health services",
                "Disease surveillance and control programs"
            ],
            "required_documents": [
                "Identity proof",
                "Address proof",
                "Income certificate"
            ],
            "application_process": "Visit nearest health center",
            "official_website": "https://nhm.gov.in",
            "state": None
        },
        {
            "name": "State Health Insurance Scheme",
            "description": "Health insurance scheme provided by state governments",
            "eligibility": {
                "income_limit": "Varies by state",
                "states": ["varies"],
                "categories": ["APL", "BPL"]
            },
            "benefits": [
                "Health insurance coverage",
                "Cashless treatment",
                "Free or subsidized hospitalization"
            ],
            "required_documents": [
                "State ID",
                "Income certificate",
                "Ration card"
            ],
            "application_process": "Apply at state health office",
            "official_website": "Contact state government",
            "state": "varies"
        },
        {
            "name": "RSBY - Rashtriya Swasthya Bima Yojana",
            "description": "Health insurance scheme for unorganized workers",
            "eligibility": {
                "employment_category": "Unorganized sector workers",
                "family_size": "Up to 5 members",
                "income_limit": "Below poverty line"
            },
            "benefits": [
                "Free hospitalization",
                "Free outpatient treatment at network hospitals",
                "Annual coverage of 30,000",
                "Accidental treatment coverage"
            ],
            "required_documents": [
                "Identity proof",
                "Employment certificate",
                "Address proof"
            ],
            "application_process": "Apply through employer or authorized center",
            "official_website": "https://www.rsby.gov.in",
            "state": None
        },
        {
            "name": "Senior Citizen Health Insurance",
            "description": "Special health insurance scheme for senior citizens",
            "eligibility": {
                "age_group": "60+ years",
                "states": ["all"],
                "categories": ["all"]
            },
            "benefits": [
                "Comprehensive health coverage",
                "Lower premiums",
                "Regular health checkups",
                "Hospitalization coverage"
            ],
            "required_documents": [
                "Age proof (Aadhaar, passport)",
                "Address proof",
                "Medical checkup report"
            ],
            "application_process": "Apply directly or through insurance agent",
            "official_website": "https://schi.irdai.gov.in",
            "state": None
        }
    ]
    
    async def initialize_schemes(self, db: Session):
        """Initialize default schemes in database"""
        try:
            # Check if schemes already exist
            existing_count = db.query(GovernmentScheme).count()
            if existing_count > 0:
                return
            
            # Add default schemes
            for scheme_data in self.DEFAULT_SCHEMES:
                scheme = GovernmentScheme(
                    name=scheme_data["name"],
                    description=scheme_data["description"],
                    eligibility_criteria=scheme_data["eligibility"],
                    benefits=scheme_data["benefits"],
                    required_documents=scheme_data["required_documents"],
                    application_process=scheme_data["application_process"],
                    official_website=scheme_data.get("official_website"),
                    state=scheme_data.get("state")
                )
                db.add(scheme)
            
            db.commit()
            logger.info("Government schemes initialized")
        except Exception as e:
            logger.error(f"Error initializing schemes: {str(e)}")
            db.rollback()
    
    async def match_schemes(
        self,
        db: Session,
        matcher_data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Match relevant government schemes based on user eligibility
        """
        # Initialize schemes if needed
        await self.initialize_schemes(db)
        
        age_group = matcher_data.get("age_group")
        state = matcher_data.get("state", "").lower()
        income_category = matcher_data.get("income_category", "").lower()
        employment_category = matcher_data.get("employment_category", "").lower()
        is_student = matcher_data.get("is_student", False)
        is_senior_citizen = matcher_data.get("is_senior_citizen", False)
        
        # Get all schemes
        all_schemes = db.query(GovernmentScheme).all()
        
        matched_schemes = []
        
        for scheme in all_schemes:
            match_score = self._calculate_match_score(
                scheme,
                age_group,
                state,
                income_category,
                employment_category,
                is_student,
                is_senior_citizen
            )
            
            if match_score > 0:
                matched_schemes.append({
                    "scheme_id": scheme.id,
                    "name": scheme.name,
                    "description": scheme.description,
                    "eligibility_criteria": scheme.eligibility_criteria,
                    "benefits": scheme.benefits,
                    "required_documents": scheme.required_documents,
                    "application_process": scheme.application_process,
                    "official_website": scheme.official_website,
                    "state": scheme.state,
                    "match_reason": self._get_match_reason(
                        scheme,
                        age_group,
                        income_category,
                        is_senior_citizen
                    ),
                    "relevance_score": match_score,
                    "disclaimer": "Final eligibility is determined by the official authority."
                })
        
        # Sort by relevance
        matched_schemes.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        return matched_schemes
    
    async def get_scheme(
        self,
        db: Session,
        scheme_id: int
    ) -> Optional[Dict[str, Any]]:
        """Get detailed scheme information"""
        scheme = db.query(GovernmentScheme).filter(
            GovernmentScheme.id == scheme_id
        ).first()
        
        if not scheme:
            return None
        
        return {
            "id": scheme.id,
            "name": scheme.name,
            "description": scheme.description,
            "eligibility_criteria": scheme.eligibility_criteria,
            "benefits": scheme.benefits,
            "required_documents": scheme.required_documents,
            "application_process": scheme.application_process,
            "official_website": scheme.official_website,
            "state": scheme.state,
            "disclaimer": "Please verify current eligibility with official sources."
        }
    
    async def search_schemes(
        self,
        db: Session,
        search_term: str
    ) -> List[Dict[str, Any]]:
        """Search schemes by name or description"""
        search_pattern = f"%{search_term}%"
        
        schemes = db.query(GovernmentScheme).filter(
            or_(
                GovernmentScheme.name.ilike(search_pattern),
                GovernmentScheme.description.ilike(search_pattern)
            )
        ).all()
        
        return [
            {
                "id": s.id,
                "name": s.name,
                "description": s.description,
                "benefits": s.benefits[:3]  # First 3 benefits
            }
            for s in schemes
        ]
    
    @staticmethod
    def _calculate_match_score(
        scheme: GovernmentScheme,
        age_group: Optional[str],
        state: str,
        income_category: str,
        employment_category: str,
        is_student: bool,
        is_senior_citizen: bool
    ) -> float:
        """Calculate match score for a scheme"""
        score = 0
        
        # Check state eligibility
        if scheme.state is None or scheme.state.lower() == "all" or scheme.state.lower() == state:
            score += 20
        
        # Check age eligibility
        if is_senior_citizen and "senior" in scheme.name.lower():
            score += 30
        
        # Check income category eligibility
        eligibility = scheme.eligibility_criteria or {}
        if income_category:
            if "bpl" in income_category.lower() and "bpl" in str(eligibility).lower():
                score += 25
            elif "apl" in income_category.lower() and "apl" in str(eligibility).lower():
                score += 25
        
        # Check employment category eligibility
        if employment_category:
            if "unorganized" in employment_category.lower() and "rsby" in scheme.name.lower():
                score += 30
        
        # Generic match bonus
        if score == 0:
            score = 10
        
        return score
    
    @staticmethod
    def _get_match_reason(
        scheme: GovernmentScheme,
        age_group: Optional[str],
        income_category: str,
        is_senior_citizen: bool
    ) -> str:
        """Generate match reason explanation"""
        if is_senior_citizen and "senior" in scheme.name.lower():
            return "Scheme designed for senior citizens (60+ years)"
        elif income_category:
            return f"Your income category ({income_category}) matches this scheme's eligibility"
        else:
            return f"{scheme.name} may be relevant based on your profile"
