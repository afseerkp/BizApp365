import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const FactoryScene = () => {
    const group = useRef<THREE.Group>(null);
    const conveyor = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
        }
        if (conveyor.current) {
            // Simulate moving items on conveyor
            conveyor.current.children.forEach((child, i) => {
                child.position.x = (child.position.x + 0.02) % 4;
                if (child.position.x > 2) child.position.x = -2;
            });
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={group} scale={[0.6, 0.6, 0.6]} position={[0, -0.5, 0]}>
                {/* Main Factory Building */}
                <Box args={[4, 2, 2.5]} position={[0, 1, 0]}>
                    <meshStandardMaterial color="#64748b" roughness={0.7} />
                </Box>

                {/* Roof variants */}
                <Box args={[1.5, 0.5, 2.5]} position={[-1.25, 2.25, 0]}>
                    <meshStandardMaterial color="#475569" />
                </Box>
                <Box args={[1.5, 0.5, 2.5]} position={[1.25, 2.25, 0]}>
                    <meshStandardMaterial color="#475569" />
                </Box>

                {/* Smokestacks */}
                <Cylinder args={[0.2, 0.3, 1.5]} position={[-1, 3, -0.5]}>
                    <meshStandardMaterial color="#94a3b8" />
                </Cylinder>
                <Cylinder args={[0.2, 0.3, 1.2]} position={[1, 2.8, 0.5]}>
                    <meshStandardMaterial color="#94a3b8" />
                </Cylinder>

                {/* Smoke particles */}
                <Float speed={4} floatIntensity={0.5}>
                    <mesh position={[-1, 4, -0.5]}>
                        <sphereGeometry args={[0.4, 8, 8]} />
                        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.6} />
                    </mesh>
                </Float>

                {/* Conveyor Belt Out */}
                <Box args={[4, 0.2, 0.8]} position={[0, 0.1, 2]}>
                    <meshStandardMaterial color="#334155" />
                </Box>

                {/* Products on conveyor */}
                <group ref={conveyor} position={[0, 0.4, 2]}>
                    {[1, 2, 3].map((i) => (
                        <mesh key={i} position={[-2 + i * 1.5, 0, 0]}>
                            <boxGeometry args={[0.4, 0.4, 0.4]} />
                            <meshStandardMaterial color="#2e7d32" />
                        </mesh>
                    ))}
                </group>
            </group>
        </Float>
    );
};

export default FactoryScene;
