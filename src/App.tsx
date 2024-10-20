import { Block, BlockNoteEditor, PartialBlock, locales, BlockNoteSchema, defaultBlockSpecs, insertOrUpdateBlock, filterSuggestionItems } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { SuggestionMenuController, getDefaultReactSlashMenuItems, useCreateBlockNote } from "@blocknote/react";

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

// これがBlockNoteのカスタム用のコンポーネント
import { RiAlertFill } from "react-icons/ri";
import { Alert } from "./components/Alert";

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

async function saveToFirebase(jsonBlocks: any) {
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

const schema = BlockNoteSchema.create({
    blockSpecs: {
        // Adds all default blocks.
        ...defaultBlockSpecs,
        // Adds the Alert block.
        alert: Alert,
    },
});

// Slash menu item to insert an Alert block
const insertAlert = (editor: typeof schema.BlockNoteEditor) => ({
    key: "alert",
    title: "アラート",
    subtext: "アラートを追加します",
    onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "alert",
        });
    },
    aliases: ["alert", "notification", "emphasize", "warning", "error", "info", "success"],
    group: "基本ブロック",
    icon: <RiAlertFill size={18} />,
});

function IndexPage() {
    const [user, setUser] = useAtom(userAtom);
    const theme = useAtomValue(themeAtom);
    const [loading, setLoading] = useState(true);
    const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined | "loading">("loading");
    const [saveStatus, setSaveStatus] = useState<"hidden" | "unsaved" | "saving" | "saved">("hidden"); // 保存状態を管理
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null); // タイマーを管理するためのuseRef
    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null); // メッセージを表示するためのタイマー

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
            // 引数一覧 -> https://www.blocknotejs.org/docs/editor-basics/setup
            return BlockNoteEditor.create({
                initialContent: initialContent,
                dictionary: locales.ja,
                schema: schema,
            });
        }
    }, [initialContent]);

    const handleEditorChange = () => {
        if (!editor) {
            return; // editorがundefinedの場合は処理を中断
        }

        // 保存状態を「未保存」に設定
        setSaveStatus("unsaved");

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current); // 既存のタイマーをクリア
        }

        // N秒後に保存処理を実行
        saveTimeoutRef.current = setTimeout(() => {
            if (editor) {
                // 保存中にステータスを更新
                setSaveStatus("saving");
                saveToFirebase(editor.document).then(() => {
                    // 保存が完了したら「保存済み」に変更
                    setSaveStatus("saved");

                    // 一定時間後に保存メッセージを非表示
                    if (messageTimeoutRef.current) {
                        clearTimeout(messageTimeoutRef.current);
                    }

                    // N秒後にメッセージを非表示
                    messageTimeoutRef.current = setTimeout(() => {
                        setSaveStatus("hidden");
                    }, 1000);
                });
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
                        style={{
                            height: "60px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {saveStatus === "unsaved" && <span>未保存</span>}
                        {saveStatus === "saving" && <span>保存中...</span>}
                        {saveStatus === "saved" && <span>保存済み</span>}
                        {saveStatus === "hidden" && <span></span>}
                    </div>
                    <BlockNoteView editor={editor} onChange={handleEditorChange} theme={theme} slashMenu={false}>
                        <SuggestionMenuController
                            triggerCharacter={"/"}
                            getItems={async (query) => {
                                // Gets all default slash menu items
                                const defaultItems = getDefaultReactSlashMenuItems(editor);

                                const insertPosition = 7; // N番目に挿入する
                                const allItems = [
                                    ...defaultItems.slice(0, insertPosition), // 0番目からN番目のアイテムを追加
                                    insertAlert(editor), // N番目にinsertAlertを挿入
                                    ...defaultItems.slice(insertPosition), // N番目から最後までのアイテムを追加
                                ];

                                // Log the combined items to the console
                                console.log("Combined Items (Default + InsertAlert):", allItems);

                                // Return the filtered suggestion items
                                return filterSuggestionItems(allItems, query);
                            }}
                        />
                    </BlockNoteView>
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
