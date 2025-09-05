import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import emailjs from '@emailjs/browser';

const Contacts: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = React.useState(false);
  const [success, setSuccess] = React.useState<string|null>(null);
  const [error, setError] = React.useState<string|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccess(null);
    setError(null);
    try {
      await emailjs.send(
        'service_6l3dkv9', 
        'template_vze97rv', 
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        'HZwgFAXOznF7HiEHj' 
      );
      setSuccess('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "black", width: "100%", overflow: "hidden" }}>
      {/* Hero Section */}
      <Box sx={{ 
        minHeight: "60vh", 
        bgcolor: "#1a1a1a", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        pt: 10
      }}>
        <Box sx={{ textAlign: "center", px: 4 }}>
          <Typography variant="h2" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
            Contact Us
          </Typography>
          <Typography variant="h6" sx={{ color: "#ccc", fontWeight: 300, maxWidth: 600, mx: "auto" }}>
            Get in touch with us. We'd love to hear from you and answer any questions you may have.
          </Typography>
        </Box>
      </Box>

      {/* Contact Form and Information */}
      <Box sx={{ py: 8, px: 4, bgcolor: "#000" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 6 }}>
            {/* Contact Form */}
            <Paper sx={{ 
              bgcolor: "rgba(255,255,255,0.05)", 
              p: 4, 
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 4 }}>
                Send us a Message
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  label="Name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange('name')}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-focused': {
                        color: 'white',
                      },
                    },
                  }}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-focused': {
                        color: 'white',
                      },
                    },
                  }}
                />
                <TextField
                  label="Subject"
                  variant="outlined"
                  value={formData.subject}
                  onChange={handleChange('subject')}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-focused': {
                        color: 'white',
                      },
                    },
                  }}
                />
                <TextField
                  label="Message"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange('message')}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-focused': {
                        color: 'white',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={sending}
                  sx={{
                    bgcolor: "white",
                    color: "black",
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: "#ccc",
                    },
                  }}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
                {success && <Typography sx={{ color: 'lightgreen', mt: 2 }}>{success}</Typography>}
                {error && <Typography sx={{ color: 'red', mt: 2 }}>{error}</Typography>}
              </Box>
            </Paper>

            {/* Contact Information */}
            <Box>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 600, mb: 4 }}>
                Get in Touch
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Box sx={{ 
                  bgcolor: "rgba(255,255,255,0.05)", 
                  p: 3, 
                  borderRadius: 2, 
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 1 }}>
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#ccc" }}>
                    123 Business Street<br />
                    Suite 100<br />
                    City, State 12345
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: "rgba(255,255,255,0.05)", 
                  p: 3, 
                  borderRadius: 2, 
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 1 }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#ccc" }}>
                    +1 (555) 123-4567<br />
                    +1 (555) 987-6543
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: "rgba(255,255,255,0.05)", 
                  p: 3, 
                  borderRadius: 2, 
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 1 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#ccc" }}>
                    moharkamm@gmail.com<br />
                    support@company.com
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: "rgba(255,255,255,0.05)", 
                  p: 3, 
                  borderRadius: 2, 
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 600, mb: 1 }}>
                    Business Hours
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#ccc" }}>
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </Typography>
                </Box>
              </Box>
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
};

export default Contacts; 