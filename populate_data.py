#!/usr/bin/env python3
"""
Script to populate the database with sample Pakistani phone number data
"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.models.user import db
from src.models.number import Number
from src.main import app

# Sample Pakistani phone number data
sample_data = [
    {
        'phone_number': '+923001234567',
        'network_provider': 'Jazz',
        'location': 'Lahore',
        'country_code': '+92',
        'number_type': 'mobile'
    },
    {
        'phone_number': '+923211234567',
        'network_provider': 'Telenor',
        'location': 'Karachi',
        'country_code': '+92',
        'number_type': 'mobile'
    },
    {
        'phone_number': '+923451234567',
        'network_provider': 'Zong',
        'location': 'Islamabad',
        'country_code': '+92',
        'number_type': 'mobile'
    },
    {
        'phone_number': '+923331234567',
        'network_provider': 'Ufone',
        'location': 'Faisalabad',
        'country_code': '+92',
        'number_type': 'mobile'
    },
    {
        'phone_number': '+923151234567',
        'network_provider': 'Telenor',
        'location': 'Multan',
        'country_code': '+92',
        'number_type': 'mobile'
    },
    {
        'phone_number': '+923041234567',
        'network_provider': 'Jazz',
        'location': 'Rawalpindi',
        'country_code': '+92',
        'number_type': 'mobile'
    },
    {
        'phone_number': '+923461234567',
        'network_provider': 'Zong',
        'location': 'Peshawar',
        'country_code': '+92',
        'number_type': 'mobile'
    },
    {
        'phone_number': '+923341234567',
        'network_provider': 'Ufone',
        'location': 'Quetta',
        'country_code': '+92',
        'number_type': 'mobile'
    },
    {
        'phone_number': '+923221234567',
        'network_provider': 'Telenor',
        'location': 'Hyderabad',
        'country_code': '+92',
        'number_type': 'mobile'
    },
    {
        'phone_number': '+923051234567',
        'network_provider': 'Jazz',
        'location': 'Sialkot',
        'country_code': '+92',
        'number_type': 'mobile'
    },
    {
        'phone_number': '+924212345678',
        'network_provider': 'PTCL',
        'location': 'Karachi',
        'country_code': '+92',
        'number_type': 'landline'
    },
    {
        'phone_number': '+924212345679',
        'network_provider': 'PTCL',
        'location': 'Lahore',
        'country_code': '+92',
        'number_type': 'landline'
    }
]

def populate_database():
    """Populate the database with sample data"""
    with app.app_context():
        print("Populating database with sample data...")
        
        # Clear existing data
        Number.query.delete()
        db.session.commit()
        
        # Add sample data
        for data in sample_data:
            # Check if number already exists
            existing = Number.query.filter_by(phone_number=data['phone_number']).first()
            if not existing:
                number = Number(**data)
                db.session.add(number)
        
        try:
            db.session.commit()
            print(f"Successfully added {len(sample_data)} sample numbers to the database.")
            
            # Print statistics
            total = Number.query.count()
            providers = db.session.query(Number.network_provider, db.func.count(Number.id)).group_by(Number.network_provider).all()
            
            print(f"\nDatabase Statistics:")
            print(f"Total numbers: {total}")
            print("Providers:")
            for provider, count in providers:
                print(f"  - {provider}: {count} numbers")
                
        except Exception as e:
            db.session.rollback()
            print(f"Error adding data: {e}")

if __name__ == '__main__':
    populate_database()

