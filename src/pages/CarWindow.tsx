export function CarWindow() {
    return (
        <>
            <h1>車窓みたいなやつ</h1>
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    background: "white",
                    // clip-pathで円形にクリッピング
                    clipPath: "circle(150px)",
                    inset: 0,
                    margin: "auto",
                }}
            >
                <img
                    src="water_00001.jpg"
                    style={{
                        width: "100%",
                        height: "100vh",
                        position: "fixed", // ここ消すとうつらなくなる
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
                    background: "white",
                    // clip-pathで矩形にクリッピング
                    // insetはpaddingのようなもの
                    // 数字を大きくすると画像が小さくなる
                    clipPath: "inset(200px 200px 200px 200px)",
                    inset: 0,
                    margin: "auto",
                }}
            >
                <img
                    src="water_00001.jpg"
                    style={{
                        width: "100%",
                        height: "100vh",
                        position: "fixed", // ここ消すとうつらなくなる
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
                    background: "white",
                    // clip-pathで矩形にクリッピング
                    clipPath: "polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)",
                    inset: 0,
                    margin: "auto",
                }}
            >
                <img
                    src="water_00001.jpg"
                    style={{
                        width: "100%",
                        height: "100vh",
                        position: "fixed", // ここ消すとうつらなくなる
                        top: 0,
                        left: 0,
                    }}
                    alt="water"
                />
            </div>
        </>
    );
}
