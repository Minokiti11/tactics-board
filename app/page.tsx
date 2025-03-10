import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PhotoGallery } from "@/components/photo-gallery"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Nature Photos Sharing App</h1>
        <p className="text-muted-foreground mb-6">ログイン不要で簡単に写真を共有・コメントできるサービス</p>
        <Link href="/upload">
          <Button size="lg" className="font-medium">
            写真をアップロード
          </Button>
        </Link>
      </header>

      <main>
        <h2 className="text-2xl font-semibold mb-4">みんなの写真</h2>
        <PhotoGallery />
      </main>
    </div>
  )
}

