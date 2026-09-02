# Authentication Service

from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.models import User, PatientProfile, UserRole
from app.schemas import UserRegister, UserLogin, TokenResponse
from app.config import settings
from app.database import get_db

# Password hashing
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")
security = HTTPBearer()


class AuthService:
    """Authentication and authorization service"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password safely with 72-byte max length for bcrypt"""
        truncated = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return pwd_context.hash(truncated)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password"""
        truncated = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return pwd_context.verify(truncated, hashed_password)
    
    @staticmethod
    def create_access_token(user_id: int, role: str) -> TokenResponse:
        """Create JWT access token"""
        payload = {
            "sub": str(user_id),
            "role": role,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return TokenResponse(
            access_token=token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    
    async def register_user(self, db: Session, user_data: UserRegister) -> User:
        """Register a new user"""
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ValueError("Email already registered")
        
        # Create new user
        new_user = User(
            email=user_data.email,
            phone=user_data.phone,
            full_name=user_data.full_name,
            hashed_password=self.hash_password(user_data.password),
            role=UserRole(user_data.role),
            is_verified=False
        )
        
        db.add(new_user)
        db.commit()
        
        # Create patient profile if role is patient
        if user_data.role == "patient":
            profile = PatientProfile(user_id=new_user.id)
            db.add(profile)
            db.commit()
        
        return new_user
    
    async def authenticate_user(
        self, db: Session, credentials: UserLogin
    ) -> TokenResponse:
        """Authenticate user and return token"""
        user = db.query(User).filter(User.email == credentials.email).first()
        
        if not user or not self.verify_password(credentials.password, user.hashed_password):
            raise ValueError("Invalid email or password")
        
        if not user.is_active:
            raise ValueError("User account is inactive")
        
        return self.create_access_token(user.id, user.role.value)
    
    async def get_current_user(
        self, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)
    ) -> User:
        """Get current authenticated user from token"""
        token = credentials.credentials
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        
        user = db.query(User).filter(User.id == int(user_id)).first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        
        return user
    
    async def get_patient_profile(self, db: Session, user_id: int):
        """Get patient profile"""
        profile = db.query(PatientProfile).filter(
            PatientProfile.user_id == user_id
        ).first()
        return profile
    
    async def update_patient_profile(
        self, db: Session, user_id: int, profile_data: dict
    ):
        """Update patient profile"""
        profile = db.query(PatientProfile).filter(
            PatientProfile.user_id == user_id
        ).first()
        
        if not profile:
            raise ValueError("Profile not found")
        
        for key, value in profile_data.items():
            if hasattr(profile, key) and value is not None:
                setattr(profile, key, value)
        
        profile.updated_at = datetime.utcnow()
        db.commit()
        return profile
