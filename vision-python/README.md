# Object Detection System for Visually Impaired Users

A comprehensive computer vision system designed to assist visually impaired users by identifying objects and checking product expiration dates using camera input and AI models.

## 🌟 Features

### 1. **Object Detection**
- Uses custom YOLO model (`my_model.pt`) for object identification
- User-friendly, conversational feedback
- Real-time camera processing
- Multiple camera support (built-in, external, DSLR)

### 2. **Expiration Date Scanner**
- OCR-based date detection (no model required)
- Smart date selection from multiple dates
- Context-aware keyword recognition
- Safety assessment for food consumption

### 3. **Camera Management**
- Automatic camera detection and selection
- Support for DSLR cameras via virtual devices
- Easy camera switching during runtime
- Camera refresh functionality

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- OpenCV
- Ultralytics YOLO
- Tesseract OCR
- Required Python packages (see requirements.txt)

### Installation

1. **Install Tesseract OCR:**
   - Download from: https://github.com/UB-Mannheim/tesseract/wiki
   - Install to default location: `C:\Program Files\Tesseract-OCR\`

2. **Install Python dependencies:**
   ```bash
   pip install opencv-python ultralytics pytesseract gtts
   ```

3. **Place your custom model:**
   - Ensure `my_model.pt` is in the `vision-python` folder

### Running the Application

```bash
cd vision-python
python app.py
```

## 🎮 Controls

| Key | Function |
|-----|----------|
| **SPACE** | Detect and identify objects |
| **E** | Scan expiration date |
| **C** | Change camera |
| **R** | Refresh camera list |
| **ESC** | Exit system |

## 📱 Usage Examples

### Object Detection
```
Press SPACE while holding an object in front of the camera:

Output: "Mate, you've got a Kottu Me in your hand!"
```

### Expiration Date Scanning
```
Press E while showing the expiration date:

Output: "✅ GOOD: This product is safe to consume! It expires on March 20, 2024 (in 45 days)."
```

## 🧠 Smart Features

### Object Detection
- **Conversational feedback**: Natural language responses
- **Confidence levels**: "I'm pretty sure about this detection"
- **Position descriptions**: "It's positioned in the center of your view"
- **Multiple objects**: Handles multiple items in one view

### Expiration Date Scanner
- **Context-aware selection**: Recognizes keywords like "EXP", "Best Before", "Use By"
- **Multiple date handling**: Smart selection from multiple dates
- **Safety warnings**: Clear guidance on consumption safety
- **Date format support**: DD/MM/YYYY, MM/DD/YYYY, Month DD YYYY, etc.

## 🔍 Supported Date Formats

The expiration scanner recognizes these date formats:
- `DD/MM/YYYY` (e.g., 20/03/2024)
- `MM/DD/YYYY` (e.g., 03/20/2024)
- `YYYY/MM/DD` (e.g., 2024/03/20)
- `DD-MM-YYYY` (e.g., 20-03-2024)
- `DD.MM.YYYY` (e.g., 20.03.2024)
- `Month DD, YYYY` (e.g., Mar 20, 2024)
- `DD Month YYYY` (e.g., 20 Mar 2024)

## 🎯 Expiration Status Messages

### Safe to Consume
- ✅ **GOOD**: Product is safe, expires in more than 7 days
- ✅ **OK**: Product is safe, expires within 7 days

### Caution Required
- ⚠️ **CAUTION**: Product expires within 3 days
- ⚠️ **URGENT**: Product expires today

### Unsafe
- ⚠️ **WARNING**: Product has expired

## 📁 File Structure

```
vision-python/
├── app.py                 # Main application
├── my_model.pt           # Custom YOLO model
├── README.md             # This file
└── requirements.txt      # Python dependencies
```

## 🔧 Technical Details

### Object Detection
- **Model**: Custom YOLO model (`my_model.pt`)
- **Confidence threshold**: 0.5
- **Input resolution**: 1280x720 (optimized)
- **Processing**: Real-time frame analysis

### Expiration Date Scanner
- **OCR Engine**: Tesseract
- **Preprocessing**: Grayscale conversion, noise reduction, adaptive thresholding
- **Context analysis**: 20-character window around each date
- **Keyword scoring**: +10 for expiry keywords, -5 for manufacturing keywords

### Camera Support
- **Backends**: DirectShow, Media Foundation, Fallback
- **Virtual devices**: Canon EOS Webcam Utility, EOS Webcam Utility Pro
- **Auto-detection**: Scans first 10 camera indices
- **Error handling**: Automatic reconnection attempts

## 🛠️ Troubleshooting

### Common Issues

1. **"No working cameras found"**
   - Check camera connection
   - Ensure no other applications are using the camera
   - Try disconnecting and reconnecting the camera

2. **"Failed to load the detection model"**
   - Verify `my_model.pt` exists in the vision-python folder
   - Check file permissions

3. **"Could not find any expiration dates"**
   - Ensure good lighting
   - Position the date clearly in the camera view
   - Try different angles or distances

4. **Poor OCR accuracy**
   - Improve lighting conditions
   - Hold the product steady
   - Ensure text is clearly visible and not blurry

### Camera Issues
- **DSLR not detected**: Install Canon EOS Webcam Utility
- **Camera switching problems**: Use 'R' to refresh camera list
- **Poor video quality**: Check camera settings and lighting

## 🔮 Future Enhancements

- [ ] Text-to-speech integration
- [ ] Voice commands
- [ ] Haptic feedback
- [ ] Distance estimation
- [ ] Object relationship descriptions
- [ ] Batch processing mode
- [ ] Custom confidence thresholds
- [ ] Multi-language support

## 📝 Development Notes

### Adding New Object Classes
1. Retrain the YOLO model with new classes
2. Replace `my_model.pt` with the updated model
3. Update class names in the detection output

### Improving OCR Accuracy
1. Adjust preprocessing parameters in `preprocess_image_for_ocr()`
2. Modify Tesseract configuration in `pytesseract.image_to_string()`
3. Add more date format patterns in `extract_dates_from_text()`

### Adding New Keywords
1. Update `expiry_keywords` list for expiration date detection
2. Update `manufacture_keywords` list for manufacturing date detection
3. Adjust scoring weights as needed

## 🤝 Contributing

This system is designed for accessibility and user-friendliness. When contributing:
- Maintain conversational, user-friendly language
- Test with actual visually impaired users when possible
- Prioritize clear error messages and guidance
- Ensure all feedback is helpful and actionable

## 📄 License

This project is part of a BSc Final Project for visually impaired users.

---

**Note**: This system is designed to assist visually impaired users but should not be the sole method for determining food safety. Always follow proper food safety guidelines and consult with healthcare professionals when in doubt about product safety.