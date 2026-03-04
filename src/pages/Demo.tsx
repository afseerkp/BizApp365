import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

const Demo = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                        Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1976d2] to-[#9c27b0]">Product Tour</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-balance">
                        See BizApp365 in action. Watch our comprehensive demo to understand how the modules work together seamlessly.
                    </p>
                </motion.div>

                {/* 3D Video Player Frame Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative max-w-5xl mx-auto perspective-1000"
                >
                    <div className="bg-slate-800 dark:bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-700 shadow-2xl transform rotate-x-2 hover:rotate-x-0 transition-transform duration-500">
                        {/* Window controls */}
                        <div className="flex gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>

                        {/* Video Area Placeholder */}
                        <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center group cursor-pointer border border-slate-700">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#1976d2]/20 to-[#9c27b0]/20 opacity-50"></div>

                            <div className="relative z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all border border-white/20">
                                <PlayCircle className="w-10 h-10 text-white fill-white/20" />
                            </div>

                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="h-1 bg-slate-700 rounded-full w-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#1976d2] to-[#9c27b0] w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ambient Glow */}
                    <div className="absolute -inset-10 bg-gradient-to-r from-[#1976d2] to-[#9c27b0] opacity-20 blur-3xl rounded-full z-[-1] animate-pulse"></div>
                </motion.div>
            </div>
        </div>
    );
};

export default Demo;
