from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from pydantic import BaseModel, EmailStr
import re

router = APIRouter()

class NewsletterSignup(BaseModel):
    email: EmailStr
    name: str = ""

class NewsletterResponse(BaseModel):
    message: str
    email: str

@router.post("/subscribe", response_model=NewsletterResponse)
def subscribe(data: NewsletterSignup, db: Session = Depends(get_db)):
    existing = db.query(models.NewsletterSubscriber).filter(
        models.NewsletterSubscriber.email == data.email
    ).first()
    if existing:
        if existing.is_active:
            return NewsletterResponse(message="Already subscribed", email=data.email)
        existing.is_active = True
        existing.name = data.name
        db.commit()
        return NewsletterResponse(message="Re-subscribed successfully", email=data.email)

    subscriber = models.NewsletterSubscriber(email=data.email, name=data.name)
    db.add(subscriber)
    db.commit()
    return NewsletterResponse(message="Subscribed successfully", email=data.email)


@router.post("/unsubscribe")
def unsubscribe(email: str, db: Session = Depends(get_db)):
    subscriber = db.query(models.NewsletterSubscriber).filter(
        models.NewsletterSubscriber.email == email
    ).first()
    if not subscriber:
        raise HTTPException(status_code=404, detail="Email not found")
    subscriber.is_active = False
    db.commit()
    return {"message": "Unsubscribed successfully"}
