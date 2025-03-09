import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { CommentSection } from "@/components/comment-section"
import { ShareButton } from "@/components/share-button"
import { getPhotoById } from "@/lib/actions"

export default async function PhotoPage({
  params,
}: {
  params: { id: string }
}) {
  const photo = await getPhotoById(params.id)

  if (!photo) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          ホームに戻る
        </Button>
      </Link>

      <Card className="overflow-hidden">
        <div className="relative aspect-video md:aspect-[16/9] w-full">
          <Image
            src={photo.url || "/placeholder.svg"}
            alt={photo.title || "写真"}
            fill
            className="object-contain"
            priority
          />
        </div>

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{photo.title || "無題"}</h1>
              <p className="text-muted-foreground text-sm">{new Date(photo.createdAt).toLocaleDateString("ja-JP")}</p>
            </div>
            <ShareButton id={photo.id} />
          </div>

          {photo.description && <p className="mt-4 mb-6">{photo.description}</p>}

          <CommentSection photoId={photo.id} initialComments={photo.comments} />
        </CardContent>
      </Card>
    </div>
  )
}

