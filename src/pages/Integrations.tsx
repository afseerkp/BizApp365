import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Sphere, Html } from '@react-three/drei';

const NodeNetwork = () => {
    const group = useRef<any>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
            group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.1) * 0.1;
        }
    });

    const Node = ({ position, color, label }: any) => (
        <group position={position}>
            <Sphere args={[0.4, 32, 32]}>
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} transparent opacity={0.9} />
            </Sphere>
            <Html center position={[0, -0.7, 0]} className="pointer-events-none">
                <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg shadow-md border border-slate-200 text-sm font-bold whitespace-nowrap text-slate-800">
                    {label}
                </div>
            </Html>
        </group>
    );

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={group} scale={[1.2, 1.2, 1.2]}>
                {/* Central Hub */}
                <Node position={[0, 0, 0]} color="#1976d2" label="BizApp365" />

                {/* Integrations Nodes */}
                <Node position={[-3, 1.5, 1]} color="#25D366" label="WhatsApp API" />
                <Node position={[3, 1.5, -1]} color="#ff9800" label="UAE E-Invoice / Peppol" />
                <Node position={[-2, -2, -1]} color="#2e7d32" label="Excel Gateway" />
                <Node position={[2, -2, 1]} color="#9c27b0" label="Stripe / Payments" />
                <Node position={[0, 3, -1]} color="#d32f2f" label="Custom REST APIs" />

                {/* Connections */}
                <Line points={[[0, 0, 0], [-3, 1.5, 1]]} color="#cbd5e1" lineWidth={3} />
                <Line points={[[0, 0, 0], [3, 1.5, -1]]} color="#cbd5e1" lineWidth={3} />
                <Line points={[[0, 0, 0], [-2, -2, -1]]} color="#cbd5e1" lineWidth={3} />
                <Line points={[[0, 0, 0], [2, -2, 1]]} color="#cbd5e1" lineWidth={3} />
                <Line points={[[0, 0, 0], [0, 3, -1]]} color="#cbd5e1" lineWidth={3} />
            </group>
        </Float>
    );
};

const Integrations = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                        Seamless <span className="text-[#9c27b0]">Integrations</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-balance">
                        Connect BizApp365 with the tools you already use. Send notifications via WhatsApp and comply with UAE E-Invoicing standards instantly.
                    </p>
                </motion.div>
            </div>

            <div className="flex-1 w-full relative min-h-[600px] bg-slate-100 dark:bg-slate-800/50 mt-8 shadow-inner">
                <div className="absolute inset-0 bg-grid-slate-800/[0.05] bg-[size:20px_20px]"></div>
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }} className="cursor-grab active:cursor-grabbing">
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
                    <NodeNetwork />
                </Canvas>
            </div>
        </div>
    );
};

export default Integrations;
