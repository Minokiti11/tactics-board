"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toggleLike } from "@/lib/actions"

interface LikeButtonProps {
  photoId: string
  initialLikeCount: number
  initialIsLiked: boolean
}

export function LikeButton({ photoId, initialLikeCount, initialIsLiked }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleLike = async () => {
    setIsLoading(true)
    try {
      const result = await toggleLike(photoId)
      setIsLiked(result.isLiked)
      setLikeCount(result.likeCount)
    } catch (error) {
      console.error("いいねの更新に失敗しました", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size="sm"
      onClick={handleToggleLike}
      disabled={isLoading}
      className={isLiked ? "bg-pink-500 hover:bg-pink-600 text-white border-pink-500 mr-2" : "mr-2"}
    >
      <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
      {likeCount}
    </Button>
  )
}

