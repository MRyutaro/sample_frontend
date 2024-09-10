import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";

// カードコンポーネント
function Card({ position, center }: { position: [number, number, number]; center: THREE.Vector3 }) {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame(() => {
        if (meshRef.current) {
            // カードが常に中心を向くように設定
            meshRef.current.lookAt(center);
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <boxGeometry args={[1, 2, 0.1]} />
            <meshStandardMaterial color={"lightblue"} />
        </mesh>
    );
}

// 回転アニメーションの処理を含むコンポーネント
function RotatingGroup({ rotationSpeed }: { rotationSpeed: number }) {
    const groupRef = useRef<THREE.Group>(null!);
    const [center] = useState(() => new THREE.Vector3(0, 0, 0)); // グループの中心

    // useFrame で毎フレーム回転を更新
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += rotationSpeed; // スクロール速度に応じて回転
        }
    });

    // カードを円形に配置する関数
    const createCircularPositions = useCallback((radius: number, count: number) => {
        const positions: [number, number, number][] = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2; // カードの角度を計算
            const x = Math.cos(angle) * radius; // 円周上のx座標
            const z = Math.sin(angle) * radius; // 円周上のz座標
            positions.push([x, 0, z]); // カードのy座標は同じに設定
        }
        return positions;
    }, []);

    const cardPositions = createCircularPositions(3, 8);

    return (
        <group ref={groupRef}>
            {cardPositions.map((pos, idx) => (
                <Card key={idx} position={pos} center={center} />
            ))}
        </group>
    );
}

export function RotatingCards() {
    const [rotationSpeed, setRotationSpeed] = useState(0);

    // スクロールイベントをリッスン
    useEffect(() => {
        let lastTime = performance.now();

        const handleWheel = (event: WheelEvent) => {
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime;

            // スクロール速度を計算
            const speed = event.deltaY / deltaTime;
            setRotationSpeed(speed * 0.01); // 回転速度を調整

            // 次回計算のために時間を更新
            lastTime = currentTime;
        };

        // wheel イベントリスナーを追加
        window.addEventListener("wheel", handleWheel);
        return () => window.removeEventListener("wheel", handleWheel);
    }, []);

    // クリックしたら回転速度を0にする
    useEffect(() => {
        const handleClick = () => {
            setRotationSpeed(0);
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return (
        <>
            <div style={{ height: "100vh", overflow: "hidden" }}>
                <Canvas style={{ position: "fixed", width: "100%", height: "100%" }}>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <RotatingGroup rotationSpeed={rotationSpeed} />
                </Canvas>
            </div>
        </>
    );
}
