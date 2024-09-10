import { useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";

function Box(props: ThreeElements["mesh"]) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    useFrame((_, delta) => {
        // useFrameを使えばアニメーションを設定できる
        // 参考: https://r3f.docs.pmnd.rs/api/hooks#useframe
        meshRef.current.rotation.x += 0.02;
        meshRef.current.rotation.y += 0.02;
    });

    return (
        <>
            <mesh
                {...props}
                ref={meshRef}
                scale={active ? 1.5 : 1}
                onClick={(event) => setActive(!active)}
                onPointerOver={(event) => setHover(true)}
                onPointerOut={(event) => setHover(false)}
            >
                {/* オブジェクトの形状 */}
                <boxGeometry args={[1, 1, 1]} />
                {/* オブジェクトのマテリアル */}
                <meshStandardMaterial color={hovered ? "hotpink" : "#2f74c0"} />
                {/* エッジ（ボーダー部分） */}
                <lineSegments>
                    {meshRef.current && <edgesGeometry args={[meshRef.current.geometry]} />}
                    <lineBasicMaterial color="white" />
                </lineSegments>
            </mesh>
        </>
    );
}

export function RotatingBoxes() {
    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
        </Canvas>
    );
}
