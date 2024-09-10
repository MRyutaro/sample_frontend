import "./App.css";
import { BrowserRouter as Router, Routes, Route, Outlet, Link } from "react-router-dom";

import {
    IndexPage,
    Boxes,
    RotatingBoxes,
    RotatingCards,
    HeartBeat,
    ProgressBar,
    HorizontalScroll,
    HorizontalScrollStop,
    MovingImageByScroll,
    CarWindow,
    Fire,
} from "./pages";

function Layout() {
    return (
        <div
            style={{
                height: "100%",
                width: "100%",
            }}
        >
            <Link to="/">Index</Link>
            {" | "}
            <Link to="/boxes">Boxes</Link>
            {" | "}
            <Link to="/rotating-boxes">Rotating Boxes</Link>
            {" | "}
            <Link to="/rotating-cards">Rotating Cards</Link>
            {" | "}
            <Link to="/heart-beat">HeartBeat</Link>
            {" | "}
            <Link to="/progress-bar">ProgressBar</Link>
            {" | "}
            <Link to="/horizontal-scroll">Horizontal Scroll</Link>
            {" | "}
            <Link to="/horizontal-scroll-stop">Horizontal Scroll Stop</Link>
            {" | "}
            <Link to="/moving-image-by-scroll">Moving Image By Scroll</Link>
            {" | "}
            <Link to="/car-window">Car Window</Link>
            {" | "}
            <Link to="/fire">Fire</Link>
            <Outlet />
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<IndexPage />} />
                    <Route path="/boxes" element={<Boxes />} />
                    <Route path="/rotating-boxes" element={<RotatingBoxes />} />
                    <Route path="/rotating-cards" element={<RotatingCards />} />
                    <Route path="/heart-beat" element={<HeartBeat />} />
                    <Route path="/progress-bar" element={<ProgressBar />} />
                    <Route path="/horizontal-scroll" element={<HorizontalScroll />} />
                    <Route path="/horizontal-scroll-stop" element={<HorizontalScrollStop />} />
                    <Route path="/moving-image-by-scroll" element={<MovingImageByScroll />} />
                    <Route path="/car-window" element={<CarWindow />} />
                    <Route path="/fire" element={<Fire />} />
                </Route>
            </Routes>
        </Router>
    );
}
