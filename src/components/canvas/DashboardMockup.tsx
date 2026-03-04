import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, PresentationControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

const DashboardMockup = () => {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
            group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.05;
        }
    });

    return (
        <PresentationControls
            global={false}
            cursor={true}
            snap={true}
            speed={1.5}
            zoom={1}
            rotation={[0, -0.3, 0]}
            polar={[-0.2, 0.2]}
            azimuth={[-0.5, 0.5]}
        >
            <Float rotationIntensity={0.5} floatIntensity={1} speed={2}>
                <group ref={group} position={[0, -0.5, 0]} scale={[1.2, 1.2, 1.2]}>
                    {/* Main Dashboard Panel */}
                    <mesh position={[0, 0, 0]} castShadow receiveShadow>
                        <boxGeometry args={[6, 3.5, 0.2]} />
                        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.2} transparent opacity={0.9} />
                        <Html transform position={[0, 0, 0.11]} scale={0.5}>
                            <div className="w-[1150px] h-[650px] bg-slate-50 flex rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                                {/* Mock Sidebar */}
                                <div className="w-64 bg-slate-900 flex flex-col p-6">
                                    <div className="h-8 w-32 bg-slate-700 rounded mb-10"></div>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <div key={i} className="h-4 w-full bg-slate-800 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                                {/* Mock Content */}
                                <div className="flex-1 p-8 flex flex-col gap-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-center">
                                        <div className="h-6 w-48 bg-slate-200 rounded"></div>
                                        <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
                                    </div>
                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-4 gap-6">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-28 bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                                                <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                                                <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Chart Area */}
                                    <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm flex items-end p-6 gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                                            <div key={i} className="flex-1 bg-[#1976d2] rounded-t-md opacity-80" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Html>
                    </mesh>

                    {/* Floating UI Elements */}
                    <mesh position={[-3.2, 1.5, 0.5]} rotation={[0, 0.2, 0]}>
                        <boxGeometry args={[1.5, 1, 0.1]} />
                        <meshStandardMaterial color="#9c27b0" />
                        <Html transform position={[0, 0, 0.06]} scale={0.4}>
                            <div className="w-64 h-40 bg-white rounded-xl shadow-xl flex flex-col p-4">
                                <div className="text-sm font-bold text-slate-800 mb-2">Revenue Growth</div>
                                <div className="text-2xl font-black text-[#9c27b0] mb-2">+45.2%</div>
                                <div className="mt-auto h-12 w-full bg-purple-100 rounded flex items-end gap-1">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="flex-1 bg-purple-500 rounded-t" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </Html>
                    </mesh>

                    <mesh position={[3.2, -1, 0.8]} rotation={[0, -0.2, 0.1]}>
                        <boxGeometry args={[1.2, 1.2, 0.1]} />
                        <meshStandardMaterial color="#2e7d32" />
                        <Html transform position={[0, 0, 0.06]} scale={0.4}>
                            <div className="w-48 h-48 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center p-4 text-center">
                                <div className="w-16 h-16 rounded-full border-4 border-[#2e7d32] flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-[#2e7d32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="text-sm font-bold text-slate-800">System Status</div>
                                <div className="text-xs text-slate-500 mt-1">All modules operational</div>
                            </div>
                        </Html>
                    </mesh>
                </group>
            </Float>
        </PresentationControls>
    );
};

export default DashboardMockup;
