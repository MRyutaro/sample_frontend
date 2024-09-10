import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";

const cards = [
    {
        title: "Card 1",
        description: "This is a description for card 1",
    },
    {
        title: "Card 2",
        description: "This is a description for card 2",
    },
    {
        title: "Card 3",
        description: "This is a description for card 3",
    },
    {
        title: "Card 4",
        description: "This is a description for card 4",
    },
    {
        title: "Card 5",
        description: "This is a description for card 5",
    },
    {
        title: "Card 6",
        description: "This is a description for card 6",
    },
    {
        title: "Card 7",
        description: "This is a description for card 7",
    },
    {
        title: "Card 8",
        description: "This is a description for card 8",
    },
    {
        title: "Card 9",
        description: "This is a description for card 9",
    },
    {
        title: "Card 10",
        description: "This is a description for card 10",
    },
];

// カードコンポーネント
// containerRef: カードを含むコンテナのref. 親要素の幅を取得するために使用
// transformXPercent: どれだけ移動させるかを0~100%で指定
export function Cards({ containerRef, transformXPercent }: { containerRef: React.RefObject<HTMLDivElement>; transformXPercent: number }) {
    // TODO: ここは関数の外で定義する
    const [cardWidth, setCardWidth] = useState(300); // ボーダーとかも含めたカードの横幅
    const [cardHeight, setCardHeight] = useState(400); // ボーダーとかも含めたカードの縦幅
    const [cardGap, setCardGap] = useState(20);
    const [containerPadding, setContainerPadding] = useState(20);
    const [transformX, setTransformX] = useState(0);

    // useCallbackを使うことで再レンダリング時に関数が再生成されるのを防ぐ。多分。
    const updateTransformX = useCallback(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            const cardCount = cards.length;
            const totalCardWidth = cardWidth * cardCount;
            const totalCardGap = cardGap * (cardCount - 1);
            const totalWidth = totalCardWidth + totalCardGap + containerPadding * 2;
            const maxTransformX = totalWidth - containerWidth;
            setTransformX((maxTransformX * transformXPercent) / 100);
        }
    }, [containerRef, cardWidth, cardGap, containerPadding, transformXPercent]);

    // containerRef, cardWidth, cardGap, containerPadding, transformXPercentが更新されたときに発火する
    useEffect(() => {
        updateTransformX();

        // イベントリスナーとして登録し、リサイズされたときにupdateTransformXが発火するようにする
        window.addEventListener("resize", updateTransformX);

        return () => {
            window.removeEventListener("resize", updateTransformX);
        };
    }, [containerRef, cardWidth, cardGap, containerPadding, transformXPercent]);

    return (
        <div
            style={{
                display: "flex", // flexを使うことで横並びになる
                gap: `${cardGap}px`, // カード間の間隔
                padding: `${containerPadding}px`,
                transform: `translateX(-${transformX}px)`,
                // transition: "transform 0.5s",
            }}
        >
            {cards.map((card, idx) => (
                <div
                    key={idx}
                    style={{
                        // カード内のpaddingとborderの分だけ引いて補正
                        width: `${cardWidth - 40 - 2}px`,
                        height: `${cardHeight - 40 - 2}px`,
                        background: "white",
                        padding: `20px`,
                        border: "1px solid black",
                        borderRadius: "10px",
                    }}
                >
                    <h1>{card.title}</h1>
                    <p>{card.description}</p>
                </div>
            ))}
        </div>
    );
}

export function HorizontalScrollStop() {
    const scrollRef = useRef<HTMLDivElement>(null!);
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        // offsetを使うことでスクロールの開始位置、終了位置を調整できる
        // offset: [0, 1],
    });
    const [transformXPercent, setTransformXPercent] = useState(0);
    const [stickyTop, setStickyTop] = useState(0);

    // scrollYProgressの値に基づいてtransformXPercentを更新
    const updateTransformXPercent = useCallback(() => {
        const progress = scrollYProgress.get();
        // console.log(progress);
        setTransformXPercent(progress * 100);
    }, [scrollYProgress]);

    // scrollYProgressが更新されたときに発火する
    useEffect(() => {
        // スクロール位置に応じてtransformXPercentを更新
        updateTransformXPercent();

        // イベントリスナーとして登録し、スクロールされたときにupdateTransformXPercentが発火するようにする
        // ちなみに、useCallback((event: Event)=>{eventを使った処理})と定義した関数を使いたいときもこの書き方で勝手にevent: Eventの引数を渡してくれるっぽい
        window.addEventListener("scroll", updateTransformXPercent);

        return () => {
            window.removeEventListener("scroll", updateTransformXPercent);
        };
    }, [scrollYProgress]);

    // sticky
    const updateStickyTop = useCallback(() => {
        // console.log(`innerHeight: ${window.innerHeight}`);
        const tmpStickyTop = (window.innerHeight - 400) / 2;
        // console.log(tmpStickyTop);
        setStickyTop(tmpStickyTop);
    }, [setStickyTop]);

    // resizeされた時に発火する
    useEffect(() => {
        updateStickyTop();

        window.addEventListener("resize", updateStickyTop);

        return () => {
            window.removeEventListener("resize", updateStickyTop);
        };
    }, [updateStickyTop]);

    return (
        <>
            <div>
                <div style={{ height: "150vh", background: "tomato" }}></div>
                <div
                    ref={scrollRef}
                    style={{
                        height: "200vh", // ここを大きくすることで、水平スクロール時の速度を遅くすることができる
                        background: "orange",
                        paddingTop: `${stickyTop}px`,
                        paddingBottom: `${stickyTop}px`,
                        contain: "paint", // 水平方向のスクロールバーを非表示にすることができる。
                    }}
                >
                    <div
                        style={{
                            display: "flex", // ここを消すとカードの横幅をCards側で指定しても効かなくなる。どうしてなのかは詳しく調べてない。
                            position: "sticky", // ここが今回の一番のミソ
                            top: `${stickyTop}px`,
                        }}
                    >
                        <Cards containerRef={scrollRef} transformXPercent={transformXPercent} />
                    </div>
                </div>
                <div style={{ height: "150vh", background: "gold" }}></div>
            </div>
        </>
    );
}
