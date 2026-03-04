import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const ChartsScene = () => {
    const group = useRef<THREE.Group>(null);
    const barsRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.elapsedTime * 0.15;
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1 + 0.2;
        }

        if (barsRef.current) {
            barsRef.current.children.forEach((child, i) => {
                const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2;
                child.scale.y = scale;
            });
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
            <group ref={group} scale={[0.8, 0.8, 0.8]} position={[0, -0.5, 0]}>

                {/* Grid Base */}
                <gridHelper args={[6, 10, "#1976d2", "#e2e8f0"]} position={[0, -0.1, 0]} />

                {/* Bar Chart */}
                <group ref={barsRef} position={[-1, 0, 0]}>
                    <Box args={[0.6, 1, 0.6]} position={[-1, 0.5, 0]}>
                        <meshStandardMaterial color="#1976d2" />
                    </Box>
                    <Box args={[0.6, 2, 0.6]} position={[0, 1, 0]}>
                        <meshStandardMaterial color="#9c27b0" />
                    </Box>
                    <Box args={[0.6, 1.5, 0.6]} position={[1, 0.75, 0]}>
                        <meshStandardMaterial color="#2e7d32" />
                    </Box>
                    <Box args={[0.6, 2.5, 0.6]} position={[2, 1.25, 0]}>
                        <meshStandardMaterial color="#ff9800" />
                    </Box>
                </group>

                {/* Floating Line Chart */}
                <group position={[-1.5, 3, -1]}>
                    {[[-1, 0, 0], [0, 1, 0], [1, 0.5, 0], [2, 1.5, 0], [3, 0.8, 0]].map((point, i, arr) => {
                        if (i === 0) return null;
                        const prev = arr[i - 1];
                        // Simple visual approximation without complex math
                        return (
                            <mesh key={i} position={[point[0] - 0.5, point[1] - (point[1] - prev[1]) / 2, 0]}>
                                <sphereGeometry args={[0.15]} />
                                <meshStandardMaterial color="#d32f2f" />
                            </mesh>
                        );
                    })}
                </group>

                {/* Floating Pie Chart element */}
                <Cylinder args={[0.8, 0.8, 0.2, 32, 1, false, 0, Math.PI * 1.5]} position={[2, 1.5, 2]} rotation={[0.5, -0.5, 0]}>
                    <meshStandardMaterial color="#1976d2" />
                </Cylinder>
                <Cylinder args={[0.8, 0.8, 0.2, 32, 1, false, Math.PI * 1.5, Math.PI * 0.5]} position={[2.1, 1.5, 2.1]} rotation={[0.5, -0.5, 0]}>
                    <meshStandardMaterial color="#ff9800" />
                </Cylinder>

            </group>
        </Float>
    );
};

export default ChartsScene;
