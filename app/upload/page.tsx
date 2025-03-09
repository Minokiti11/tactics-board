import Link from "next/link"
import { UploadForm } from "@/components/upload-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          ホームに戻る
        </Button>
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">写真をアップロード</h1>
        <p className="text-muted-foreground">あなたの写真を共有しましょう。ログイン不要です。</p>
      </div>

      <UploadForm />
    </div>
  )
}

