import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Features from './pages/Features';
import TechStack from './pages/TechStack';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Highlights from './pages/Highlights';
import Integrations from './pages/Integrations';
import Demo from './pages/Demo';
import Testimonials from './pages/Testimonials';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/layout/FloatingWhatsApp';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        <Navbar />

        <main className="flex-grow pt-[72px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/tech" element={<TechStack />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/testimonials" element={<Testimonials />} />
            {/* Additional routes will be added here */}
          </Routes>
        </main>

        <Footer />
        <FloatingWhatsApp />
      </div>
    </Router>
  );
}

export default App;
