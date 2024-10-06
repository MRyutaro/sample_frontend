import MenuIcon from "@mui/icons-material/Menu";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Menu() {
	const [isOpen, setIsOpen] = useState(false);

	// メニューの開閉を切り替える関数
	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	// メニュー以外をクリックしたときにメニューを閉じる
	const handleClickOutside = (event: MouseEvent) => {
		// メニューのボックス外をクリックした場合に閉じる
		if (isOpen && !(event.target as HTMLElement).closest("#menu-box")) {
			setIsOpen(false);
		}
	};

	// イベントリスナーの追加とクリーンアップ
	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<>
			{/* オーバーレイ (メニューが開いているときに表示) */}
			{isOpen && (
				<Box
					sx={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						bgcolor: "rgba(0, 0, 0, 0.5)", // 透明な黒のオーバーレイ
						transition: "opacity 0.3s ease",
						zIndex: 998, // メニューの背面に配置
					}}
				/>
			)}

			{/* メニューが開いている間はホームアイコンを非表示にし、トランジションを追加 */}
			<MenuIcon
				sx={{
					fontSize: 32,
					position: "fixed",
					top: 10,
					left: 10,
					cursor: "pointer",
					zIndex: 997,
					transition: "opacity 0.3s ease",
					opacity: isOpen ? 0 : 1, // 開いているときは非表示
					pointerEvents: isOpen ? "none" : "auto", // メニューが開いている時にクリックできないようにする
                    backgroundColor: "lightgray",
                    borderRadius: "50%",
                    padding: "4px",
				}}
				onClick={toggleMenu} // クリックでメニューの開閉をトグル
			/>

			{/* 左側からスライドするメニュー */}
			<Box
				id="menu-box" // メニューを特定するためのIDを付与
				sx={{
					position: "fixed",
					top: 0,
					left: 0,
					width: isOpen ? "200px" : 0,
					height: "100%",
					bgcolor: "background.paper",
					boxShadow: isOpen ? 3 : 0,
					p: isOpen ? 2 : 0,
					overflowX: "hidden", // 横スクロールを隠す
					transition: "width 0.3s ease",
					zIndex: 999,
				}}
			>
				{isOpen && (
					<>
						{/* メニューのコンテンツ */}
						<Typography variant="h6" component="div">
							フロントエンドのサンプル集
						</Typography>
						<ul>
							<li>
								<Link to="/">ホーム</Link>
							</li>
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
					</>
				)}
			</Box>
		</>
	);
}
