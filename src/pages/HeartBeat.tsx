import { useCallback, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function HeartbeatSphere() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const clock = new THREE.Clock();

    const getScale = useCallback((elapsedTime: number) => {
        // 鼓動の周期
        const beatPeriod = 1.2;
        // sin関数の周波数
        const sinFrequency = 8;

        const left = beatPeriod / 2 - (1 * Math.PI) / sinFrequency;
        const right = beatPeriod / 2 + (1 * Math.PI) / sinFrequency;
        const x = elapsedTime % beatPeriod;
        if (left < x && x < right) {
            // sinc関数
            return 1 + (0.001 * Math.sin(sinFrequency * Math.PI * (x - beatPeriod / 2))) / (x - beatPeriod / 2);
        } else {
            return 1;
        }
    }, []);

    useFrame(() => {
        if (meshRef.current) {
            const elapsedTime = clock.getElapsedTime();
            const scale = getScale(elapsedTime);
            meshRef.current.scale.set(scale, scale, scale);
            // meshRef.current.rotation.y += 0.002; // y軸周りに回転
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <sphereGeometry args={[2.5, 32, 32]} />
            {/* meshNormalMaterialにすると法線を元に色を付けるためカラフルな球になる */}
            {/* 1色にしたければmeshStandardMaterialを使う */}
            {/* wireframeを有効にするとエッジだけ表示される */}
            <meshNormalMaterial wireframe />
        </mesh>
    );
}

export function HeartBeat() {
    return (
        <>
            <Canvas
                style={{
                    width: "100vw",
                    height: "100vh",
                }}
            >
                <HeartbeatSphere />
            </Canvas>
        </>
    );
}
