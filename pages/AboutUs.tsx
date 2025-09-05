import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const AboutUs: React.FC = () => (
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
          About This Project
        </Typography>
        <Typography variant="h6" sx={{ color: "#ccc", fontWeight: 300, maxWidth: 800, mx: "auto" }}>
          Empowering visually impaired individuals through innovative assistive technology
        </Typography>
      </Box>
    </Box>

    {/* Main Content */}
    <Box sx={{ py: 8, px: 4, bgcolor: "#000" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 6 }}>
          {/* Main Content */}
          <Box>
            <Paper sx={{ 
              bgcolor: "rgba(255,255,255,0.05)", 
              p: 4, 
              border: "1px solid rgba(255,255,255,0.1)",
              mb: 4
            }}>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
                Project Overview
              </Typography>
              <Typography variant="body1" sx={{ color: "#ccc", mb: 3, lineHeight: 1.8 }}>
                This website demonstrates a proposed system: smart glasses for the visually impaired, equipped with a camera and speakers to read manufacturing dates and product info aloud. The site is for demonstration and project presentation purposes only.
              </Typography>
              <Typography variant="body1" sx={{ color: "#ccc", lineHeight: 1.8 }}>
                Our smart glasses combine cutting-edge computer vision technology with advanced voice synthesis to provide real-time assistance to visually impaired individuals, helping them navigate the world with greater independence and confidence.
              </Typography>
            </Paper>

            <Paper sx={{ 
              bgcolor: "rgba(255,255,255,0.05)", 
              p: 4, 
              border: "1px solid rgba(255,255,255,0.1)",
              mb: 4
            }}>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
                Why Assistive Technology?
              </Typography>
              <Typography variant="body1" sx={{ color: "#ccc", mb: 3, lineHeight: 1.8 }}>
                According to the World Health Organization, at least 2.2 billion people globally have a vision impairment or blindness. Assistive technology, such as smart glasses, can help bridge the gap to independence, enabling users to access information, navigate environments, and participate more fully in society.
              </Typography>
              <Typography variant="body1" sx={{ color: "#ccc", lineHeight: 1.8 }}>
                <strong>Educational Note:</strong> Assistive devices are not just tools—they are enablers of inclusion, education, and employment for millions worldwide.
              </Typography>
            </Paper>

            <Paper sx={{ 
              bgcolor: "rgba(255,255,255,0.05)", 
              p: 4, 
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
                Project Motivation
              </Typography>
              <Typography variant="body1" sx={{ color: "#ccc", mb: 3, lineHeight: 1.8 }}>
                To empower blind individuals with greater independence and safety through technology. Our goal is to create a practical, affordable, and user-friendly solution that can make a real difference in the daily lives of visually impaired individuals.
              </Typography>
              <Typography variant="body1" sx={{ color: "#ccc", lineHeight: 1.8 }}>
                <strong>Role:</strong> This project represents the culmination of our research and development efforts in assistive technology and computer vision applications.
              </Typography>
            </Paper>
          </Box>

          {/* Sidebar */}
          <Box>
            <Paper sx={{ 
              bgcolor: "rgba(255,255,255,0.05)", 
              p: 4, 
              border: "1px solid rgba(255,255,255,0.1)",
              mb: 4
            }}>
              <Typography variant="h5" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
                Key Features
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  "Real-time text recognition",
                  "Voice synthesis output",
                  "Product date detection",
                  "Battery-efficient design",
                  "Accessible user interface"
                ].map((feature, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: "50%", 
                      bgcolor: "#4CAF50" 
                    }} />
                    <Typography variant="body2" sx={{ color: "#ccc" }}>
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            <Paper sx={{ 
              bgcolor: "rgba(255,255,255,0.05)", 
              p: 4, 
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <Typography variant="h5" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
                Technology Stack
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  "Computer Vision (OpenCV)",
                  "Machine Learning (TensorFlow)",
                  "Voice Synthesis (TTS)",
                  "React Frontend",
                  "Node.js Backend"
                ].map((tech, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: "50%", 
                      bgcolor: "#2196F3" 
                    }} />
                    <Typography variant="body2" sx={{ color: "#ccc" }}>
                      {tech}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
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

export default AboutUs; 