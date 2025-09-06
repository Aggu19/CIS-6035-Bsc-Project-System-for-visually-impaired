import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import heroVideo from "./assets/hero.mp4";

const HomePage: React.FC = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "black", width: "100%", overflow: "hidden" }}>
      {/* Hero Section with Centered Video */}
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          
          Your browser does not support the video tag.
        </video>
        {/* Overlay for text visibility */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.4)",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          <Typography variant="h2" sx={{ color: "white", fontWeight: 600, mb: 3, textAlign: "center", textShadow: "0 2px 16px #000" }}>
            Smart Glasses for the Visually Impaired
          </Typography>
          <Typography variant="h5" sx={{ color: "white", fontWeight: 300, textAlign: "center", maxWidth: 600, textShadow: "0 2px 16px #000" }}>
            Experience independence through innovative assistive technology that reads product information aloud.
          </Typography>
        </Box>
      </Box>

      {/* Second Hero Section */}
      <Box sx={{ minHeight: "100vh", bgcolor: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", py: 8 }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 4, textAlign: "center" }}>
          <Typography variant="h3" sx={{ color: "white", fontWeight: 600, mb: 4 }}>
            Key Features
          </Typography>
          <Typography variant="h6" sx={{ color: "#ccc", fontWeight: 300, mb: 6, maxWidth: 800, mx: "auto" }}>
            Our smart glasses combine cutting-edge technology with accessibility to empower visually impaired individuals.
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4, mt: 6 }}>
            {[
              { title: "Voice Recognition", description: "Advanced AI that reads product labels and expiration dates aloud" },
              { title: "Real-time Processing", description: "Instant analysis of visual information through integrated cameras" },
              { title: "Accessibility First", description: "Designed specifically for the needs of visually impaired users" }
            ].map((feature, index) => (
              <Box key={index} sx={{ 
                bgcolor: "rgba(255,255,255,0.05)", 
                p: 4, 
                borderRadius: 2, 
                border: "1px solid rgba(255,255,255,0.1)",
                '&:hover': {
                  transform: 'translateY(-8px)',
                  transition: 'all 0.3s ease',
                  bgcolor: "rgba(255,255,255,0.08)"
                },
                transition: 'all 0.3s ease'
              }}>
                <Typography variant="h5" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#ccc" }}>
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#000", py: 6, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 4 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" }, gap: 4, mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                Project
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>About Us</Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>Demo</Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>Specifications</Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                Technology
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>AI Processing</Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>Voice Recognition</Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>Hardware</Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                Support
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>FAQ</Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>Contact</Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>Feedback</Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 2 }}>
                Accessibility
              </Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>Resources</Typography>
              <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>Guidelines</Typography>
              <Typography variant="body2" sx={{ color: "#ccc" }}>Standards</Typography>
            </Box>
          </Box>
          <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", pt: 4, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#ccc" }}>
              © 2024 Smart Glasses Project. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage; 