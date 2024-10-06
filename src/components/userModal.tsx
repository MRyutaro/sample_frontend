import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { auth } from "../firebase";

import { themeAtom } from "../atoms/themeAtom";
import { userAtom } from "../atoms/userAtom";

export function UserModal(): JSX.Element {
	const user = useAtomValue(userAtom);
	const [theme, setTheme] = useAtom(themeAtom);

	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			{/* Avatarアイコン */}
			<Avatar
				alt={user?.displayName || ""}
				src={user?.photoURL || ""}
				onClick={handleOpen}
				sx={{
					position: "fixed",
					top: 10,
					right: 10,
					width: 40,
					height: 40,
					cursor: "pointer",
					zIndex: 1000,
				}}
			/>

			{/* モーダル */}
			<Modal
				open={open}
				onClose={handleClose} // モーダル外をクリックすると閉じる
				aria-labelledby="user-modal-title"
				aria-describedby="user-modal-description"
			>
				<Box
					sx={{
						position: "absolute",
						top: 50,
						right: 10,
						width: "100%", // 100%に設定
						maxWidth: "200px", // 最大200px
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
						// 縦並び
						display: "flex",
						flexDirection: "column",
					}}
				>
					{/* モーダルの内容 */}
					<Typography id="user-modal-title" variant="h6" component="h2">
						ユーザ情報
					</Typography>
					<Typography id="user-modal-description" sx={{ mt: 2 }}>
						名前: {user?.displayName || "No Name"}
					</Typography>
					<Typography sx={{ mt: 1 }}>Email: {user?.email || "No Email"}</Typography>
					<Button
						variant="contained"
						color="error"
						onClick={() => {
							auth.signOut();
						}}
					>
						ログアウト
					</Button>
					<Divider sx={{ mt: 2, mb: 2 }} />
					<Typography id="user-modal-title" variant="h6" component="h2">
						設定
					</Typography>
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							setTheme(theme === "light" ? "dark" : "light");
						}}
					>
						{theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
					</Button>
				</Box>
			</Modal>
		</>
	);
}
