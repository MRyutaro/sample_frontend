import { Block, BlockNoteEditor, PartialBlock, locales } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { Container } from "@mui/material";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Outlet, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { themeAtom } from "./atoms/themeAtom";
import { userAtom } from "./atoms/userAtom";
import { Menu } from "./components/menu";
import { UserModal } from "./components/userModal";
import { auth, database, get, ref, set } from "./firebase";
import {
    Boxes,
    CarWindow,
    CarWindowHorizontalScrollStop,
    HeartBeat,
    HorizontalScroll,
    HorizontalScrollStop,
    MovingImageByScroll,
    ProgressBar,
    RotatingBoxes,
    RotatingCards,
} from "./pages";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "./styles/App.css";

function Layout() {
    return (
        <div
            style={{
                height: "100%",
                width: "100%",
            }}
        >
            <Menu />
            <UserModal />
            <Outlet />
        </div>
    );
}

async function saveToFirebase(jsonBlocks: Block[]) {
    try {
        // Firebaseのデータベース参照を取得
        const contentRef = ref(database, "editorContent");
        // Firebaseにデータを保存
        await set(contentRef, JSON.stringify(jsonBlocks));
        console.log("Data saved to Firebase successfully");
    } catch (error) {
        console.error("Error saving data to Firebase:", error);
    }
}

async function loadFromFirebase() {
    try {
        // Firebaseのデータベース参照を取得
        const contentRef = ref(database, "editorContent");
        // Firebaseからデータを取得
        const snapshot = await get(contentRef);
        if (snapshot.exists()) {
            // jsonに変換して保存、読み込むときにパースするという処理にしないと以下のエラーが出た
            // Error creating document from blocks passed as `initialContent`: NaN
            const jsonBlocks = JSON.parse(snapshot.val());
            return jsonBlocks as PartialBlock[];
        } else {
            console.log("No data available");
            return undefined;
        }
    } catch (error) {
        console.error("Error loading data from Firebase:", error);
        return undefined;
    }
}

function IndexPage() {
    const [user, setUser] = useAtom(userAtom);
    const theme = useAtomValue(themeAtom);
    const [loading, setLoading] = useState(true);
    const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined | "loading">("loading");
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null); // タイマーを管理するためのuseRef

    // ログイン状態の初期化
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    const handleLogin = useCallback((e: any) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        signInWithEmailAndPassword(auth, email, password).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + " " + errorMessage);
        });
    }, []);

    useEffect(() => {
        loadFromFirebase().then((content: PartialBlock[] | undefined) => {
            setInitialContent(content);
        });
    }, []);

    const editor = useMemo(() => {
        if (initialContent === "loading") {
            return undefined;
        } else {
            return BlockNoteEditor.create({
                initialContent: initialContent,
                dictionary: locales.ja,
            });
        }
    }, [initialContent]);

	const handleEditorChange = () => {
		if (!editor) {
			return; // editorがundefinedの場合は処理を中断
		}
	
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current); // 既存のタイマーをクリア
		}
		// N秒間更新がなければ保存
		saveTimeoutRef.current = setTimeout(() => {
			if (editor) { // 再度editorがundefinedでないか確認
				saveToFirebase(editor.document); // 保存処理
			}
		}, 2000);
	};

    if (editor === undefined) {
        return "Loading content...";
    }

    return (
        <Container>
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
					<div
						id="spacer"
						style={{
							height: "60px",
						}}
					></div>
                    <BlockNoteView
                        editor={editor}
                        onChange={handleEditorChange}
                        theme={theme}
                    />
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
