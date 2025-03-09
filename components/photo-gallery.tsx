"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Share2 } from "lucide-react"
import { getPhotos } from "@/lib/actions"
import type { Photo } from "@/lib/types"

export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPhotos() {
      try {
        const loadedPhotos = await getPhotos()
        setPhotos(loadedPhotos)
      } catch (error) {
        console.error("写真の読み込みに失敗しました", error)
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
          </Card>
        ))}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">まだ写真がありません</p>
        <Link href="/upload">
          <span className="text-primary hover:underline">最初の写真をアップロードしましょう</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo) => (
        <Link key={photo.id} href={`/photos/${photo.id}`}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square relative">
              <Image
                src={photo.url || "/placeholder.svg"}
                alt={photo.title || "写真"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium truncate">{photo.title || "無題"}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-2">
                <div className="flex items-center mr-4">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>{photo.comments?.length || 0}</span>
                </div>
                <div className="flex items-center">
                  <Share2 className="h-4 w-4 mr-1" />
                  <span>共有</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

