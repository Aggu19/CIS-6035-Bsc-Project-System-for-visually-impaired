# Enhanced Camera Vision System

A comprehensive computer vision application that combines **YOLO v11 Object Detection**, **OCR (Optical Character Recognition)**, and **Text-to-Speech** capabilities.

## 🚀 Features

### 🤖 **YOLO v11 Object Detection**
- Real-time object detection using YOLO v11n model
- Detects 80+ common objects (people, cars, animals, etc.)
- Visual bounding boxes with confidence scores
- Audio description of detected objects

### 📝 **OCR (Optical Character Recognition)**
- Extract text from camera feed
- Supports multiple languages
- Real-time text recognition
- Audio reading of detected text

### 🔊 **Text-to-Speech**
- Converts detected text to speech
- Windows-compatible audio playback
- Graceful fallback if audio fails

### 📹 **Multi-Camera Support**
- Automatic camera detection
- Support for internal and external cameras
- Easy camera switching
- Robust error handling

## 🛠️ Installation

### Prerequisites
1. **Python 3.8+**
2. **Tesseract OCR** - Download from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki)
3. **YOLO v11 Model** - Place `yolo11n.pt` in `app/model/` folder

### Setup Steps

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Tesseract OCR:**
   - Download and install from: https://github.com/UB-Mannheim/tesseract/wiki
   - Default installation path: `C:\Program Files\Tesseract-OCR\`

3. **Verify YOLO model:**
   - Ensure `yolo11n.pt` is in `app/model/` directory
   - The script will automatically detect and load the model

## 🎮 Usage

### Running the Application
```bash
python camera_ocr_tts.py
```

### Controls
- **SPACE** - Capture and read text (OCR only)
- **O** - Detect and describe objects (YOLO only)
- **B** - Both OCR and object detection (Combined)
- **C** - Change camera
- **R** - Refresh camera list
- **ESC** - Exit

### Demo Scenarios

#### 1. **Text Recognition Demo**
- Point camera at text (books, signs, documents)
- Press **SPACE**
- System will read the text aloud

#### 2. **Object Detection Demo**
- Point camera at objects (people, cars, animals)
- Press **O**
- System will describe what it sees

#### 3. **Combined Demo**
- Point camera at scene with both text and objects
- Press **B**
- System will describe both objects and read any text

## 🔧 Technical Details

### Model Information
- **YOLO v11n**: Lightweight model for real-time detection
- **Tesseract**: Open-source OCR engine
- **gTTS**: Google Text-to-Speech for audio output

### Performance Optimizations
- Confidence threshold: 0.5 for object detection
- Frame resolution: 1280x720
- Frame rate: 30 FPS
- Thread-safe detection results

### Error Handling
- Graceful camera switching
- Audio fallback mechanisms
- Robust model loading
- Comprehensive error messages

## 🎯 Use Cases

### Accessibility
- **Visual impairment assistance**: Describe surroundings
- **Reading assistance**: Read text from documents
- **Navigation aid**: Identify objects and signs

### Education
- **Language learning**: Read text in different languages
- **Object recognition**: Learn object names
- **Interactive learning**: Combine visual and audio feedback

### Productivity
- **Document scanning**: Quick text extraction
- **Inventory management**: Object counting and identification
- **Quality control**: Visual inspection with text verification

## 🚨 Troubleshooting

### Common Issues

1. **Camera not detected:**
   - Close other applications using the camera
   - Disconnect and reconnect web camera
   - Check camera drivers

2. **YOLO model not loading:**
   - Verify `yolo11n.pt` is in correct location
   - Check file permissions
   - Ensure sufficient disk space

3. **Audio not working:**
   - Check system audio settings
   - Verify audio drivers
   - Try different audio output devices

4. **OCR not working:**
   - Verify Tesseract installation
   - Check Tesseract path in script
   - Ensure text is clearly visible

### Performance Tips
- Use good lighting for better detection
- Keep camera steady for OCR
- Close unnecessary applications
- Use SSD for faster model loading

## 🔮 Future Enhancements

### Planned Features
- **Custom model training**: Train on specific objects
- **Multi-language support**: OCR in multiple languages
- **Gesture recognition**: Hand gesture controls
- **Cloud integration**: Upload results to cloud
- **Mobile app**: Android/iOS companion app

### Potential Improvements
- **Real-time processing**: Continuous detection mode
- **Advanced filtering**: Object and text filtering options
- **Export capabilities**: Save results to files
- **API integration**: Connect to external services

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

**Happy Vision Computing! 🎉** 