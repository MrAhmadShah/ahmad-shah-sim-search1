from flask_sqlalchemy import SQLAlchemy
from src.models.user import db

class Number(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    network_provider = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    country_code = db.Column(db.String(5), nullable=True)
    number_type = db.Column(db.String(20), nullable=True)  # mobile, landline, etc.
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self):
        return f'<Number {self.phone_number}>'

    def to_dict(self):
        return {
            'id': self.id,
            'phone_number': self.phone_number,
            'network_provider': self.network_provider,
            'location': self.location,
            'country_code': self.country_code,
            'number_type': self.number_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

