import { Block, BlockNoteEditor, PartialBlock, locales } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";

import { Container } from "@mui/material";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
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

	// ログイン状態の初期化
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

		signInWithEmailAndPassword(auth, email, password).catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			alert(errorCode + " " + errorMessage);
		});
	}, []);

	// Loads the previously stored editor contents.
	useEffect(() => {
		loadFromFirebase().then((content: PartialBlock[] | undefined) => {
			setInitialContent(content);
		});
	}, []);

	// Creates a new editor instance.
	// We use useMemo + createBlockNoteEditor instead of useCreateBlockNote so we
	// can delay the creation of the editor until the initial content is loaded.
	const editor = useMemo(() => {
		if (initialContent === "loading") {
			return undefined;
		} else if (initialContent === undefined) {
			console.log("initialContent is undefined");
			return undefined;
		} else {
			return BlockNoteEditor.create({
				initialContent: initialContent,
				dictionary: locales.ja,
			});
		}
	}, [initialContent]);

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
					<BlockNoteView
						editor={editor}
						onChange={() => {
							saveToFirebase(editor.document);
						}}
						theme={theme}
					/>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						{/* {isSaved ? <>保存済み</> : <>未保存</>}
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								uploadMarkdownMemo();
							}}
							style={{
								marginTop: "20px",
							}}
						>
							保存
						</Button> */}
					</div>
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
