import { useCallback, useState, useRef, useEffect } from "react";
import { database } from '../firebase'; // Firebaseの設定をインポート
import { ref, set, get } from "firebase/database";

export function useMarkdownMemo() {
    const [markdownMemo, setValue] = useState<string | undefined>(undefined);
    const [isSaved, setIsSaved] = useState<boolean>(true); // 保存済みかどうかを追跡するフラグ
    const previousMemoRef = useRef<string | undefined>(undefined);

    // Markdownメモをセットする関数
    const setMarkdownMemo = useCallback((value: string | undefined) => {
        if (value !== markdownMemo) {
            setValue(value);
            setIsSaved(false); // 変更があった場合は保存フラグをfalseにする
        }
    }, [markdownMemo]);

    // Firebaseにデータをアップロードする関数
    const uploadMarkdownMemo = useCallback(() => {
        if (markdownMemo && markdownMemo !== previousMemoRef.current) {
            const memoRef = ref(database, `memo`); // Firebaseのデータベースパスを設定
            set(memoRef, markdownMemo) // Firebaseにデータを保存
                .then(() => {
                    previousMemoRef.current = markdownMemo; // アップロード成功後、前回の値を更新
                    setIsSaved(true); // 保存が完了したらフラグをtrueにする
                })
                .catch((error) => {
                    alert("Failed to upload memo: " + error.message);
                });
        }
    }, [markdownMemo]);

    // Firebaseからデータを取得する処理（コンポーネントマウント時）
    useEffect(() => {
        const memoRef = ref(database, `memo`);
        get(memoRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setValue(data); // Firebaseから取得したデータをセット
                    previousMemoRef.current = data;
                    setIsSaved(true); // 初期ロード時は保存済みとしてフラグを設定
                }
            })
            .catch((error) => {
                console.error("Error fetching memo:", error);
            });
    }, []);

    return { markdownMemo, isSaved, setMarkdownMemo, uploadMarkdownMemo };
}
