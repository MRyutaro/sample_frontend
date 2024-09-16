export function CarWindow() {
    return (
        <>
            <div
                style={{
                    background: "silver",
                }}
            >
                <h1>車窓みたいなやつ</h1>

                <div
                    style={{
                        height: "100vh",
                        // clip-pathで矩形にクリッピング
                        // insetはpaddingのようなもの
                        // 数字を大きくすると画像が小さくなる
                        // 親コンポーネントの外側の部分をinsetでカットしている。だからそのカットした部分はその上の親コンポーネントの背景色が見える
                        clipPath: "inset(200px 200px 200px 200px)",
                        background: "red",
                    }}
                >
                    {/* imgを消すと背景が赤になる */}
                    <img
                        src="water_00001.jpg"
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "fixed", // ここを消すと画像がくっついてくる
                            top: 0,
                            left: 0,
                        }}
                        alt="water"
                    />
                </div>

                <div
                    style={{
                        height: "100vh",
                        position: "relative", // 擬似要素を相対的に配置するために必要
                        clipPath: "inset(200px 200px 200px 200px)",
                        background: "red",
                    }}
                >
                    <img
                        src="water_00001.jpg"
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "fixed",
                            top: 0,
                            left: 0,
                        }}
                        alt="water"
                    />
                    {/* 擬似的にボーダーを追加する */}
                    {/* imgの前にもってくるとボーダーが消える */}
                    <div
                        style={{
                            content: '""',
                            position: "absolute",
                            top: "200px", // クリップされた領域の内側に合わせる
                            left: "200px",
                            right: "200px",
                            bottom: "200px",
                            border: "5px solid black", // ボーダーのスタイル
                        }}
                    />

                </div>

                <div
                    style={{
                        height: "100vh",
                        // clip-pathで円形にクリッピング
                        clipPath: "circle(150px)",
                    }}
                >
                    <img
                        src="water_00001.jpg"
                        style={{
                            width: "100%",
                            height: "100vh",
                            position: "fixed", // ここを消すと画像がくっついてくる
                            top: 0,
                            left: 0,
                        }}
                        alt="water"
                    />
                </div>

                <div
                    style={{
                        height: "100vh",
                        display: "flex",
                        // clip-pathで矩形にクリッピング
                        clipPath: "polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)",
                    }}
                >
                    <img
                        src="water_00001.jpg"
                        style={{
                            width: "100%",
                            height: "100vh",
                            position: "fixed", // ここを消すと画像がくっついてくる
                            top: 0,
                            left: 0,
                        }}
                        alt="water"
                    />
                </div>
            </div>
        </>
    );
}
