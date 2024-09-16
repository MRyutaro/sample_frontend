import { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Link } from "react-router-dom";
import { Avatar, Container } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MDEditor from "@uiw/react-md-editor";
import { useAtom } from "jotai";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "./firebase";
import {
    Boxes,
    RotatingBoxes,
    RotatingCards,
    HeartBeat,
    ProgressBar,
    HorizontalScroll,
    HorizontalScrollStop,
    MovingImageByScroll,
    CarWindow,
    CarWindowHorizontalScrollStop,
} from "./pages";
import { userAtom } from "./atoms/userAtom";

function Layout() {
    return (
        <div
            style={{
                height: "100%",
                width: "100%",
            }}
        >
            <Link
                to="/"
                style={{
                    textDecoration: "none",
                    color: "black",
                }}
            >
                <HomeIcon
                    sx={{
                        fontSize: 40,
                        position: "fixed",
                        top: 10,
                        left: 10,
                        cursor: "pointer",
                        zIndex: 1000,
                    }}
                />
            </Link>
            <Outlet />
        </div>
    );
}

function IndexPage() {
    const [value, setValue] = useState<string>("**Markdown**");
    const [user, setUser] = useAtom(userAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false);
        });

        // クリーンアップ関数でリスナーを解除
        return () => unsubscribe();
    }, [auth]);

    const handleLogin = useCallback((e: any) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorCode + " " + errorMessage);
            });
    }, []);

    return (
        <Container>
            <h1>フロントエンドのサンプル集</h1>
            <ul>
                <li>
                    <Link to="/boxes">3Dのボックス</Link>
                </li>
                <li>
                    <Link to="/rotating-boxes">ボックスの回転</Link>
                </li>
                <li>
                    <Link to="/rotating-cards">カードの回転</Link>
                </li>
                <li>
                    <Link to="/heart-beat">心臓の拍動</Link>
                </li>
                <li>
                    <Link to="/progress-bar">プログレスバー</Link>
                </li>
                <li>
                    <Link to="/horizontal-scroll">横スクロール</Link>
                </li>
                <li>
                    <Link to="/horizontal-scroll-stop">横スクロール中に縦スクロールを止める</Link>
                </li>
                <li>
                    <Link to="/moving-image-by-scroll">スクロール量に応じて画像を動かす</Link>
                </li>
                <li>
                    <Link to="/car-window">車窓</Link>
                </li>
            </ul>
            {loading ? (
                <p>loading...</p>
            ) : user ? (
                <></>
            ) : (
                <div
                    style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                    }}
                >
                    <form onSubmit={handleLogin}>
                        <div>
                            <input name="email" type="email" placeholder="email" />
                        </div>
                        <div>
                            <input name="password" type="password" placeholder="password" />
                        </div>
                        <div>
                            <button>ログイン</button>
                        </div>
                    </form>
                </div>
            )}

            {user && (
                <>
                    <MDEditor value={value} height="100%" onChange={(value) => setValue(value || "")} />
                    <button
                        onClick={() => {
                            auth.signOut();
                        }}
                        style={{
                            marginTop: "20px",
                            marginBottom: "20px",
                        }}
                    >
                        ログアウト
                    </button>
                </>
            )}
        </Container>
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
                    <Route path="/car-window-horizontal-scroll-stop" element={<CarWindowHorizontalScrollStop />} />
                </Route>
            </Routes>
        </Router>
    );
}
