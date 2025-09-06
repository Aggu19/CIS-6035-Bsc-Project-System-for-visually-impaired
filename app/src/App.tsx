import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './index';
import Contacts from './pages/Contacts';
import AboutUs from './pages/AboutUs';
import Specifications from './pages/Specifications';
import Demo from './pages/Demo';
import ProtectedRoute from './components/ProtectedRoute';

// Streamlined navigation with only the most essential pages
const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Demo", path: "/demo" },
  { name: "Specs", path: "/specs" },
  { name: "Contact", path: "/contacts" },
];

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav 
      aria-label="Main navigation" 
      style={{ 
        background: isScrolled ? 'rgba(0,0,0,0.98)' : 'rgba(0,0,0,0.95)', 
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100vw', 
        maxWidth: '100%',
        zIndex: 9999,
        transition: 'all 0.3s ease',
        boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.5)' : 'none',
        margin: 0,
        padding: 0
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        height: '80px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Logo/Brand */}
        <Link 
          to="/" 
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.8rem',
            fontWeight: '700',
            letterSpacing: '1px',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#4CAF50'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
        >
          SmartGlasses
        </Link>
        
        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {NAV_LINKS.slice(1).map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                color: location.pathname === link.path ? '#4CAF50' : 'white',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: location.pathname === link.path ? '600' : '400',
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                transition: 'all 0.3s ease',
                border: location.pathname === link.path ? '1px solid #4CAF50' : '1px solid transparent',
                background: location.pathname === link.path ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== link.path) {
                  e.currentTarget.style.color = '#4CAF50';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = 'rgba(76, 175, 80, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== link.path) {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div style={{ 
        paddingTop: '80px',
        minHeight: '100vh',
        background: 'black',
        width: '100vw',
        maxWidth: '100%',
        overflowX: 'hidden',
        margin: 0,
        paddingLeft: 0,
        paddingRight: 0
      }}>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/specs" element={<Specifications />} />
          <Route path="/demo" element={<ProtectedRoute><Demo /></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
