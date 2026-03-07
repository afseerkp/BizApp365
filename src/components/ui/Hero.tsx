import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import ParticleBackground from '../canvas/ParticleBackground';
import DashboardMockup from '../canvas/DashboardMockup';

const Hero = () => {
    const bgContainerRef = useRef<HTMLDivElement>(null);
    const isBgInView = useInView(bgContainerRef, { margin: "200px" });

    const dashboardContainerRef = useRef<HTMLDivElement>(null);
    const isDashboardInView = useInView(dashboardContainerRef, { margin: "200px" });

    return (
        <section className="relative min-h-screen pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            {/* 3D Background Canvas */}
            <div ref={bgContainerRef} className="absolute inset-0 z-0">
                {isBgInView && (
                    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                        <ambientLight intensity={0.5} />
                        <ParticleBackground />
                    </Canvas>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full flex flex-col lg:flex-row items-center gap-16">
                {/* Left Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#1976d2] dark:text-blue-400 font-medium text-sm mb-6 border border-blue-200 dark:border-blue-800"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1976d2]"></span>
                        </span>
                        BizApp365 Next-Gen ERP
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
                        Transform Your Business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1976d2] to-[#9c27b0]">Complete Accouting Solution</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl text-balance">
                        Multi-tenant accounting, inventory, production, HR, and more. All seamlessly integrated into a single powerful platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#1976d2] hover:bg-[#1565c0] text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
                        >
                            Start Free Trial <ArrowRight size={20} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                            <PlayCircle size={20} className="text-[#9c27b0]" /> Watch Demo
                        </motion.button>
                    </div>


                </motion.div>

                {/* Right 3D Area */}
                <div ref={dashboardContainerRef} className="w-full lg:w-1/2 h-[500px] lg:h-[700px] relative mt-12 lg:mt-0">
                    {isDashboardInView && (
                        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
                            <ambientLight intensity={0.4} />
                            <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" castShadow />
                            <directionalLight position={[-10, -10, -5]} intensity={1} color="#9c27b0" />
                            <Suspense fallback={null}>
                                <DashboardMockup />
                            </Suspense>
                        </Canvas>
                    )}
                    <div className="absolute inset-0 z-[-1] bg-gradient-to-tr from-[#1976d2]/10 to-[#9c27b0]/10 rounded-full blur-[100px] animate-pulse"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
