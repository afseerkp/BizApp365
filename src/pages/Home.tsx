import React from 'react';
import Hero from '../components/ui/Hero';
import Highlights from './Highlights';
import Features from './Features';
import TechStack from './TechStack';
import Testimonials from './Testimonials';
import CTASection from '../components/ui/CTASection';

const Home = () => {
    return (
        <div className="w-full">
            <Hero />
            <div id="highlights-section"><Highlights /></div>
            <div id="features-section"><Features /></div>
            <div id="tech-section"><TechStack /></div>
            <div id="testimonials-section"><Testimonials /></div>
            <CTASection />
        </div>
    );
};

export default Home;
