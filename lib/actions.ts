"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "./db"
import { uploadImageToBlob } from "./blob"
import type { Photo, Comment, CommentFormData } from "./types"

// 写真一覧を取得
export async function getPhotos(): Promise<Photo[]> {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        comments: true,
      },
    })

    return photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      title: photo.title,
      description: photo.description || undefined,
      createdAt: photo.createdAt.toISOString(),
      comments: photo.comments.map((comment) => ({
        id: comment.id,
        photoId: comment.photoId,
        name: comment.name,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      })),
    }))
  } catch (error) {
    console.error("写真の取得に失敗しました", error)
    return []
  }
}

// IDで写真を取得
export async function getPhotoById(id: string): Promise<Photo | null> {
  try {
    const photo = await prisma.photo.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    })

    if (!photo) return null

    return {
      id: photo.id,
      url: photo.url,
      title: photo.title,
      description: photo.description || undefined,
      createdAt: photo.createdAt.toISOString(),
      comments: photo.comments.map((comment) => ({
        id: comment.id,
        photoId: comment.photoId,
        name: comment.name,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      })),
    }
  } catch (error) {
    console.error("写真の取得に失敗しました", error)
    return null
  }
}

// 写真をアップロード
export async function uploadPhoto(formData: FormData): Promise<string> {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const file = formData.get("file") as File

    if (!file) {
      throw new Error("ファイルが選択されていません")
    }

    // Vercel Blob に画像をアップロード
    const imageUrl = await uploadImageToBlob(file)

    // データベースに写真情報を保存
    const photo = await prisma.photo.create({
      data: {
        title: title || "無題",
        description: description || null,
        url: imageUrl,
      },
    })

    revalidatePath("/")
    return photo.id
  } catch (error) {
    console.error("写真のアップロードに失敗しました", error)
    throw new Error("写真のアップロードに失敗しました")
  }
}

// コメントを追加
export async function addComment(photoId: string, commentData: CommentFormData): Promise<Comment> {
  try {
    const comment = await prisma.comment.create({
      data: {
        name: commentData.name,
        content: commentData.content,
        photoId: photoId,
      },
    })

    revalidatePath(`/photos/${photoId}`)

    return {
      id: comment.id,
      photoId: comment.photoId,
      name: comment.name,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    }
  } catch (error) {
    console.error("コメントの追加に失敗しました", error)
    throw new Error("コメントの追加に失敗しました")
  }
}

// 写真を削除
export async function deletePhoto(id: string): Promise<void> {
  try {
    await prisma.photo.delete({
      where: { id },
    });
    revalidatePath("/");
  } catch (error) {
    console.error("写真の削除に失敗しました", error);
    throw new Error("写真の削除に失敗しました");
  }
}