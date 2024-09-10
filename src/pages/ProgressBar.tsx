import { motion, useScroll } from "framer-motion";

export function ProgressBar() {
    const { scrollYProgress } = useScroll();

    return (
        <>
            <div style={{ height: "300vh", overflow: "scroll" }}>
                <motion.div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "10px",
                        background: "red",
                        transformOrigin: "0%",
                        scaleX: scrollYProgress,
                    }}
                />
                スクロールしてください
            </div>
        </>
    );
}
