import React from 'react';
import Hero from '../components/ui/Hero';

const Home = () => {
    return (
        <div className="w-full">
            <Hero />
            {/* Other sections will be added here: Features, Modules, Tech Stack, Testimonials, CTA */}
            <div className="min-h-screen bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-24 flex items-center justify-center">
                <h2 className="text-2xl text-slate-500 italic">Scroll for more features... (Coming soon)</h2>
            </div>
        </div>
    );
};

export default Home;
