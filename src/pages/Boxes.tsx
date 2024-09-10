import { Canvas } from "@react-three/fiber";

export function Boxes() {
    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <mesh position={[0, 0, 0]}>
                {" "}
                {/* オブジェクトの基本単位 */}
                <boxGeometry args={[1, 1, 0]} /> {/* オブジェクトの形状 */}
                <meshStandardMaterial color="red" /> {/* オブジェクトのマテリアル */}
            </mesh>
            <mesh position={[-1.5, 0, 0]}>
                {" "}
                {/* オブジェクトの基本単位 */}
                <boxGeometry args={[1, 1, 0]} /> {/* オブジェクトの形状 */}
                <meshStandardMaterial color="blue" /> {/* オブジェクトのマテリアル */}
            </mesh>
            <mesh position={[1.5, 0, 0]}>
                {" "}
                {/* オブジェクトの基本単位 */}
                <boxGeometry args={[1, 1, 0]} /> {/* オブジェクトの形状 */}
                <meshStandardMaterial color="green" /> {/* オブジェクトのマテリアル */}
            </mesh>
        </Canvas>
    );
}
