import { useCallback, useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";

export function MovingImageByScroll() {
    const { scrollYProgress } = useScroll();
    const [image1Position, setImage1Position] = useState(0);
    const [image2Position, setImage2Position] = useState(0);
    const [imageSize, setImageSize] = useState(100);

    const updateImage1Position = useCallback(() => {
        // - (1/2) * window.innerWidth ~ (3/2) * window.innerWidth
        const tmpPosition = 2 * scrollYProgress.get() * window.innerWidth - (1 / 2) * window.innerWidth;
        setImage1Position(tmpPosition);
    }, [setImage1Position]);

    const updateImage2Position = useCallback(() => {
        // - window.innerWidth ~ 2 * window.innerWidth
        const tmpPosition = 3 * scrollYProgress.get() * window.innerWidth - window.innerWidth;
        setImage2Position(tmpPosition);
    }, [setImage2Position]);

    useEffect(() => {
        updateImage1Position();

        window.addEventListener("scroll", updateImage1Position);
        window.addEventListener("scroll", updateImage2Position);

        return () => {
            window.removeEventListener("scroll", updateImage1Position);
            window.removeEventListener("scroll", updateImage2Position);
        };
    }, [scrollYProgress]);

    return (
        <>
            <div style={{ height: "300vh" }}>
                <motion.div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "10px",
                        background: "",
                        transformOrigin: "0%",
                        scaleX: scrollYProgress,
                    }}
                />
                <h1>画面のちょうど真ん中でうさぎがカメを追い越すように動きます</h1>
                <img
                    src="tortoise.png"
                    style={{
                        height: `${imageSize}px`,
                        width: `${imageSize}px`,
                        position: "fixed",
                        bottom: 0,
                        right: image1Position,
                    }}
                    alt="tortoise"
                />
                <img
                    src="rabbit.png"
                    style={{
                        height: `${imageSize}px`,
                        width: `${imageSize}px`,
                        position: "fixed",
                        bottom: 0,
                        right: image2Position,
                    }}
                    alt="rabbit"
                />
            </div>
        </>
    );
}
