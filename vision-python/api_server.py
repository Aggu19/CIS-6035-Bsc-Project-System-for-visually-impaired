from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import pytesseract
import numpy as np
from PIL import Image
import io
import base64

# Set the Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/ocr', methods=['POST'])
def ocr_endpoint():
    try:
        # Get the image file from the request
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        # Read the image
        image_bytes = file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Preprocess the image for better OCR
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding to get black text on white background
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Apply some noise reduction
        denoised = cv2.medianBlur(thresh, 3)
        
        # Perform OCR
        text = pytesseract.image_to_string(denoised, config='--psm 6')
        
        # Get confidence score (average confidence)
        confidence_data = pytesseract.image_to_data(denoised, output_type=pytesseract.Output.DICT)
        confidences = [int(conf) for conf in confidence_data['conf'] if int(conf) > 0]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        # Clean up the text
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        return jsonify({
            'text': '\n'.join(lines),
            'confidence': avg_confidence,
            'lines': lines,
            'success': True
        })
        
    except Exception as e:
        print(f"OCR Error: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'OCR API is running'})

if __name__ == '__main__':
    print("🚀 Starting OCR API server...")
    print("📝 API will be available at: http://localhost:5000")
    print("🔍 OCR endpoint: POST http://localhost:5000/ocr")
    print("💚 Health check: GET http://localhost:5000/health")
    app.run(host='0.0.0.0', port=5000, debug=True)
