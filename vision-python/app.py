import cv2
import os
import time
import platform
from ultralytics import YOLO
import numpy as np
from typing import Optional, List, Dict
import pytesseract
import re
from datetime import datetime, timedelta

# Set the Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def load_yolo_model():
    """Load the custom YOLO model"""
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'my_model.pt')
        if os.path.exists(model_path):
            print(f"🤖 Loading custom YOLO model from: {model_path}")
            model = YOLO(model_path)
            print("✅ Custom YOLO model loaded successfully!")
            return model
        else:
            print(f"❌ Model not found at: {model_path}")
            print("Please ensure the my_model.pt file exists in the vision-python folder.")
            return None
    except Exception as e:
        print(f"❌ Error loading YOLO model: {e}")
        return None

def detect_objects(frame, model):
    """Detect objects in frame using the custom YOLO model"""
    try:
        # Run YOLO detection
        results = model(frame, conf=0.5, verbose=False)
        
        # Process results
        detected_objects = []
        annotated_frame = frame.copy()
        
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # Get box coordinates
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                    
                    # Get confidence and class
                    conf = float(box.conf[0])
                    cls = int(box.cls[0])
                    class_name = model.names[cls]
                    
                    detected_objects.append({
                        'class': class_name,
                        'confidence': conf,
                        'bbox': (x1, y1, x2, y2)
                    })
                    
                    # Draw bounding box
                    color = (0, 255, 0) if conf > 0.7 else (0, 255, 255)
                    cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 2)
                    
                    # Add label
                    label = f"{class_name} {conf:.2f}"
                    cv2.putText(annotated_frame, label, (x1, y1-10), 
                              cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        return annotated_frame, detected_objects
        
    except Exception as e:
        print(f"❌ Error in object detection: {e}")
        return frame, []

def get_detection_summary(detected_objects):
    """Get a user-friendly summary of detected objects for visually impaired users"""
    if not detected_objects:
        return "Mate, I can't see any objects in your current view. Try adjusting the camera angle or lighting, and make sure the object is clearly visible."
    
    # Count objects by class
    object_counts = {}
    for obj in detected_objects:
        class_name = obj['class']
        object_counts[class_name] = object_counts.get(class_name, 0) + 1
    
    # Create conversational summary
    if len(object_counts) == 1:
        class_name = list(object_counts.keys())[0]
        count = object_counts[class_name]
        if count == 1:
            return f"Mate, you've got a {class_name} in your hand!"
        else:
            return f"Mate, you've got {count} {class_name}s there!"
    else:
        # Multiple different objects
        summary_parts = []
        for class_name, count in object_counts.items():
            if count == 1:
                summary_parts.append(f"a {class_name}")
            else:
                summary_parts.append(f"{count} {class_name}s")
        
        if len(summary_parts) == 2:
            return f"Mate, you've got {summary_parts[0]} and {summary_parts[1]} in your view!"
        else:
            return f"Mate, you've got {', '.join(summary_parts[:-1])}, and {summary_parts[-1]} in your view!"

def get_detailed_detection_info(detected_objects):
    """Get detailed detection information in a user-friendly format"""
    if not detected_objects:
        return "No objects detected in the current view."
    
    info_lines = []
    
    if len(detected_objects) == 1:
        info_lines.append("Here's what I can tell you about it:")
    else:
        info_lines.append(f"Here's what I found - {len(detected_objects)} items in total:")
    
    for i, obj in enumerate(detected_objects, 1):
        class_name = obj['class']
        confidence = obj['confidence']
        bbox = obj['bbox']
        
        # Convert confidence to percentage
        confidence_percent = int(confidence * 100)
        
        # Determine position description
        x1, y1, x2, y2 = bbox
        center_x = (x1 + x2) // 2
        center_y = (y1 + y2) // 2
        
        # Simple position description (assuming 640x480 or similar resolution)
        if center_x < 200:
            horizontal_pos = "left side"
        elif center_x > 440:
            horizontal_pos = "right side"
        else:
            horizontal_pos = "center"
            
        if center_y < 150:
            vertical_pos = "top"
        elif center_y > 330:
            vertical_pos = "bottom"
        else:
            vertical_pos = "middle"
        
        position_desc = f"{vertical_pos} {horizontal_pos}"
        
        # Confidence description - more conversational
        if confidence_percent >= 80:
            conf_desc = "pretty sure"
        elif confidence_percent >= 60:
            conf_desc = "fairly confident"
        elif confidence_percent >= 40:
            conf_desc = "not entirely sure"
        else:
            conf_desc = "not very confident"
        
        # More natural language
        if len(detected_objects) == 1:
            info_lines.append(f"  • It looks like a {class_name} - I'm {conf_desc} about this (about {confidence_percent}% sure).")
            info_lines.append(f"  • It's positioned in the {position_desc} of your view.")
        else:
            info_lines.append(f"  • {class_name} - I'm {conf_desc} about this one (about {confidence_percent}% sure), positioned in the {position_desc}.")
    
    return "\n".join(info_lines)

# Expiration Date Scanning Functions
def preprocess_image_for_ocr(frame):
    """Preprocess image to improve OCR accuracy for date detection"""
    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    
    # Morphological operations to clean up the image
    kernel = np.ones((2, 2), np.uint8)
    cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    
    return cleaned

def extract_dates_from_text(text):
    """Extract dates from OCR text using various patterns with context"""
    date_entries = []
    
    # Common date patterns with context keywords
    patterns = [
        # DD/MM/YYYY or DD-MM-YYYY
        r'\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b',
        # MM/DD/YYYY or MM-DD-YYYY
        r'\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b',
        # YYYY/MM/DD or YYYY-MM-DD
        r'\b(\d{4})[/-](\d{1,2})[/-](\d{1,2})\b',
        # DD Month YYYY (e.g., 15 Jan 2024)
        r'\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\b',
        # Month DD, YYYY (e.g., Jan 15, 2024)
        r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})\b',
        # DD.MM.YYYY
        r'\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b',
        # YYYY.MM.DD
        r'\b(\d{4})\.(\d{1,2})\.(\d{1,2})\b',
    ]
    
    month_names = {
        'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
        'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
    }
    
    # Keywords that indicate expiration dates
    expiry_keywords = [
        'exp', 'expiry', 'expire', 'expires', 'best before', 'use by', 'use before',
        'consume by', 'sell by', 'best by', 'use by date', 'expiration', 'exp date'
    ]
    
    # Keywords that indicate manufacturing dates (usually not expiration)
    manufacture_keywords = [
        'mfg', 'manufactured', 'made', 'produced', 'packed', 'packaged', 'created'
    ]
    
    for pattern in patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            groups = match.groups()
            try:
                if len(groups) == 3:
                    if groups[1].isalpha():  # Month name format
                        month = month_names.get(groups[1].lower()[:3], 0)
                        if month:
                            day, year = int(groups[0]), int(groups[2])
                            if 1 <= day <= 31 and 2020 <= year <= 2030:
                                date_obj = datetime(year, month, day)
                                # Get context around the date
                                start = max(0, match.start() - 20)
                                end = min(len(text), match.end() + 20)
                                context = text[start:end].lower()
                                
                                # Score the date based on context
                                score = 0
                                for keyword in expiry_keywords:
                                    if keyword in context:
                                        score += 10
                                
                                for keyword in manufacture_keywords:
                                    if keyword in context:
                                        score -= 5
                                
                                date_entries.append({
                                    'date': date_obj,
                                    'context': context,
                                    'score': score,
                                    'position': match.start()
                                })
                    else:  # Numeric format
                        # Try different interpretations
                        for day, month, year in [(groups[0], groups[1], groups[2]), 
                                               (groups[2], groups[0], groups[1])]:
                            try:
                                day, month, year = int(day), int(month), int(year)
                                if 1 <= day <= 31 and 1 <= month <= 12 and 2020 <= year <= 2030:
                                    date_obj = datetime(year, month, day)
                                    # Get context around the date
                                    start = max(0, match.start() - 20)
                                    end = min(len(text), match.end() + 20)
                                    context = text[start:end].lower()
                                    
                                    # Score the date based on context
                                    score = 0
                                    for keyword in expiry_keywords:
                                        if keyword in context:
                                            score += 10
                                    
                                    for keyword in manufacture_keywords:
                                        if keyword in context:
                                            score -= 5
                                    
                                    date_entries.append({
                                        'date': date_obj,
                                        'context': context,
                                        'score': score,
                                        'position': match.start()
                                    })
                            except ValueError:
                                continue
            except (ValueError, TypeError):
                continue
    
    return date_entries

def check_expiration_status(exp_date):
    """Check if a product is safe to consume based on expiration date"""
    today = datetime.now().date()
    exp_date_only = exp_date.date()
    
    days_until_expiry = (exp_date_only - today).days
    
    if days_until_expiry < 0:
        return "expired", abs(days_until_expiry)
    elif days_until_expiry == 0:
        return "expires_today", 0
    elif days_until_expiry <= 3:
        return "expires_soon", days_until_expiry
    elif days_until_expiry <= 7:
        return "expires_this_week", days_until_expiry
    else:
        return "good", days_until_expiry

def get_expiration_feedback(status, days, exp_date):
    """Generate user-friendly feedback about expiration status"""
    exp_date_str = exp_date.strftime("%B %d, %Y")
    
    if status == "expired":
        return f"⚠️ WARNING: This product expired {days} day{'s' if days != 1 else ''} ago on {exp_date_str}. Do NOT consume this - it may be unsafe!"
    elif status == "expires_today":
        return f"⚠️ URGENT: This product expires TODAY ({exp_date_str}). You should consume it immediately or discard it."
    elif status == "expires_soon":
        return f"⚠️ CAUTION: This product expires in {days} day{'s' if days != 1 else ''} on {exp_date_str}. Consume it soon!"
    elif status == "expires_this_week":
        return f"✅ OK: This product expires in {days} days on {exp_date_str}. It's still safe to consume."
    else:  # good
        return f"✅ GOOD: This product is safe to consume! It expires on {exp_date_str} (in {days} days)."

def find_best_expiration_date(date_entries):
    """Find the most likely expiration date from multiple candidates"""
    if not date_entries:
        return None, "No dates found"
    
    today = datetime.now()
    
    # Sort by score (highest first), then by proximity to today
    date_entries.sort(key=lambda x: (-x['score'], abs((x['date'] - today).days)))
    
    # If we have high-scoring dates (with expiry keywords), use the best one
    high_score_dates = [d for d in date_entries if d['score'] > 0]
    if high_score_dates:
        best_date = high_score_dates[0]
        return best_date['date'], f"Found expiration date with context: '{best_date['context'].strip()}'"
    
    # If no high-scoring dates, use smart selection
    future_dates = [d for d in date_entries if d['date'] > today]
    past_dates = [d for d in date_entries if d['date'] <= today]
    
    if future_dates:
        # Use the closest future date
        best_date = min(future_dates, key=lambda x: (x['date'] - today).days)
        return best_date['date'], f"Selected future date: '{best_date['context'].strip()}'"
    elif past_dates:
        # Use the most recent past date
        best_date = max(past_dates, key=lambda x: (today - x['date']).days)
        return best_date['date'], f"Selected recent date: '{best_date['context'].strip()}'"
    else:
        # Fallback to first date
        best_date = date_entries[0]
        return best_date['date'], f"Using first found date: '{best_date['context'].strip()}'"

def scan_expiration_date(frame):
    """Scan for expiration dates in the image and provide feedback"""
    try:
        print("🔍 Scanning for expiration date...")
        
        # Preprocess image for better OCR
        processed_image = preprocess_image_for_ocr(frame)
        
        # Extract text using OCR
        text = pytesseract.image_to_string(processed_image, config='--psm 6')
        
        if not text.strip():
            return "❌ I couldn't find any text in the image. Make sure the expiration date is clearly visible and try again."
        
        print(f"📝 Extracted text: {text.strip()[:100]}...")
        
        # Extract dates from text with context
        date_entries = extract_dates_from_text(text)
        
        if not date_entries:
            return "❌ I couldn't find any expiration dates in the text. Look for dates in formats like DD/MM/YYYY, MM/DD/YYYY, or 'Jan 15, 2024'."
        
        print(f"🔍 Found {len(date_entries)} date(s) in the text...")
        
        # Find the best expiration date
        exp_date, selection_reason = find_best_expiration_date(date_entries)
        
        if exp_date is None:
            return "❌ Could not determine a valid expiration date from the found dates."
        
        print(f"✅ {selection_reason}")
        
        # Check expiration status
        status, days = check_expiration_status(exp_date)
        feedback = get_expiration_feedback(status, days, exp_date)
        
        # Add context information if multiple dates were found
        if len(date_entries) > 1:
            feedback += f"\n\nℹ️ Note: I found {len(date_entries)} dates and selected the most likely expiration date based on context keywords like 'exp', 'best before', etc."
        
        return feedback
        
    except Exception as e:
        return f"❌ Error scanning expiration date: {e}. Please try again with better lighting or a clearer view of the date."

# Camera detection functions
WINDOWS_BACKENDS = [
    getattr(cv2, 'CAP_DSHOW', 700),   # DirectShow (Windows)
    getattr(cv2, 'CAP_MSMF', 1400),   # Media Foundation (Windows)
    getattr(cv2, 'CAP_ANY', 0),       # Fallback
]

KNOWN_VIRTUAL_DEVICE_NAMES = [
    'EOS Webcam Utility',
    'EOS Webcam Utility Pro',
    'Canon EOS Webcam Utility',
]

def _open_with_backends(camera_source) -> Optional[cv2.VideoCapture]:
    """Try opening a camera source across multiple backends."""
    for backend in WINDOWS_BACKENDS:
        try:
            cap = cv2.VideoCapture(camera_source, backend)
            if cap.isOpened():
                # Quick sanity read
                ret, frame = cap.read()
                if ret and frame is not None and frame.size > 0:
                    return cap
                cap.release()
        except Exception:
            pass
    return None

def test_camera(camera_index):
    """Test if a camera can actually capture frames."""
    cap = _open_with_backends(camera_index)
    if cap is None:
        return False, None
    
    # Try to read a few frames to ensure it's working
    for _ in range(3):
        ret, frame = cap.read()
        if ret and frame is not None and frame.size > 0:
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            cap.release()
            return True, {'index': camera_index, 'width': width, 'height': height, 'fps': fps}
        time.sleep(0.2)
    cap.release()
    return False, None

def list_available_cameras():
    """List all available camera devices with proper testing"""
    available_cameras = []
    print("🔍 Scanning for available cameras...")
    print("Please wait while I check for connected cameras...")
    
    # Try more camera indices for better detection
    for i in range(10):  # Check first 10 camera indices
        print(f"Checking camera {i}...", end=" ")
        is_working, camera_info = test_camera(i)
        if is_working:
            camera_type = "Built-in camera" if i == 0 else f"External camera {i}"
            print(f"✓ Working ({camera_type}) - {camera_info['width']}x{camera_info['height']} @ {camera_info['fps']:.1f}fps")
            available_cameras.append(camera_info)
        else:
            print("✗ Not available")
    
    # On Windows, also try to open known virtual devices by name (e.g., EOS Webcam Utility)
    if platform.system() == 'Windows':
        for name in KNOWN_VIRTUAL_DEVICE_NAMES:
            print(f"Checking for {name}...", end=" ")
            cap = _open_with_backends(f"video={name}")
            if cap is not None:
                width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                fps = cap.get(cv2.CAP_PROP_FPS)
                cap.release()
                print(f"✓ Working (DSLR Camera) - {width}x{height} @ {fps:.1f}fps")
                # Use a pseudo index mapping for named devices
                available_cameras.append({'index': f"name:{name}", 'width': width, 'height': height, 'fps': fps, 'name': name})
            else:
                print("✗ Not available")
    
    return available_cameras

def select_camera():
    """Allow user to select a camera with user-friendly interface"""
    available_cameras = list_available_cameras()
    
    if not available_cameras:
        print("\n❌ No working cameras found!")
        print("Please check:")
        print("  1. Camera is connected and not being used by another application")
        print("  2. Camera drivers are properly installed")
        print("  3. No other application is using the camera")
        print("  4. Try disconnecting and reconnecting your camera")
        return None
    
    print(f"\n✅ I found {len(available_cameras)} working camera(s):")
    for i, camera in enumerate(available_cameras):
        if 'name' in camera:
            print(f"  {i+1}. {camera['name']} (DSLR Camera) - {camera['width']}x{camera['height']} @ {camera['fps']:.1f}fps")
        else:
            camera_type = "Built-in camera" if camera['index'] == 0 else f"External camera {camera['index']}"
            print(f"  {i+1}. {camera_type} - {camera['width']}x{camera['height']} @ {camera['fps']:.1f}fps")
    
    print("\nPlease select a camera:")
    print("  Enter camera number (1, 2, etc.) to select specific camera")
    print("  Enter 'auto' to automatically select the first available camera")
    print("  Enter 'q' to quit")
    
    while True:
        choice = input("\nYour choice: ").strip().lower()
        
        if choice == 'q':
            return None
        elif choice == 'auto':
            selected_camera = available_cameras[0]
            if 'name' in selected_camera:
                print(f"✅ Selected: {selected_camera['name']} (DSLR Camera)")
            else:
                camera_type = "Built-in camera" if selected_camera['index'] == 0 else f"External camera {selected_camera['index']}"
                print(f"✅ Selected: {camera_type}")
            return selected_camera['index']
        elif choice.isdigit():
            camera_num = int(choice)
            if 1 <= camera_num <= len(available_cameras):
                selected_camera = available_cameras[camera_num - 1]
                if 'name' in selected_camera:
                    print(f"✅ Selected: {selected_camera['name']} (DSLR Camera)")
                else:
                    camera_type = "Built-in camera" if selected_camera['index'] == 0 else f"External camera {selected_camera['index']}"
                    print(f"✅ Selected: {camera_type}")
                return selected_camera['index']
            else:
                print(f"Invalid camera number. Please enter 1-{len(available_cameras)}")
        else:
            print("Invalid input. Please enter a number, 'auto', or 'q'")

def open_camera_safely(camera_index):
    """Safely open a camera with proper error handling."""
    print(f"📹 Opening selected camera...")
    cv2.destroyAllWindows()

    cap = None
    # Support selecting by name via our pseudo index format 'name:<device>'
    if isinstance(camera_index, str) and camera_index.startswith('name:'):
        device_name = camera_index.split(':', 1)[1]
        cap = _open_with_backends(f"video={device_name}")
    else:
        cap = _open_with_backends(camera_index)

    if cap is None or not cap.isOpened():
        print(f"❌ Error: Could not open the selected camera")
        return None

    # Set camera properties for better performance
    try:
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        cap.set(cv2.CAP_PROP_FPS, 30)
    except Exception:
        pass

    # Test read
    ret, frame = cap.read()
    if not ret or frame is None or frame.size == 0:
        print(f"❌ Error: Camera opened but cannot read frames")
        cap.release()
        return None

    print(f"✅ Camera opened successfully! Ready to detect objects.")
    return cap

def main():
    print("=== Object Detection System for Visually Impaired Users ===")
    print("Using custom YOLO model for object detection")
    print("=" * 60)
    
    # Load custom YOLO model
    print("Loading object detection model...")
    model = load_yolo_model()
    if model is None:
        print("❌ Failed to load the detection model. Please check if my_model.pt exists.")
        return
    
    # Scan and select camera
    print("\nSetting up camera...")
    camera_index = select_camera()
    if camera_index is None:
        print("No camera selected. Exiting...")
        return
    
    # Open selected camera
    cap = open_camera_safely(camera_index)
    if cap is None:
        return
    
    print("\n" + "="*60)
    print("🎮 SYSTEM READY - Controls:")
    print("  SPACE - Capture and identify objects")
    print("  E     - Scan expiration date")
    print("  C     - Change camera")
    print("  R     - Refresh camera list")
    print("  ESC   - Exit system")
    print("="*60)
    print("Press SPACE to detect objects or E to scan expiration dates...")
    
    consecutive_errors = 0
    max_errors = 5
    
    while True:
        ret, frame = cap.read()
        
        # Check if frame is valid
        if not ret or frame is None or frame.size == 0:
            consecutive_errors += 1
            print(f"⚠️  Camera error ({consecutive_errors}/{max_errors}) - trying to reconnect...")
            
            if consecutive_errors >= max_errors:
                print("❌ Too many camera errors. Please check your camera connection.")
                break
            continue
        
        consecutive_errors = 0  # Reset error counter on successful frame
        
        # Display frame
        cv2.imshow('Object Detection System - SPACE:Detect, E:Expiry, C:Change Camera, ESC:Exit', frame)
        key = cv2.waitKey(1) & 0xFF
        
        if key == 27:  # ESC
            break
        elif key == 32:  # SPACE - Detect objects
            try:
                print("\n" + "="*50)
                print("📸 Analyzing the current view...")
                print("Please wait while I process the image...")
                
                # Detect objects
                annotated_frame, detected_objects = detect_objects(frame, model)
                
                # Show results window
                cv2.imshow('Detection Results', annotated_frame)
                
                # Print user-friendly detection summary
                summary = get_detection_summary(detected_objects)
                print(f"\n🎯 {summary}")
                
                # Print detailed information
                detailed_info = get_detailed_detection_info(detected_objects)
                print(f"\n📋 {detailed_info}")
                
                print("\n" + "="*50)
                print("Press SPACE again to detect objects in a new view, or ESC to exit.")
                
                # Keep detection window open for 5 seconds
                cv2.waitKey(5000)
                cv2.destroyWindow('Detection Results')
                
            except Exception as e:
                print(f"❌ Error during object detection: {e}")
                print("Please try again or check your camera connection.")
        
        elif key == ord('e'):  # Scan expiration date
            try:
                print("\n" + "="*50)
                print("📸 Scanning for expiration date...")
                print("Please position the expiration date clearly in view...")
                
                # Scan for expiration date
                feedback = scan_expiration_date(frame)
                
                print(f"\n🍽️ {feedback}")
                
                print("\n" + "="*50)
                print("Press E again to scan another product, or SPACE to detect objects.")
                
                # Keep window open for 5 seconds
                cv2.waitKey(5000)
                
            except Exception as e:
                print(f"❌ Error during expiration date scanning: {e}")
                print("Please try again with better lighting or a clearer view of the date.")
        
        elif key == ord('c'):  # Change camera
            print("\n🔄 Changing camera...")
            cap.release()
            cv2.destroyAllWindows()
            
            camera_index = select_camera()
            if camera_index is None:
                print("No camera selected. Exiting...")
                return
            
            cap = open_camera_safely(camera_index)
            if cap is None:
                return
            print("✅ Camera changed successfully!")
            print("Press SPACE to start detecting objects...")
        
        elif key == ord('r'):  # Refresh camera list
            print("\n🔄 Refreshing camera list...")
            cap.release()
            cv2.destroyAllWindows()
            
            camera_index = select_camera()
            if camera_index is None:
                print("No camera selected. Exiting...")
                return
            
            cap = open_camera_safely(camera_index)
            if cap is None:
                return
            print("✅ Camera list refreshed successfully!")
            print("Press SPACE to start detecting objects...")
    
    # Cleanup
    if cap:
        cap.release()
    cv2.destroyAllWindows()
    print("\n👋 Object detection system terminated. Thank you for using the system!")

if __name__ == '__main__':
    main()
