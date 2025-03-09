"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Comment } from "@/lib/types"
import { addComment } from "@/lib/actions"

interface CommentSectionProps {
  photoId: string
  initialComments?: Comment[]
}

export function CommentSection({ photoId, initialComments = [] }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const displayName = name.trim() || "匿名"
      const comment = await addComment(photoId, {
        name: displayName,
        content: newComment,
      })

      setComments([...comments, comment])
      setNewComment("")
    } catch (error) {
      console.error("コメント投稿エラー:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">コメント ({comments.length})</h2>

      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            まだコメントはありません。最初のコメントを投稿しましょう！
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar>
                <AvatarFallback>{comment.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-medium">{comment.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("ja-JP")}
                  </span>
                </div>
                <p className="mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            placeholder="コメントを入力..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            required
          />
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="名前（任意）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? "送信中..." : "コメントする"}
          </Button>
        </div>
      </form>
    </div>
  )
}

