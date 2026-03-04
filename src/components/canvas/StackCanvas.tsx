import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, Torus, Html } from '@react-three/drei';
import * as THREE from 'three';

const StackCanvas = () => {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    const TechNode = ({ position, color, label, type, delay }: any) => {
        const ref = useRef<THREE.Group>(null);
        useFrame((state) => {
            if (ref.current) {
                ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.2;
            }
        });

        return (
            <group ref={ref} position={position}>
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    {type === 'box' && (
                        <Box args={[1, 1, 1]}>
                            <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} transparent opacity={0.9} />
                        </Box>
                    )}
                    {type === 'sphere' && (
                        <Sphere args={[0.6, 32, 32]}>
                            <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} transparent opacity={0.9} />
                        </Sphere>
                    )}
                    {type === 'torus' && (
                        <Torus args={[0.5, 0.2, 16, 32]}>
                            <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} transparent opacity={0.9} />
                        </Torus>
                    )}
                    <Html center position={[0, -1, 0]} className="pointer-events-none">
                        <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow border border-slate-200 text-sm font-bold whitespace-nowrap" style={{ color }}>
                            {label}
                        </div>
                    </Html>
                </Float>
            </group>
        );
    };

    return (
        <group ref={group}>
            <TechNode position={[0, 1.5, 0]} color="#61DAFB" label="React 18" type="torus" delay={0} />
            <TechNode position={[-2, 0.5, 1]} color="#3178C6" label="TypeScript" type="box" delay={1} />
            <TechNode position={[2, 0, -1]} color="#339933" label="Node.js" type="sphere" delay={2} />
            <TechNode position={[-1.5, -1.5, -1]} color="#336791" label="PostgreSQL" type="box" delay={3} />
            <TechNode position={[1.5, -1, 1]} color="#0db7ed" label="Docker" type="box" delay={4} />
            <TechNode position={[0, -0.5, 2]} color="#06B6D4" label="Tailwind CSS" type="sphere" delay={5} />
            <TechNode position={[0, 0, -2]} color="#ff9800" label="AWS" type="torus" delay={6} />

            {/* Central connections */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color="#cbd5e1" wireframe />
            </mesh>
        </group>
    );
};

export default StackCanvas;
