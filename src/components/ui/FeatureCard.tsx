import React, { ReactNode, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';

interface FeatureCardProps {
    title: string;
    description: string;
    features: string[];
    canvasContent: ReactNode;
    delay?: number;
}

const FeatureCard = ({ title, description, features, canvasContent, delay = 0 }: FeatureCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col group h-full"
        >
            {/* 3D Canvas Header Area */}
            <div className="h-64 sm:h-72 w-full bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5"></div>
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 10]} intensity={1.5} />
                    <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#9c27b0" />
                    <Suspense fallback={null}>
                        {canvasContent}
                    </Suspense>
                </Canvas>
            </div>

            {/* Content Area */}
            <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#1976d2] transition-colors">
                    {title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 flex-1">
                    {description}
                </p>

                <ul className="space-y-3">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#1976d2] flex-shrink-0"></span>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

export default FeatureCard;
