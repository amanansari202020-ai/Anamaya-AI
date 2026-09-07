# Seed Symptom-Disease Reference Data from Kaggle & DDXPlus Datasets

import csv
import json
import logging
import os
import sys

# Ensure backend root is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import SymptomDiseaseReference

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 15-20 Conditions common in rural India
RURAL_INDIA_CONDITIONS = {
    "malaria",
    "dengue",
    "typhoid",
    "tuberculosis",
    "gastroenteritis",
    "cholera",
    "bronchial asthma",
    "anemia",
    "pneumonia",
    "chikungunya",
    "leptospirosis",
    "filariasis",
    "heatstroke",
    "scabies",
    "snakebite",
    "tetanus",
    "jaundice",
    "hepatitis a",
    "impetigo",
    "fungal infection"
}


def seed_symptom_reference(db: Session = None):
    """
    Load Kaggle disease symptoms CSV and DDXPlus symptom weights CSV into DB.
    """
    close_db = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    try:
        # Check existing count
        existing_kaggle = db.query(SymptomDiseaseReference).filter(SymptomDiseaseReference.source == "kaggle").count()
        existing_ddxplus = db.query(SymptomDiseaseReference).filter(SymptomDiseaseReference.source == "ddxplus").count()

        if existing_kaggle > 0 or existing_ddxplus > 0:
            logger.info(f"Clearing {existing_kaggle} Kaggle entries and {existing_ddxplus} DDXPlus entries for fresh seed...")
            db.query(SymptomDiseaseReference).delete()
            db.commit()

        data_dir = os.path.join(backend_dir, "data")
        kaggle_csv_path = os.path.join(data_dir, "kaggle_disease_symptoms.csv")
        ddxplus_csv_path = os.path.join(data_dir, "ddxplus_symptom_weights.csv")

        inserted_kaggle = 0
        inserted_ddxplus = 0

        # 1. Load Kaggle Disease Symptom dataset
        if os.path.exists(kaggle_csv_path):
            logger.info(f"Loading Kaggle dataset from {kaggle_csv_path}...")
            with open(kaggle_csv_path, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    disease_name = row.get("disease_name", "").strip()
                    symptoms_raw = row.get("symptoms", "")
                    if not disease_name or not symptoms_raw:
                        continue

                    # Parse symptoms (comma separated or JSON)
                    if symptoms_raw.startswith("["):
                        try:
                            symptoms_list = json.loads(symptoms_raw)
                        except Exception:
                            symptoms_list = [s.strip() for s in symptoms_raw.strip("[]").split(",")]
                    else:
                        symptoms_list = [s.strip().lower().replace(" ", "_") for s in symptoms_raw.split(",") if s.strip()]

                    symptoms_normalized = [s.lower().strip() for s in symptoms_list if s.strip()]
                    is_rural = disease_name.lower() in RURAL_INDIA_CONDITIONS

                    ref_entry = SymptomDiseaseReference(
                        disease_name=disease_name,
                        symptoms=symptoms_normalized,
                        source="kaggle",
                        weight=1.0,
                        common_in_rural_india=is_rural
                    )
                    db.add(ref_entry)
                    inserted_kaggle += 1

            db.commit()
            logger.info(f"Seeded {inserted_kaggle} Kaggle disease symptom entries.")
        else:
            logger.warning(f"Kaggle CSV not found at {kaggle_csv_path}")

        # 2. Load DDXPlus symptom weights dataset
        if os.path.exists(ddxplus_csv_path):
            logger.info(f"Loading DDXPlus dataset from {ddxplus_csv_path}...")
            with open(ddxplus_csv_path, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    disease_name = row.get("disease_name", "").strip()
                    symptom = row.get("symptom", "").strip().lower().replace(" ", "_")
                    try:
                        weight = float(row.get("frequency_weight", 1.0))
                    except (ValueError, TypeError):
                        weight = 1.0

                    if not disease_name or not symptom:
                        continue

                    is_rural = disease_name.lower() in RURAL_INDIA_CONDITIONS

                    ref_entry = SymptomDiseaseReference(
                        disease_name=disease_name,
                        symptoms=[symptom],
                        source="ddxplus",
                        weight=weight,
                        common_in_rural_india=is_rural
                    )
                    db.add(ref_entry)
                    inserted_ddxplus += 1

            db.commit()
            logger.info(f"Seeded {inserted_ddxplus} DDXPlus symptom-weight entries.")
        else:
            logger.warning(f"DDXPlus CSV not found at {ddxplus_csv_path}")

        logger.info("Symptom reference seeding completed successfully.")

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding symptom reference database: {e}")
        raise e
    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_symptom_reference()
