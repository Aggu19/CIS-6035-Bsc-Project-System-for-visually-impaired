import cv2
import pytesseract
from gtts import gTTS
import os
import time
import subprocess
import platform
import numpy as np
from ultralytics import YOLO
import threading
from typing import Optional, Tuple

# Set the Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Load YOLO model
def load_yolo_model():
    """Load YOLO v11 model"""
    try:
        model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app', 'model', 'yolo11n.pt')
        if os.path.exists(model_path):
            print(f"🤖 Loading YOLO model from: {model_path}")
            model = YOLO(model_path)
            print("✅ YOLO model loaded successfully!")
            return model
        else:
            print(f"❌ YOLO model not found at: {model_path}")
            print("Please ensure the model file exists in the correct location.")
            return None
    except Exception as e:
        print(f"❌ Error loading YOLO model: {e}")
        return None

# Global variables for object detection
yolo_model = None
detection_results = []
detection_lock = threading.Lock()

def speak_text(text):
    """Improved text-to-speech function with better Windows compatibility"""
    try:
        # Clean the text for better TTS
        clean_text = text.strip()
        if not clean_text:
            return
            
        print(f"🔊 Converting to speech: '{clean_text}'")
        
        # Generate speech file
        tts = gTTS(text=clean_text, lang='en', slow=False)
        audio_file = 'output.mp3'
        tts.save(audio_file)
        
        # Play audio using system command (more reliable than playsound)
        if platform.system() == "Windows":
            try:
                # Try using Windows Media Player
                subprocess.run(['start', 'output.mp3'], shell=True, check=True)
                time.sleep(2)  # Wait for audio to play
            except:
                try:
                    # Fallback to PowerShell
                    subprocess.run(['powershell', '-c', f'(New-Object Media.SoundPlayer "{audio_file}").PlaySync()'], check=True)
                except:
                    # Final fallback - just print the text
                    print(f"📢 Text: {clean_text}")
        else:
            # For non-Windows systems
            subprocess.run(['mpg123', audio_file], check=True)
        
        # Clean up the audio file
        try:
            os.remove(audio_file)
        except:
            pass
            
    except Exception as e:
        print(f"❌ Error in text-to-speech: {e}")
        print(f"📢 Text: {text}")

def detect_objects(frame):
    """Detect objects in frame using YOLO"""
    global yolo_model, detection_results
    
    if yolo_model is None:
        return frame
    
    try:
        # Run YOLO detection
        results = yolo_model(frame, conf=0.5, verbose=False)
        
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
                    class_name = yolo_model.names[cls]
                    
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
        
        # Update global results
        with detection_lock:
            detection_results = detected_objects
        
        return annotated_frame
        
    except Exception as e:
        print(f"❌ Error in object detection: {e}")
        return frame

def get_detection_summary():
    """Get a summary of detected objects for speech"""
    global detection_results
    
    with detection_lock:
        if not detection_results:
            return "No objects detected"
        
        # Count objects by class
        object_counts = {}
        for obj in detection_results:
            class_name = obj['class']
            object_counts[class_name] = object_counts.get(class_name, 0) + 1
        
        # Create summary
        summary_parts = []
        for class_name, count in object_counts.items():
            if count == 1:
                summary_parts.append(f"1 {class_name}")
            else:
                summary_parts.append(f"{count} {class_name}s")
        
        return f"Detected: {', '.join(summary_parts)}"

WINDOWS_BACKENDS = [
    getattr(cv2, 'CAP_DSHOW', 700),   # DirectShow (Windows)
    getattr(cv2, 'CAP_MSMF', 1400),   # Media Foundation (Windows)
    getattr(cv2, 'CAP_ANY', 0),       # Fallback
]

KNOWN_VIRTUAL_DEVICE_NAMES = [
    'EOS Webcam Utility',
    'EOS Webcam Utility Pro',
]

def _open_with_backends(camera_source) -> Optional[cv2.VideoCapture]:
    """Try opening a camera source (index or dshow name) across multiple backends."""
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
    """Test if a camera can actually capture frames (tries multiple backends)."""
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
    print("🔍 Scanning for cameras...")
    
    # Try more camera indices for better detection
    for i in range(10):  # Check first 10 camera indices
        print(f"Testing camera {i}...", end=" ")
        is_working, camera_info = test_camera(i)
        if is_working:
            camera_type = "Internal" if i == 0 else "External"
            print(f"✓ Working ({camera_type}) - {camera_info['width']}x{camera_info['height']} @ {camera_info['fps']:.1f}fps")
            available_cameras.append(camera_info)
        else:
            print("✗ Not available")
    
    # On Windows, also try to open known virtual devices by name (e.g., EOS Webcam Utility)
    if platform.system() == 'Windows':
        for name in KNOWN_VIRTUAL_DEVICE_NAMES:
            print(f"Testing virtual device '{name}'...", end=" ")
            cap = _open_with_backends(f"video={name}")
            if cap is not None:
                width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                fps = cap.get(cv2.CAP_PROP_FPS)
                cap.release()
                print(f"✓ Working (Virtual) - {width}x{height} @ {fps:.1f}fps")
                # Use a pseudo index mapping for named devices
                available_cameras.append({'index': f"name:{name}", 'width': width, 'height': height, 'fps': fps})
            else:
                print("✗ Not available")
    
    return available_cameras

def select_camera():
    """Allow user to select a camera or auto-detect"""
    available_cameras = list_available_cameras()
    
    if not available_cameras:
        print("\n❌ No working cameras found!")
        print("Please check:")
        print("  1. Camera is connected and not being used by another application")
        print("  2. Camera drivers are properly installed")
        print("  3. No other application is using the camera")
        print("  4. Try disconnecting and reconnecting your web camera")
        return None
    
    print(f"\n✅ Found {len(available_cameras)} working camera(s):")
    for i, camera in enumerate(available_cameras):
        camera_type = "Internal" if camera['index'] == 0 else "External"
        print(f"  {i+1}. Camera {camera['index']} ({camera_type}) - {camera['width']}x{camera['height']} @ {camera['fps']:.1f}fps")
    
    print("\nOptions:")
    print("  Enter camera number (1, 2, etc.) to select specific camera")
    print("  Enter 'auto' to automatically select the first available camera")
    print("  Enter 'q' to quit")
    
    while True:
        choice = input("\nYour choice: ").strip().lower()
        
        if choice == 'q':
            return None
        elif choice == 'auto':
            return available_cameras[0]['index']
        elif choice.isdigit():
            camera_num = int(choice)
            if 1 <= camera_num <= len(available_cameras):
                return available_cameras[camera_num - 1]['index']
            else:
                print(f"Invalid camera number. Please enter 1-{len(available_cameras)}")
        else:
            print("Invalid input. Please enter a number, 'auto', or 'q'")

def open_camera_safely(camera_index):
    """Safely open a camera with proper error handling (supports Windows virtual devices)."""
    print(f"📹 Opening camera {camera_index}...")
    cv2.destroyAllWindows()

    cap = None
    # Support selecting by name via our pseudo index format 'name:<device>'
    if isinstance(camera_index, str) and camera_index.startswith('name:'):
        device_name = camera_index.split(':', 1)[1]
        cap = _open_with_backends(f"video={device_name}")
    else:
        cap = _open_with_backends(camera_index)

    if cap is None or not cap.isOpened():
        print(f"❌ Error: Could not open camera {camera_index}")
        return None

    # Set camera properties for better performance (best-effort)
    try:
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        cap.set(cv2.CAP_PROP_FPS, 30)
    except Exception:
        pass

    # Test read
    ret, frame = cap.read()
    if not ret or frame is None or frame.size == 0:
        print(f"❌ Error: Camera {camera_index} opened but cannot read frames")
        cap.release()
        return None

    print(f"✅ Camera {camera_index} opened successfully!")
    return cap

def main():
    global yolo_model
    
    print("=== Enhanced Camera Vision System ===")
    print("Combining YOLO v11 Object Detection + OCR + Text-to-Speech")
    print("=" * 50)
    
    # Load YOLO model
    yolo_model = load_yolo_model()
    if yolo_model is None:
        print("⚠️  Running without object detection (OCR only)")
    
    # Try to auto-open Canon EOS virtual device first on Windows
    camera_index = None
    if platform.system() == 'Windows':
        for name in KNOWN_VIRTUAL_DEVICE_NAMES:
            print(f"🔎 Looking for '{name}'...")
            cap = _open_with_backends(f"video={name}")
            if cap is not None and cap.isOpened():
                print(f"✅ Found and selected '{name}'")
                cap.release()
                camera_index = f"name:{name}"
                break
    
    # If not found, let user select from enumerated indices
    if camera_index is None:
        camera_index = select_camera()
    
    if camera_index is None:
        print("No camera selected. Exiting...")
        return
    
    # Open camera safely
    cap = open_camera_safely(camera_index)
    if cap is None:
        return
    
    print("\n🎮 Controls:")
    print("  SPACE - Capture and read text")
    print("  O     - Detect and describe objects")
    print("  B     - Both OCR and object detection")
    print("  ESC   - Exit")
    print("  C     - Change camera")
    print("  R     - Refresh camera list")
    
    consecutive_errors = 0
    max_errors = 5
    
    while True:
        ret, frame = cap.read()
        
        # Check if frame is valid
        if not ret or frame is None or frame.size == 0:
            consecutive_errors += 1
            print(f"⚠️  Frame read error ({consecutive_errors}/{max_errors})")
            
            if consecutive_errors >= max_errors:
                print("❌ Too many consecutive errors. Camera may be disconnected or in use.")
                break
            continue
        
        consecutive_errors = 0  # Reset error counter on successful frame
        
        # Check frame dimensions
        if frame.shape[0] <= 0 or frame.shape[1] <= 0:
            print("Error: Invalid frame dimensions")
            break
        
        # Display frame
        cv2.imshow('Enhanced Vision System - SPACE:OCR, O:Objects, B:Both, ESC:Exit', frame)
        key = cv2.waitKey(1) & 0xFF
        
        if key == 27:  # ESC
            break
        elif key == 32:  # SPACE - OCR only
            try:
                print("\n📸 Processing image for text...")
                # OCR
                text = pytesseract.image_to_string(frame)
                print("📝 Detected text:", text.strip())
                if text.strip():
                    speak_text(text)
                else:
                    print("❌ No text detected.")
            except Exception as e:
                print(f"❌ Error in OCR: {e}")
        elif key == ord('o'):  # Object detection only
            if yolo_model is None:
                print("❌ YOLO model not loaded!")
                continue
            try:
                print("\n🤖 Processing image for objects...")
                # Object detection
                annotated_frame = detect_objects(frame)
                cv2.imshow('Object Detection', annotated_frame)
                
                # Get and speak detection summary
                summary = get_detection_summary()
                print(f"🎯 {summary}")
                speak_text(summary)
                
                # Keep detection window open for 3 seconds
                cv2.waitKey(3000)
                cv2.destroyWindow('Object Detection')
                
            except Exception as e:
                print(f"❌ Error in object detection: {e}")
        elif key == ord('b'):  # Both OCR and object detection
            try:
                print("\n🔍 Processing image for both text and objects...")
                
                # Object detection
                if yolo_model is not None:
                    annotated_frame = detect_objects(frame)
                    cv2.imshow('Combined Detection', annotated_frame)
                    
                    # Get detection summary
                    obj_summary = get_detection_summary()
                    print(f"🎯 {obj_summary}")
                else:
                    annotated_frame = frame
                    obj_summary = "No object detection available"
                
                # OCR
                text = pytesseract.image_to_string(frame)
                print("📝 Detected text:", text.strip())
                
                # Combine results
                combined_result = ""
                if obj_summary != "No objects detected" and obj_summary != "No object detection available":
                    combined_result += obj_summary + ". "
                if text.strip():
                    combined_result += f"Text found: {text.strip()}"
                
                if combined_result:
                    speak_text(combined_result)
                else:
                    print("❌ No text or objects detected.")
                
                # Keep window open for 3 seconds
                cv2.waitKey(3000)
                cv2.destroyWindow('Combined Detection')
                
            except Exception as e:
                print(f"❌ Error in combined processing: {e}")
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
            print("✅ Camera refreshed successfully!")
    
    if cap:
        cap.release()
    cv2.destroyAllWindows()
    print("👋 Program terminated.")

if __name__ == '__main__':
    main() 