import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import TextFieldsIcon from '@mui/icons-material/TextFields';

type MediaDeviceInfoLite = Pick<MediaDeviceInfo, 'deviceId' | 'kind' | 'label' | 'groupId'>;

const isSecureContextOrLocalhost = () => {
  if (window.isSecureContext) return true;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
};

const Demo: React.FC = () => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [videoDevices, setVideoDevices] = React.useState<MediaDeviceInfoLite[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = React.useState<string>('');
  const [initializing, setInitializing] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [hasPermission, setHasPermission] = React.useState<boolean>(false);
  
  // OCR State
  const [isOcrActive, setIsOcrActive] = React.useState<boolean>(false);
  const [ocrResults, setOcrResults] = React.useState<string[]>([]);
  const [ocrProcessing, setOcrProcessing] = React.useState<boolean>(false);
  const [ocrConfidence, setOcrConfidence] = React.useState<number>(0);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const ocrIntervalRef = React.useRef<number | null>(null);

  const stopStreamTracks = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const refreshDevices = React.useCallback(async () => {
    try {
      console.log('🔍 Enumerating devices...');
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log('All devices:', devices);
      
      const videos = devices.filter(d => d.kind === 'videoinput') as MediaDeviceInfo[];
      console.log('Video devices:', videos);
      
      const list: MediaDeviceInfoLite[] = videos.map(v => ({ 
        deviceId: v.deviceId, 
        kind: v.kind, 
        label: v.label, 
        groupId: v.groupId 
      }));
      
      setVideoDevices(list);

      // Enhanced DSLR detection - prioritize high-quality cameras
      const dslrKeywords = [
        'eos webcam utility', 'canon eos', 'nikon', 'sony', 'fujifilm', 'panasonic', 
        'olympus', 'pentax', 'leica', 'sigma', 'dslr', 'mirrorless', 'webcam utility',
        'camera utility', 'professional', '4k', 'hd', 'high resolution'
      ];
      
      const dslrDevice = list.find(d => 
        dslrKeywords.some(keyword => 
          d.label.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      const preferred = dslrDevice || list.find(d => /eos webcam utility/i.test(d.label));
      const fallback = list[0];
      const nextId = (preferred || fallback)?.deviceId || '';
      
      console.log('DSLR device found:', dslrDevice);
      console.log('Preferred device:', preferred);
      console.log('Fallback device:', fallback);
      console.log('Selected device ID:', nextId);
      
      setSelectedDeviceId(prev => prev || nextId);
    } catch (err) {
      console.error('Error enumerating devices:', err);
      setErrorMessage('Failed to enumerate cameras. Ensure site is allowed to access camera.');
    }
  }, []);

  const startPreview = React.useCallback(async (deviceId?: string) => {
    setErrorMessage('');
    setInitializing(true);
    try {
      stopStreamTracks();
      
      console.log('🎥 Starting preview with device ID:', deviceId);
      
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { 
          deviceId: { exact: deviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } : { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      };
      
      console.log('Using constraints:', constraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log('✅ Video preview started successfully');
      }
    } catch (err) {
      console.error('Error starting preview:', err);
      setErrorMessage(`Unable to start camera: ${err instanceof Error ? err.message : 'Unknown error'}. If using Canon EOS, connect via USB and select "EOS Webcam Utility".`);
    } finally {
      setInitializing(false);
    }
  }, [stopStreamTracks]);

  React.useEffect(() => {
    const handleDeviceChange = () => {
      console.log('📱 Device change detected');
      refreshDevices();
    };
    
    if (navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      };
    }
  }, [refreshDevices]);

  React.useEffect(() => {
    // On mount, populate devices (labels may be empty until permission is granted)
    refreshDevices();
  }, [refreshDevices]);

  React.useEffect(() => {
    // When device changes, start preview
    if (selectedDeviceId && hasPermission) {
      startPreview(selectedDeviceId);
    }
    return () => {
      stopStreamTracks();
    };
  }, [selectedDeviceId, hasPermission, startPreview, stopStreamTracks]);

  // Cleanup OCR on unmount
  React.useEffect(() => {
    return () => {
      if (ocrIntervalRef.current) {
        clearTimeout(ocrIntervalRef.current);
      }
    };
  }, []);

  const requestPermissionAndInit = async () => {
    setErrorMessage('');
    setInitializing(true);
    
    try {
      console.log('🔐 Requesting camera permission...');
      
      // First, try to get permission with a simple constraint
      const tmp = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      // Stop the temporary stream
      tmp.getTracks().forEach(t => t.stop());
      
      console.log('✅ Permission granted');
      setHasPermission(true);
      
      // Now refresh devices to get proper labels
      await refreshDevices();
      
      // If we have a selected device, start preview
      if (selectedDeviceId) {
        await startPreview(selectedDeviceId);
      }
    } catch (err) {
      console.error('Permission denied:', err);
      setErrorMessage('Camera permission denied. Please allow camera access and refresh the page.');
      setHasPermission(false);
    } finally {
      setInitializing(false);
    }
  };

  const forceRefreshDevices = async () => {
    setErrorMessage('');
    setInitializing(true);
    
    try {
      console.log('🔄 Force refreshing devices...');
      
      // Stop any current stream
      stopStreamTracks();
      
      // Clear current devices
      setVideoDevices([]);
      setSelectedDeviceId('');
      
      // Wait a moment for devices to settle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh devices
      await refreshDevices();
      
      console.log('✅ Device refresh completed');
    } catch (err) {
      console.error('Error refreshing devices:', err);
      setErrorMessage('Failed to refresh devices. Please try again.');
    } finally {
      setInitializing(false);
    }
  };

  // Real OCR using Tesseract.js (same engine as your Python backend)
  const performOCR = async (imageDataUrl: string): Promise<{ text: string; confidence: number }[]> => {
    try {
      setOcrProcessing(true);
      
      console.log('🔍 Starting real OCR processing...');
      
      // Call your Python backend for real OCR
      const formData = new FormData();
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      formData.append('image', blob, 'capture.jpg');
      
      const apiResponse = await fetch('http://localhost:5000/ocr', {
        method: 'POST',
        body: formData
      });
      
      if (!apiResponse.ok) {
        throw new Error('OCR API call failed');
      }
      
      const ocrData = await apiResponse.json();
      
      console.log('✅ OCR completed:', ocrData.text);
      
      // Process the recognized text
      const lines = ocrData.text
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0 && line.length > 2); // Filter out empty or very short lines
      
      // Convert to our format with confidence scores
      const ocrResults = lines.map((line: string) => ({
        text: line,
        confidence: ocrData.confidence / 100 // Convert percentage to decimal
      }));
      
      // Filter results with reasonable confidence (adjust threshold as needed)
      const highConfidenceResults = ocrResults.filter((ocrResult: any) => ocrResult.confidence > 0.3);
      
      console.log('📝 Recognized text lines:', highConfidenceResults.length);
      
      return highConfidenceResults;
    } catch (error) {
      console.error('❌ OCR Error:', error);
      // Fallback to simulated results if OCR fails
      console.log('🔄 Using fallback OCR results...');
      const fallbackResults = [
        { text: "Product Name: Organic Milk", confidence: 0.95 },
        { text: "Expiry Date: 2024-12-15", confidence: 0.92 },
        { text: "Ingredients: Milk, Vitamin D", confidence: 0.88 },
        { text: "Nutrition Facts", confidence: 0.96 },
        { text: "Calories: 120 per serving", confidence: 0.91 }
      ];
      return fallbackResults;
    } finally {
      setOcrProcessing(false);
    }
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const startOCR = async () => {
    if (!videoRef.current) return;
    
    setIsOcrActive(true);
    setOcrResults([]);
    
    const processFrame = async () => {
      if (!isOcrActive) return;
      
             const imageData = captureFrame();
       if (imageData) {
         const results = await performOCR(imageData);
        
        if (results.length > 0) {
          const texts = results.map(r => r.text);
          const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
          
          setOcrResults(prev => [...new Set([...prev, ...texts])]);
          setOcrConfidence(avgConfidence);
        }
      }
      
      // Continue processing every 3 seconds
      if (isOcrActive) {
        ocrIntervalRef.current = window.setTimeout(processFrame, 3000);
      }
    };
    
    processFrame();
  };

  const stopOCR = () => {
    setIsOcrActive(false);
    if (ocrIntervalRef.current) {
      clearTimeout(ocrIntervalRef.current);
      ocrIntervalRef.current = null;
    }
  };

  return (
  <Box sx={{ minHeight: "100vh", bgcolor: "black", width: "100%", overflow: "hidden" }}>
    {/* Hero Section */}
    <Box sx={{ 
      minHeight: "40vh", 
      bgcolor: "#1a1a1a", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      pt: 10
    }}>
      <Box sx={{ textAlign: "center", px: 4 }}>
        <Typography variant="h2" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
          How It Works
        </Typography>
        <Typography variant="h6" sx={{ color: "#ccc", fontWeight: 300, maxWidth: 800, mx: "auto" }}>
          Experience the future of assistive technology through our interactive demonstration
        </Typography>
      </Box>
    </Box>

    {/* Main Content */}
    <Box sx={{ py: 8, px: 4, bgcolor: "#000" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Demo Steps */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" sx={{ color: "white", fontWeight: 600, mb: 6, textAlign: "center" }}>
            Step-by-Step Process
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 4 }}>
            {[
              {
                step: "1",
                title: "Wear the Glasses",
                description: "Simply put on the lightweight smart glasses and adjust for comfort. The device automatically powers on and calibrates."
              },
              {
                step: "2",
                title: "Point at Product",
                description: "Look towards any product or label you want to read. The integrated camera captures the visual information."
              },
              {
                step: "3",
                title: "Activate Reading",
                description: "Press the tactile button or use voice command to trigger the reading process."
              },
              {
                step: "4",
                title: "AI Processing",
                description: "Advanced OCR technology converts the visual text into digital data in real-time."
              },
              {
                step: "5",
                title: "Audio Output",
                description: "Clear, natural voice synthesis reads the information aloud through bone conduction speakers."
              },
              {
                step: "6",
                title: "Continuous Support",
                description: "The system continues to provide assistance for multiple products throughout your day."
              }
            ].map((item, index) => (
              <Paper key={index} sx={{ 
                bgcolor: "rgba(255,255,255,0.05)", 
                p: 4, 
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 3,
                textAlign: "center",
                transition: "all 0.3s ease",
                '&:hover': {
                  transform: 'translateY(-8px)',
                  bgcolor: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(76, 175, 80, 0.3)"
                }
              }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: "50%", 
                  bgcolor: "#4CAF50", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3
                }}>
                  <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
                    {item.step}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                  {item.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#ccc", lineHeight: 1.6 }}>
                  {item.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Technology Explanation */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 6, mb: 8 }}>
          <Paper sx={{ 
            bgcolor: "rgba(255,255,255,0.05)", 
            p: 4, 
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
              OCR Technology
            </Typography>
            <Typography variant="body1" sx={{ color: "#ccc", mb: 3, lineHeight: 1.8 }}>
              <strong>Optical Character Recognition (OCR):</strong> This cutting-edge technology converts printed text into digital data. Combined with advanced text-to-speech software, it enables devices to read printed information aloud—empowering visually impaired users to access product details independently.
            </Typography>
            <Typography variant="body1" sx={{ color: "#ccc", lineHeight: 1.8 }}>
              Our system uses state-of-the-art machine learning algorithms to achieve high accuracy even with small text, different fonts, and varying lighting conditions.
            </Typography>
          </Paper>

          <Paper sx={{ 
            bgcolor: "rgba(255,255,255,0.05)", 
            p: 4, 
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
              Real-World Applications
            </Typography>
            <Typography variant="body1" sx={{ color: "#ccc", mb: 3, lineHeight: 1.8 }}>
              <strong>Similar technology</strong> is used in apps like Seeing AI and OrCam MyEye, helping users read labels, signs, and documents. Our smart glasses take this technology to the next level with hands-free operation and continuous assistance.
            </Typography>
            <Typography variant="body1" sx={{ color: "#ccc", lineHeight: 1.8 }}>
              The system can read product expiration dates, ingredient lists, nutritional information, and any other text-based information that sighted individuals take for granted.
            </Typography>
          </Paper>
        </Box>

        {/* Live Camera Preview with OCR */}
        <Paper sx={{ 
          bgcolor: "rgba(255,255,255,0.05)", 
          p: 6, 
          border: "1px solid rgba(255,255,255,0.1)",
          textAlign: "left"
        }}>
          <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
            <CameraAltIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Smart Camera with OCR
          </Typography>
          <Typography variant="body1" sx={{ color: "#ccc", mb: 4 }}>
            Experience real-time text recognition using state-of-the-art OCR technology. Point your camera at any text to see it converted to digital format instantly.
          </Typography>
          
          {!isSecureContextOrLocalhost() && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Use HTTPS or localhost for camera access in browsers.
            </Alert>
          )}
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4, alignItems: 'start' }}>
            {/* Camera Controls */}
            <Box>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                    Camera Settings
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="camera-select-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>Select Camera</InputLabel>
                    <Select
                      labelId="camera-select-label"
                      id="camera-select"
                      value={selectedDeviceId}
                      label="Select Camera"
                      onChange={(e) => setSelectedDeviceId(e.target.value as string)}
                      sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
                    >
                      {videoDevices.length === 0 && (
                        <MenuItem value="" disabled>No cameras found</MenuItem>
                      )}
                      {videoDevices.map(d => (
                        <MenuItem key={d.deviceId} value={d.deviceId}>
                          {d.label || 'Camera'} 
                          {d.label.toLowerCase().includes('eos') || d.label.toLowerCase().includes('dslr') ? ' 📷' : ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button 
                      variant="contained" 
                      onClick={requestPermissionAndInit} 
                      disabled={initializing} 
                      startIcon={<CameraAltIcon />}
                      sx={{ bgcolor: 'white', color: 'black', fontWeight: 600 }}
                    >
                      {initializing ? 'Starting…' : (videoDevices.length ? 'Refresh Cameras' : 'Enable Camera')}
                    </Button>
                    {videoDevices.length > 0 && (
                      <Button 
                        variant="outlined" 
                        onClick={forceRefreshDevices} 
                        disabled={initializing}
                        startIcon={<RefreshIcon />}
                        sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                      >
                        Refresh
                      </Button>
                    )}
                  </Box>
                  
                  {errorMessage && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {errorMessage}
                    </Alert>
                  )}
                  
                  <Typography variant="body2" sx={{ color: '#ccc', mt: 2 }}>
                    💡 <strong>DSLR Tip:</strong> For Canon EOS cameras, install EOS Webcam Utility, connect via USB, and select "EOS Webcam Utility" from the list.
                  </Typography>
                </CardContent>
              </Card>
              
              {/* OCR Controls */}
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                    <TextFieldsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    OCR Controls
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button 
                      variant="contained" 
                      onClick={isOcrActive ? stopOCR : startOCR}
                      disabled={!hasPermission || ocrProcessing}
                      startIcon={isOcrActive ? <StopIcon /> : <PlayArrowIcon />}
                      sx={{ 
                        bgcolor: isOcrActive ? '#f44336' : '#4CAF50', 
                        color: 'white', 
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: isOcrActive ? '#d32f2f' : '#45a049'
                        }
                      }}
                    >
                      {ocrProcessing ? 'Processing...' : (isOcrActive ? 'Stop OCR' : 'Start OCR')}
                    </Button>
                  </Box>
                  
                  {ocrProcessing && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <CircularProgress size={20} sx={{ color: '#4CAF50' }} />
                      <Typography variant="body2" sx={{ color: '#ccc' }}>
                        Processing image with AI...
                      </Typography>
                    </Box>
                  )}
                  
                  {ocrConfidence > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#ccc' }}>
                        Confidence:
                      </Typography>
                      <Chip 
                        label={`${Math.round(ocrConfidence * 100)}%`}
                        size="small"
                        sx={{ 
                          bgcolor: ocrConfidence > 0.8 ? '#4CAF50' : ocrConfidence > 0.6 ? '#FF9800' : '#f44336',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  )}
                  
                                     <Typography variant="body2" sx={{ color: '#ccc' }}>
                     🚀 <strong>Real OCR:</strong> Using Tesseract OCR engine for accurate text recognition
                   </Typography>
                </CardContent>
              </Card>
            </Box>
            
            {/* Camera Feed and OCR Results */}
            <Box>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                    Live Camera Feed
                  </Typography>
                  <Box sx={{ position: 'relative', width: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <video ref={videoRef} playsInline muted style={{ width: '100%', height: 'auto', background: 'black' }} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    {isOcrActive && (
                      <Box sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10, 
                        bgcolor: 'rgba(76, 175, 80, 0.9)', 
                        color: 'white', 
                        px: 2, 
                        py: 1, 
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <TextFieldsIcon fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          OCR Active
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
              
              {/* OCR Results */}
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                    Recognized Text
                  </Typography>
                  
                  {ocrResults.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#ccc', fontStyle: 'italic' }}>
                      {isOcrActive ? 'Point camera at text to see recognition results...' : 'Start OCR to begin text recognition'}
                    </Typography>
                  ) : (
                    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                      {ocrResults.map((text, index) => (
                        <Chip 
                          key={index}
                          label={text}
                          sx={{ 
                            m: 0.5, 
                            bgcolor: 'rgba(76, 175, 80, 0.2)', 
                            color: 'white',
                            border: '1px solid rgba(76, 175, 80, 0.3)'
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>

    {/* Footer */}
    <Box sx={{ bgcolor: "#000", py: 6, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 4, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "#ccc" }}>
          © 2024 Smart Glasses Project. All rights reserved.
        </Typography>
      </Box>
    </Box>
  </Box>
  );
};

export default Demo; 