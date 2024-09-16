import { useCallback, useState, useRef } from "react";

export function useMarkdownMemo() {
    const [markdownMemo, setValue] = useState<string | undefined>(undefined);
    const previousMemoRef = useRef<string | undefined>(undefined); // 前回の値を保存するためのRef

    const setMarkdownMemo = useCallback((value: string | undefined) => {
        if (value) {
            setValue(value);
        }
    }, []);

    const uploadMarkdownMemo = useCallback(() => {
        if (markdownMemo !== previousMemoRef.current) {
            // 現在の値と前回の値を比較して異なる場合のみアップロード
            console.log("アップロード開始: ", markdownMemo);
            previousMemoRef.current = markdownMemo; // アップロード後に前回の値を更新
        } else {
            console.log("変更なし: アップロードしません");
        }
    }, [markdownMemo]);

    return { markdownMemo, setMarkdownMemo, uploadMarkdownMemo };
}
