"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check } from "lucide-react"

interface ShareButtonProps {
  id: string
}

export function ShareButton({ id }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/photos/${id}` : `/photos/${id}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("クリップボードへのコピーに失敗しました", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          共有
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>写真を共有</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <Input value={shareUrl} readOnly className="flex-1" />
          <Button size="sm" onClick={handleCopy} variant="secondary">
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "コピー済み" : "コピー"}
          </Button>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">このリンクを共有すると、誰でもこの写真を見ることができます。</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

