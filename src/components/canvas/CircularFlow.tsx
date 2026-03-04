import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Trail, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const CircularFlow = () => {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.x = 0.5;
            group.current.rotation.z = state.clock.elapsedTime * 0.5;
        }
    });

    const OrbitingParticle = ({ radius, speed, color }: { radius: number, speed: number, color: string }) => {
        const ref = useRef<THREE.Mesh>(null);
        useFrame((state) => {
            if (ref.current) {
                const t = state.clock.elapsedTime * speed;
                ref.current.position.x = Math.cos(t) * radius;
                ref.current.position.y = Math.sin(t) * radius;
            }
        });

        return (
            <Trail width={2} length={8} color={new THREE.Color(color)} attenuation={(t) => t * t}>
                <mesh ref={ref}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            </Trail>
        );
    };

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            {/* Central Hub */}
            <Sphere args={[0.5, 32, 32]}>
                <meshStandardMaterial color="#1976d2" roughness={0.1} metalness={0.8} />
            </Sphere>

            <group ref={group}>
                {/* Orbits representing transaction flows */}
                <mesh>
                    <ringGeometry args={[1.95, 2.05, 64]} />
                    <meshBasicMaterial color="#e2e8f0" side={THREE.DoubleSide} transparent opacity={0.5} />
                </mesh>
                <mesh>
                    <ringGeometry args={[2.95, 3.05, 64]} />
                    <meshBasicMaterial color="#e2e8f0" side={THREE.DoubleSide} transparent opacity={0.5} />
                </mesh>

                {/* Moving transaction packets */}
                <OrbitingParticle radius={2} speed={1} color="#9c27b0" />
                <OrbitingParticle radius={2} speed={1} color="#2e7d32" />
                <OrbitingParticle radius={3} speed={-0.8} color="#ff9800" />
                <OrbitingParticle radius={3} speed={-0.8} color="#d32f2f" />
            </group>
        </Float>
    );
};

export default CircularFlow;
