"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { uploadPhoto } from "@/lib/actions"

export function UploadForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // 画像ファイルのみ許可
    if (!selectedFile.type.startsWith("image/")) {
      setError("画像ファイルのみアップロードできます")
      return
    }

    // ファイルサイズチェック (10MB以下)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("ファイルサイズは10MB以下にしてください")
      return
    }

    setFile(selectedFile)
    setError(null)

    // プレビュー表示
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("写真を選択してください")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("description", description)

      const photoId = await uploadPhoto(formData)
      router.push(`/photos/${photoId}`)
    } catch (err) {
      console.error("アップロードエラー:", err)
      setError("アップロード中にエラーが発生しました。もう一度お試しください。")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="写真のタイトルを入力"
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">説明（任意）</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="写真の説明を入力"
          rows={3}
          maxLength={500}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">写真</Label>
        {!preview ? (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <Label htmlFor="photo" className="flex flex-col items-center cursor-pointer">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <span className="text-muted-foreground">クリックして写真を選択</span>
              <span className="text-xs text-muted-foreground mt-1">または、ここにドラッグ＆ドロップ</span>
            </Label>
          </div>
        ) : (
          <Card className="relative overflow-hidden">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10 rounded-full"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <Image src={preview || "/placeholder.svg"} alt="プレビュー" fill className="object-contain" />
              </div>
            </CardContent>
          </Card>
        )}
        <p className="text-xs text-muted-foreground">最大ファイルサイズ: 10MB、対応形式: JPG, PNG, GIF</p>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={loading || !file}>
        {loading ? "アップロード中..." : "アップロード"}
      </Button>
    </form>
  )
}

