"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "./db"
import { uploadImageToBlob } from "./blob"
import type { Photo, Comment, CommentFormData, Like } from "./types"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// クライアントIDを取得または生成
function getClientId() {
  const cookieStore = cookies()
  let clientId = cookieStore.get("clientId")?.value

  if (!clientId) {
    clientId = uuidv4()
    cookieStore.set("clientId", clientId, {
      maxAge: 60 * 60 * 24 * 365, // 1年間有効
      path: "/",
      sameSite: "strict",
    })
  }

  return clientId
}

// 写真一覧を取得
export async function getPhotos(): Promise<Photo[]> {
  try {
    const clientId = getClientId()
    const photos = await prisma.photo.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        comments: true,
        likes: {
          where: {
            clientId: clientId,
          },
        },
      },
    })

    return photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      title: photo.title,
      description: photo.description || undefined,
      createdAt: photo.createdAt.toISOString(),
      likeCount: photo.likeCount,
      isLiked: photo.likes.length > 0,
      comments: photo.comments.map((comment) => ({
        id: comment.id,
        photoId: comment.photoId,
        name: comment.name,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      })),
      likes: photo.likes.map((like) => ({
        id: like.id,
        clientId: like.clientId,
        photoId: like.photoId,
        createdAt: like.createdAt.toISOString(),
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
    const clientId = getClientId()
    const photo = await prisma.photo.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          where: {
            clientId: clientId,
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
      likeCount: photo.likeCount,
      isLiked: photo.likes.length > 0,
      comments: photo.comments.map((comment) => ({
        id: comment.id,
        photoId: comment.photoId,
        name: comment.name,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      })),
      likes: photo.likes.map((like) => ({
        id: like.id,
        clientId: like.clientId,
        photoId: like.photoId,
        createdAt: like.createdAt.toISOString(),
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
        likeCount: 0,
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

// いいねを追加または削除
export async function toggleLike(photoId: string): Promise<{ isLiked: boolean; likeCount: number }> {
  try {
    const clientId = getClientId()
    console.log(clientId);

    // 既存のいいねを確認
    const existingLike = await prisma.like.findUnique({
      where: {
        clientId_photoId: {
          clientId,
          photoId,
        },
      },
    })

    if (existingLike) {
      // いいねを削除
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      // いいね数を更新
      const updatedPhoto = await prisma.photo.update({
        where: { id: photoId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      })

      revalidatePath(`/photos/${photoId}`)
      revalidatePath("/")

      return {
        isLiked: false,
        likeCount: updatedPhoto.likeCount,
      }
    } else {
      // いいねを追加
      await prisma.like.create({
        data: {
          clientId,
          photoId,
        },
      })

      // いいね数を更新
      const updatedPhoto = await prisma.photo.update({
        where: { id: photoId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      })

      revalidatePath(`/photos/${photoId}`)
      revalidatePath("/")

      return {
        isLiked: true,
        likeCount: updatedPhoto.likeCount,
      }
    }
  } catch (error) {
    console.error("いいねの更新に失敗しました", error)
    throw new Error("いいねの更新に失敗しました")
  }
}
