from flask import Blueprint, request, jsonify
import re
import requests
from bs4 import BeautifulSoup

search_bp = Blueprint("search", __name__)

EXTERNAL_API_URL = "https://musa699.serv00.net/public api.php"

def normalize_phone_number(phone_number):
    """Normalize phone number by removing spaces, dashes, and other non-digit characters"""
    # Remove all non-digit characters except +
    normalized = re.sub(r'[^\d+]', '', phone_number)
    
    # Check if it's a CNIC (13 digits)
    if len(normalized) == 13 and normalized.isdigit():
        return normalized  # Return CNIC as is
    
    # Handle Pakistani numbers specifically
    if normalized.startswith('0'):
        # Convert 03xx to +923xx
        normalized = '+92' + normalized[1:]
    elif normalized.startswith('92') and not normalized.startswith('+92'):
        # Add + if missing
        normalized = '+' + normalized
    elif not normalized.startswith('+') and len(normalized) >= 10:
        # Assume it's a Pakistani number if no country code
        normalized = '+92' + normalized
    
    return normalized

@search_bp.route('/search', methods=['GET'])
def search_number():
    """Search for number information directly from external API"""
    phone_number = request.args.get('number', '').strip()
    
    if not phone_number:
        return jsonify({
            'error': 'Phone number is required',
            'message': 'Please provide a phone number to search'
        }), 400
    
    # Normalize the phone number
    normalized_number = normalize_phone_number(phone_number)
    
    try:
        print(f"Searching external API for: {normalized_number}")
        # Use the main URL for search, as the API.php seems to return HTML too
        external_api_response = requests.get(f"{EXTERNAL_API_URL}?number={normalized_number}")
        
        if external_api_response.status_code == 200:
            soup = BeautifulSoup(external_api_response.text, 'html.parser')
            
            # Look for the result content in the HTML response
            # The Musa site returns results in a specific format
            html_content = external_api_response.text
            
            parsed_data = {}
            
            # Try to extract data using different methods
            # Method 1: Look for specific patterns in the HTML
            if 'Name:' in html_content or 'CNIC:' in html_content:
                # Extract name
                name_match = re.search(r'Name:\s*([^<\n]+)', html_content, re.IGNORECASE)
                if name_match:
                    parsed_data['Name'] = name_match.group(1).strip()
                
                # Extract CNIC
                cnic_match = re.search(r'CNIC:\s*([^<\n]+)', html_content, re.IGNORECASE)
                if cnic_match:
                    parsed_data['CNIC'] = cnic_match.group(1).strip()
                
                # Extract Address
                address_match = re.search(r'Address:\s*([^<\n]+(?:\n[^<\n]+)*)', html_content, re.IGNORECASE)
                if address_match:
                    parsed_data['Address'] = address_match.group(1).strip()
                
                # Extract Associated Numbers
                numbers_section = re.search(r'Associated Numbers?:\s*(.*?)(?=(?:\n\n|\n[A-Z]|$))', html_content, re.IGNORECASE | re.DOTALL)
                if numbers_section:
                    numbers_text = numbers_section.group(1)
                    # Find all phone numbers in the section, including those with '➤' prefix
                    number_matches = re.findall(r'\+?92\d{10}|\d{11}', numbers_text)
                    parsed_data['Associated Numbers'] = number_matches
            
            # Method 2: Try BeautifulSoup parsing as backup
            if not parsed_data:
                result_div = soup.find('div', id='result')
                if result_div:
                    text_content = result_div.get_text(separator='\n').strip()
                    lines = text_content.split('\n')
                    for line in lines:
                        if ':' in line:
                            key, value = line.split(':', 1)
                            parsed_data[key.strip()] = value.strip()
            
            # If external data is found, return it
            if parsed_data.get('Name') or parsed_data.get('CNIC') or parsed_data.get('Address'):
                # Handle associated numbers
                associated_numbers = []
                if 'Associated Numbers' in parsed_data:
                    if isinstance(parsed_data['Associated Numbers'], list):
                        associated_numbers = parsed_data['Associated Numbers']
                    else:
                        # Split by common separators
                        numbers_str = str(parsed_data['Associated Numbers'])
                        associated_numbers = [num.strip() for num in re.split(r'[,\n➤•-]', numbers_str) if num.strip() and re.match(r'^\+?92?\d{10,11}$', num.strip())]
                
                # Create a simplified response for the frontend, directly from external data
                response_data = {
                    'phone_number': normalized_number,
                    'name': parsed_data.get('Name', 'N/A'),
                    'cnic': parsed_data.get('CNIC', 'N/A'),
                    'address': parsed_data.get('Address', 'N/A'),
                    'associated_numbers': associated_numbers
                }
                return jsonify({
                    'success': True,
                    'data': response_data,
                    'message': 'Number information found via external API'
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'No information found for this number from external source',
                    'searched_number': normalized_number
                }), 404
        else:
            return jsonify({
                'success': False,
                'message': f'External API returned status code: {external_api_response.status_code}',
                'searched_number': normalized_number
            }), external_api_response.status_code
        
    except requests.exceptions.RequestException as req_e:
        print(f"External API request failed: {req_e}")
        return jsonify({
            'error': 'External API connection error',
            'message': 'Could not connect to external search service. Please try again later.'
        }), 500
    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred while processing your request.'
        }), 500

# Removed local database add and stats routes as per user's request to only use external API
# @search_bp.route('/add', methods=['POST'])
# def add_number():
#     pass

# @search_bp.route('/stats', methods=['GET'])
# def get_stats():
#     pass
