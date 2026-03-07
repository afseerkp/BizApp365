import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

const AbstractShape = () => {
    const sphereRef = useRef<any>(null);

    useFrame((state) => {
        if (sphereRef.current) {
            sphereRef.current.distort = 0.4 + Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1.5, 64, 64]}>
                <MeshDistortMaterial ref={sphereRef} color="#1976d2" envMapIntensity={1} clearcoat={1} clearcoatRoughness={0.1} metalness={0.8} roughness={0.1} />
            </Sphere>
            <Sphere args={[1.2, 64, 64]} position={[1, -1, -1]}>
                <MeshDistortMaterial color="#9c27b0" envMapIntensity={1} clearcoat={1} clearcoatRoughness={0.1} metalness={0.8} roughness={0.1} />
            </Sphere>
        </Float>
    );
};

const Contact = () => {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(canvasContainerRef, { margin: "200px" });

    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                        Get in <span className="text-[#9c27b0]">Touch</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-balance">
                        Ready to transform your business? Request a demo or contact our sales team to discuss your customized ERP solution.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12 items-center">

                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1976d2] focus:border-transparent transition-all outline-none" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1976d2] focus:border-transparent transition-all outline-none" placeholder="Doe" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Work Email</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1976d2] focus:border-transparent transition-all outline-none" placeholder="john@company.com" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Size</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1976d2] focus:border-transparent transition-all outline-none">
                                        <option>1-10 employees</option>
                                        <option>11-50 employees</option>
                                        <option>51-200 employees</option>
                                        <option>201+ employees</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">How can we help?</label>
                                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1976d2] focus:border-transparent transition-all outline-none resize-none" placeholder="Tell us about your requirements..."></textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-[#1976d2] to-[#9c27b0] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30"
                                >
                                    Request Demo
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* 3D Visual Side */}
                    <motion.div
                        ref={canvasContainerRef}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="w-full lg:w-1/2 h-[500px] lg:h-[600px] relative"
                    >
                        {isInView && (
                            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                                <ambientLight intensity={0.5} />
                                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                                <AbstractShape />
                                <Environment preset="city" />
                                <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
                            </Canvas>
                        )}
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
