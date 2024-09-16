import { useCallback, useState, useRef, useEffect } from "react";
import { database } from '../firebase';
import { ref, set, get } from "firebase/database";

export function useMarkdownMemo() {
    const [markdownMemo, setValue] = useState<string | undefined>(undefined);
    const previousMemoRef = useRef<string | undefined>(undefined);

    // Markdownメモをセットする関数
    const setMarkdownMemo = useCallback((value: string | undefined) => {
        if (value) {
            setValue(value);
        }
    }, []);

    // Firebaseにデータをアップロードする関数
    const uploadMarkdownMemo = useCallback(() => {
        if (markdownMemo && markdownMemo !== previousMemoRef.current) {
            const memoRef = ref(database, `memo/`); // Firebaseのデータベースパスを設定
            set(memoRef, markdownMemo) // Firebaseにデータを保存
                .then(() => {
                    previousMemoRef.current = markdownMemo; // アップロード成功後、前回の値を更新
                })
                .catch((error) => {
                    alert("Failed to upload memo: " + error.message);
                });
        }
    }, [markdownMemo]);

    // Firebaseからデータを取得する処理（コンポーネントマウント時）
    useEffect(() => {
        const memoRef = ref(database, `memo/`);
        get(memoRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setValue(data); // Firebaseから取得したデータをセット
                    previousMemoRef.current = data;
                }
            })
            .catch((error) => {
                console.error("Error fetching memo:", error);
            });
    }, []);

    return { markdownMemo, setMarkdownMemo, uploadMarkdownMemo };
}
