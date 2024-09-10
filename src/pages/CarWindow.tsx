export function CarWindow() {
    return (
        <>
            <h1>Car Window</h1>
            <img
                src="water_00001.jpg"
                style={{
                    width: "100%",
                    height: "100vh",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: -2,
                }}
                alt="water"
            />
            <div
                style={{
                    height: "300vh",
                    display: "flex",
                }}
            >
                <div
                    className="car-window"
                    style={{
                        height: "400px",
                        width: "300px",
                        border: "1px solid black",
                        position: "fixed",
                        left: "0px",
                    }}
                >
                </div>
            </div>
        </>
    );
}
