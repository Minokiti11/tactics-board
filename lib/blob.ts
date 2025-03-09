import { put } from "@vercel/blob"

export async function uploadImageToBlob(file: File): Promise<string> {
  try {
    // ファイル名に現在のタイムスタンプを追加して一意にする
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`

    // Vercel Blob にアップロード
    const blob = await put(filename, file, { access: "public" })

    // アップロードされた画像のURLを返す
    return blob.url
  } catch (error) {
    console.error("画像アップロードエラー:", error)
    throw new Error("画像のアップロードに失敗しました")
  }
}

