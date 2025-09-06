import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const Specifications: React.FC = () => (
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
          Technical Specifications
        </Typography>
        <Typography variant="h6" sx={{ color: "#ccc", fontWeight: 300, maxWidth: 800, mx: "auto" }}>
          Advanced technology designed for accessibility and reliability
        </Typography>
      </Box>
    </Box>

    {/* Main Content */}
    <Box sx={{ py: 8, px: 4, bgcolor: "#000" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Hardware Specifications */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" sx={{ color: "white", fontWeight: 600, mb: 6, textAlign: "center" }}>
            Hardware Components
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 4 }}>
            {[
              {
                title: "Camera System",
                specs: "High-resolution, auto-focus",
                description: "Allows accurate reading of small print, such as manufacturing dates, even in low light conditions.",
                icon: "📷"
              },
              {
                title: "Audio System",
                specs: "Bone conduction speakers",
                description: "Bone conduction leaves the ears open to ambient sounds, increasing safety for visually impaired users.",
                icon: "🔊"
              },
              {
                title: "Power System",
                specs: "12-hour battery life",
                description: "Long battery life ensures the device is reliable for daily use without frequent charging.",
                icon: "🔋"
              },
              {
                title: "Connectivity",
                specs: "Bluetooth 5.0, WiFi 6",
                description: "Allows integration with smartphones and cloud services for updates and additional features.",
                icon: "📡"
              },
              {
                title: "Control Interface",
                specs: "Tactile buttons, voice commands",
                description: "Physical buttons and voice input are essential for users who cannot see a touchscreen.",
                icon: "🎛️"
              },
              {
                title: "Design & Comfort",
                specs: "Lightweight, durable, comfortable",
                description: "Comfort and durability are key for all-day wear and real-world use scenarios.",
                icon: "👓"
              }
            ].map((item, index) => (
              <Paper key={index} sx={{ 
                bgcolor: "rgba(255,255,255,0.05)", 
                p: 4, 
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 3,
                transition: "all 0.3s ease",
                '&:hover': {
                  transform: 'translateY(-8px)',
                  bgcolor: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(76, 175, 80, 0.3)"
                }
              }}>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {item.icon}
                  </Typography>
                  <Typography variant="h5" sx={{ color: "white", fontWeight: 600, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#4CAF50", fontWeight: 500, mb: 2 }}>
                    {item.specs}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "#ccc", lineHeight: 1.6, textAlign: "center" }}>
                  {item.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Software & AI Specifications */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 6, mb: 8 }}>
          <Paper sx={{ 
            bgcolor: "rgba(255,255,255,0.05)", 
            p: 4, 
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
              Software Architecture
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                "Real-time OCR processing",
                "Advanced text recognition algorithms",
                "Natural language processing",
                "Voice synthesis engine",
                "Machine learning models",
                "Cloud-based updates"
              ].map((feature, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: "50%", 
                    bgcolor: "#4CAF50" 
                  }} />
                  <Typography variant="body1" sx={{ color: "#ccc" }}>
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
            <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
              Performance Metrics
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {[
                { metric: "Text Recognition Accuracy", value: "99.2%" },
                { metric: "Processing Speed", value: "< 2 seconds" },
                { metric: "Battery Life", value: "12 hours" },
                { metric: "Weight", value: "45 grams" },
                { metric: "Water Resistance", value: "IP54" },
                { metric: "Operating Temperature", value: "-10°C to 50°C" }
              ].map((item, index) => (
                <Box key={index} sx={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  p: 2,
                  bgcolor: "rgba(255,255,255,0.03)",
                  borderRadius: 1
                }}>
                  <Typography variant="body1" sx={{ color: "#ccc" }}>
                    {item.metric}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#4CAF50", fontWeight: 600 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Accessibility Standards */}
        <Paper sx={{ 
          bgcolor: "rgba(255,255,255,0.05)", 
          p: 6, 
          border: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center"
        }}>
          <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 4 }}>
            Accessibility Standards Compliance
          </Typography>
          <Typography variant="body1" sx={{ color: "#ccc", mb: 4, lineHeight: 1.8, maxWidth: 800, mx: "auto" }}>
            <strong>Why these features?</strong> International standards (such as those from the RNIB and W3C) recommend tactile, audio, and ergonomic design for assistive devices. Each feature is chosen to maximize usability and independence for visually impaired users.
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4, mt: 4 }}>
            {[
              { standard: "WCAG 2.1", level: "AA Compliance" },
              { standard: "Section 508", level: "Full Compliance" },
              { standard: "EN 301 549", level: "European Standard" }
            ].map((item, index) => (
              <Box key={index} sx={{ 
                p: 3, 
                bgcolor: "rgba(76, 175, 80, 0.1)", 
                border: "1px solid rgba(76, 175, 80, 0.3)",
                borderRadius: 2
              }}>
                <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 1 }}>
                  {item.standard}
                </Typography>
                <Typography variant="body2" sx={{ color: "#4CAF50" }}>
                  {item.level}
                </Typography>
              </Box>
            ))}
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

export default Specifications; 