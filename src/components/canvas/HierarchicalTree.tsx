import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

const HierarchicalTree = () => {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    // Simple node visualization
    const Node = ({ position, color, label }: { position: [number, number, number], color: string, label: string }) => (
        <group position={position}>
            <mesh>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
            </mesh>
            <Text position={[0, 0.5, 0]} fontSize={0.2} color="#333" anchorX="center" anchorY="middle">
                {label}
            </Text>
        </group>
    );

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={group} scale={[0.8, 0.8, 0.8]} position={[0, 0.5, 0]}>
                {/* Root */}
                <Node position={[0, 2, 0]} color="#1976d2" label="Company" />

                {/* Level 1 */}
                <Node position={[-2, 0, 0]} color="#9c27b0" label="Assets" />
                <Node position={[2, 0, 0]} color="#9c27b0" label="Liabilities" />

                {/* Level 2 (Assets) */}
                <Node position={[-3, -2, 1]} color="#2e7d32" label="Bank" />
                <Node position={[-1, -2, -1]} color="#2e7d32" label="Cash" />

                {/* Level 2 (Liabilities) */}
                <Node position={[1, -2, 1]} color="#ff9800" label="Payables" />
                <Node position={[3, -2, -1]} color="#ff9800" label="Loans" />

                {/* Connections */}
                <Line points={[[0, 2, 0], [-2, 0, 0]]} color="#cbd5e1" lineWidth={2} />
                <Line points={[[0, 2, 0], [2, 0, 0]]} color="#cbd5e1" lineWidth={2} />
                <Line points={[[-2, 0, 0], [-3, -2, 1]]} color="#cbd5e1" lineWidth={2} />
                <Line points={[[-2, 0, 0], [-1, -2, -1]]} color="#cbd5e1" lineWidth={2} />
                <Line points={[[2, 0, 0], [1, -2, 1]]} color="#cbd5e1" lineWidth={2} />
                <Line points={[[2, 0, 0], [3, -2, -1]]} color="#cbd5e1" lineWidth={2} />
            </group>
        </Float>
    );
};

export default HierarchicalTree;
