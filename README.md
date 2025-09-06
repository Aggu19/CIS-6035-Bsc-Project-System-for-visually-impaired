# Smart Glasses for the Visually Impaired

A comprehensive assistive technology system designed to help visually impaired individuals read product information through advanced OCR (Optical Character Recognition) and text-to-speech technology.

## 🎯 Project Overview

This project combines cutting-edge computer vision, machine learning, and accessibility technologies to create smart glasses that can read product labels, expiration dates, and other text-based information aloud to users.

## ✨ Key Features

- **Real-time OCR Processing** - Advanced text recognition using Tesseract OCR engine
- **Voice Output** - Clear, natural text-to-speech synthesis
- **Camera Integration** - Live camera feed with intelligent text detection
- **Accessibility First** - Designed specifically for visually impaired users
- **Cross-platform Support** - Web-based interface with Python backend

## 🏗️ System Architecture

### Frontend (React + TypeScript)
- **Modern React Application** - Built with Vite for fast development
- **Material-UI Components** - Professional, accessible user interface
- **Real-time Camera Feed** - Live video processing and display
- **Environment Configuration** - Secure API key management

### Backend (Python)
- **OCR Processing** - Tesseract-based text recognition
- **API Server** - RESTful endpoints for image processing
- **Camera Integration** - Direct camera access and processing
- **Text-to-Speech** - Audio output generation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- Modern web browser with camera support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aggu19/CIS-6035-Bsc-Project-System-for-visually-impaired.git
   cd CIS-6035-Bsc-Project-System-for-visually-impaired
   ```

2. **Frontend Setup**
   ```bash
   cd app
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd vision-python
   pip install -r requirements.txt
   python api_server.py
   ```

4. **Environment Configuration**
   - Create `.env` file in the `app` directory
   - Add your EmailJS credentials for contact form functionality

## 📱 Usage

1. **Start the Application**
   - Launch the React frontend at `http://localhost:5173`
   - Start the Python backend at `http://localhost:5000`

2. **Camera Setup**
   - Allow camera permissions when prompted
   - Select your preferred camera device
   - Ensure good lighting for optimal text recognition

3. **Text Recognition**
   - Point the camera at text you want to read
   - Click "Start OCR" to begin text recognition
   - Listen to the audio output of recognized text

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Material-UI** - Component library
- **Vite** - Build tool and dev server
- **EmailJS** - Contact form functionality

### Backend
- **Python 3.8+** - Core processing language
- **Tesseract OCR** - Text recognition engine
- **OpenCV** - Computer vision processing
- **Flask** - Web API framework
- **Text-to-Speech** - Audio generation

### Machine Learning
- **YOLO v11** - Object detection
- **Custom Training** - Fine-tuned models for product recognition
- **Real-time Processing** - Live inference capabilities

## 📁 Project Structure

```
CIS-6035-Bsc-Project-System-for-visually-impaired/
├── app/                          # React frontend
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── assets/              # Static assets
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── vision-python/               # Python backend
│   ├── api_server.py           # Main API server
│   ├── camera_ocr_tts.py       # OCR processing
│   ├── requirements.txt        # Python dependencies
│   └── ...
├── model/                      # ML models
│   ├── yolo11n.pt             # YOLO model
│   └── finetuned/             # Custom trained models
└── README.md
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `app` directory:

```env
# EmailJS Configuration (for contact form)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Optional: Access code for protected pages
VITE_ACCESS_CODE=your_access_code

# Backend API URL
VITE_API_BASE_URL=http://localhost:5000
```

## 🎯 Features in Detail

### OCR Processing
- **Multi-language Support** - Recognizes text in multiple languages
- **High Accuracy** - Advanced preprocessing for better recognition
- **Real-time Processing** - Live text detection and conversion

### Accessibility Features
- **Voice Output** - Clear audio feedback
- **Large Text Display** - High contrast, readable interface
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - ARIA labels and semantic HTML

### Camera Integration
- **Device Selection** - Choose from available cameras
- **Quality Optimization** - Automatic resolution adjustment
- **Permission Handling** - Secure camera access management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [Your Name]
- **Supervisor**: [Supervisor Name]
- **Institution**: [Your University/Institution]

## 📞 Support

For support and questions:
- Email: [your-email@example.com]
- GitHub Issues: [Create an issue](https://github.com/Aggu19/CIS-6035-Bsc-Project-System-for-visually-impaired/issues)

## 🙏 Acknowledgments

- Tesseract OCR team for the powerful text recognition engine
- Material-UI team for the excellent component library
- OpenCV community for computer vision tools
- All contributors and testers who helped improve this project

---

**Note**: This project is part of a BSc Final Project focused on assistive technology for visually impaired individuals. The system aims to improve independence and accessibility in daily life.
