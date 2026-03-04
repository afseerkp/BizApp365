import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

const OfficeScene = () => {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    const Person = ({ position, color }: { position: [number, number, number], color: string }) => (
        <group position={position}>
            {/* Body */}
            <Cylinder args={[0.2, 0.2, 0.6]} position={[0, 0.3, 0]}>
                <meshStandardMaterial color={color} />
            </Cylinder>
            {/* Head */}
            <Sphere args={[0.2]} position={[0, 0.8, 0]}>
                <meshStandardMaterial color="#fcd34d" />
            </Sphere>
        </group>
    );

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
            <group ref={group} scale={[0.8, 0.8, 0.8]} position={[0, -0.5, 0]}>
                {/* Desk central */}
                <Box args={[3, 0.1, 3]} position={[0, 0.5, 0]}>
                    <meshStandardMaterial color="#cbd5e1" />
                </Box>
                <Box args={[0.4, 0.5, 0.4]} position={[0, 0.25, 0]}>
                    <meshStandardMaterial color="#94a3b8" />
                </Box>

                {/* Manager */}
                <Person position={[0, 0, -1]} color="#1976d2" />

                {/* Team Members */}
                <Person position={[-1.2, 0, 0.5]} color="#9c27b0" />
                <Person position={[1.2, 0, 0.5]} color="#2e7d32" />

                {/* Floating Org Chart connection lines */}
                <mesh position={[-0.6, 1.2, -0.25]} rotation={[0, -0.5, 0.8]}>
                    <cylinderGeometry args={[0.02, 0.02, 1.5]} />
                    <meshBasicMaterial color="#1976d2" transparent opacity={0.6} />
                </mesh>
                <mesh position={[0.6, 1.2, -0.25]} rotation={[0, 0.5, -0.8]}>
                    <cylinderGeometry args={[0.02, 0.02, 1.5]} />
                    <meshBasicMaterial color="#1976d2" transparent opacity={0.6} />
                </mesh>
            </group>
        </Float>
    );
};

export default OfficeScene;
