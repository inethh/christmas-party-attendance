"""
Helper script to generate QR codes for names in the names list.
This makes it easy to create QR codes for all attendees.
"""

import qrcode
from PIL import Image
import json
import os

def generate_qr_for_name(name, output_dir='qr_codes'):
    """Generate a QR code for a given name"""
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(name)
    qr.make(fit=True)
    
    # Create image
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save with name as filename (sanitized)
    safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
    filename = os.path.join(output_dir, f"{safe_name}.png")
    img.save(filename)
    
    print(f"Generated QR code for: {name} -> {filename}")
    return filename

def generate_all_qr_codes():
    """Generate QR codes for all names in the names list"""
    # Load names list
    if os.path.exists('names_list.json'):
        with open('names_list.json', 'r', encoding='utf-8') as f:
            names_list = json.load(f)
    else:
        print("names_list.json not found. Please run the attendance system first to create it.")
        return
    
    print(f"Generating QR codes for {len(names_list)} names...")
    print("-" * 50)
    
    for name in names_list:
        generate_qr_for_name(name)
    
    print("-" * 50)
    print(f"All QR codes generated in 'qr_codes' directory!")

if __name__ == "__main__":
    generate_all_qr_codes()

