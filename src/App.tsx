import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import HomeIcon from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Avatar, Button, Container } from "@mui/material";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Outlet, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { userAtom } from "./atoms/userAtom";
import { auth } from "./firebase";
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

function Layout() {
	const user = useAtomValue(userAtom);

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
			{user && (
				<Avatar
					alt={user?.displayName || ""}
					src={user?.photoURL || ""}
					sx={{
						position: "fixed",
						top: 10,
						right: 10,
					}}
				/>
			)}
			<Outlet />
		</div>
	);
}

async function saveToStorage(jsonBlocks: Block[]) {
	// Save contents to local storage. You might want to debounce this or replace
	// with a call to your API / database.
	localStorage.setItem("editorContent", JSON.stringify(jsonBlocks));
}

async function loadFromStorage() {
	// Gets the previously stored editor contents.
	const storageString = localStorage.getItem("editorContent");
	return storageString ? (JSON.parse(storageString) as PartialBlock[]) : undefined;
}

function IndexPage() {
	const [user, setUser] = useAtom(userAtom);
	const [loading, setLoading] = useState(true);
	const [theme, setTheme] = useState<"light" | "dark">("light");
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

	// Loads the previously stored editor contents.
	useEffect(() => {
		loadFromStorage().then((content) => {
			setInitialContent(content);
		});
	}, []);

	// Creates a new editor instance.
	// We use useMemo + createBlockNoteEditor instead of useCreateBlockNote so we
	// can delay the creation of the editor until the initial content is loaded.
	const editor = useMemo(() => {
		if (initialContent === "loading") {
			return undefined;
		}
		return BlockNoteEditor.create({ initialContent });
	}, [initialContent]);

	if (editor === undefined) {
		return "Loading content...";
	}
	// =================

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
					<BlockNoteView
						editor={editor}
						onChange={() => {
							saveToStorage(editor.document);
						}}
					/>
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							setTheme(theme === "light" ? "dark" : "light");
						}}
					>
						{theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
					</Button>
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
						<Button
							variant="contained"
							color="error"
							onClick={() => {
								auth.signOut();
							}}
							style={{
								marginTop: "40px",
								marginBottom: "20px",
							}}
						>
							ログアウト
						</Button>
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
