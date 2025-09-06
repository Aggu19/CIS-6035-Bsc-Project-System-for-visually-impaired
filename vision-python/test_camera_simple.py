import cv2
import platform

def test_camera_simple():
    print(f"Python version: {platform.python_version()}")
    print(f"OpenCV version: {cv2.__version__}")
    print(f"Platform: {platform.system()}")
    
    print("\n=== Testing camera access ===")
    
    # Try different backends
    backends = [
        (cv2.CAP_ANY, "Default"),
        (cv2.CAP_DSHOW, "DirectShow"),
        (cv2.CAP_MSMF, "Media Foundation"),
    ]
    
    for backend_id, backend_name in backends:
        print(f"\nTrying {backend_name} backend...")
        
        # Try index 0
        cap = cv2.VideoCapture(0, backend_id)
        if cap.isOpened():
            ret, frame = cap.read()
            if ret and frame is not None:
                print(f"✓ {backend_name}: Camera 0 works! Frame size: {frame.shape}")
                cap.release()
                return True
            else:
                print(f"✗ {backend_name}: Camera 0 opened but no frame")
            cap.release()
        else:
            print(f"✗ {backend_name}: Camera 0 failed to open")
    
    print("\n=== Trying to enumerate devices ===")
    
    # Try to get device count (this might not work on all systems)
    try:
        # This is a hack - try to open many indices to see what's available
        for i in range(5):
            cap = cv2.VideoCapture(i)
            if cap.isOpened():
                ret, frame = cap.read()
                if ret and frame is not None:
                    print(f"✓ Found working camera at index {i}")
                    cap.release()
                    return True
                cap.release()
    except Exception as e:
        print(f"Error during enumeration: {e}")
    
    print("\n❌ No cameras found!")
    print("\nTroubleshooting steps:")
    print("1. Ensure EOS Webcam Utility is installed")
    print("2. Connect camera via USB (not Wi-Fi)")
    print("3. Set camera to Movie mode")
    print("4. Close all other apps using camera")
    print("5. Check Device Manager for camera devices")
    print("6. Try Windows Camera app first")
    
    return False

if __name__ == "__main__":
    test_camera_simple()

