import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const GearsScene = () => {
    const gear1 = useRef<THREE.Group>(null);
    const gear2 = useRef<THREE.Group>(null);
    const gear3 = useRef<THREE.Group>(null);

    useFrame((state) => {
        const speed = state.clock.elapsedTime * 0.5;
        if (gear1.current) gear1.current.rotation.z = speed;
        if (gear2.current) gear2.current.rotation.z = -speed * 1.5; // smaller gear, faster, inverse
        if (gear3.current) gear3.current.rotation.z = speed * 1.2; // medium gear
    });

    const Gear = ({ teeth, radius, color, ...props }: any) => {
        return (
            <group {...props}>
                <Cylinder args={[radius, radius, 0.2, teeth * 2]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
                </Cylinder>
                {/* Gear hole */}
                <Cylinder args={[radius * 0.3, radius * 0.3, 0.25, 16]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#94a3b8" />
                </Cylinder>
            </group>
        );
    };

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <group scale={[0.8, 0.8, 0.8]} position={[0, 0, 0]}>

                {/* Main large gear */}
                <Gear
                    ref={gear1}
                    position={[-0.5, 0.5, 0]}
                    teeth={16}
                    radius={1.5}
                    color="#1976d2"
                />

                {/* Interlocking small gear */}
                <Gear
                    ref={gear2}
                    position={[1.5, 1.5, 0]}
                    teeth={10}
                    radius={0.8}
                    color="#ff9800"
                />

                {/* Interlocking medium gear */}
                <Gear
                    ref={gear3}
                    position={[1, -1, 0]}
                    teeth={12}
                    radius={1}
                    color="#9c27b0"
                />

            </group>
        </Float>
    );
};

export default GearsScene;
