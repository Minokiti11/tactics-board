export interface Photo {
  id: string
  url: string
  title: string
  description?: string
  createdAt: string
  comments?: Comment[]
  likes: Like[]
  isLiked?: boolean
  likeCount: number
}

export interface Comment {
  id: string
  photoId: string
  name: string
  content: string
  createdAt: string
}

export interface Like {
  id: string
  clientId: string
  photoId: string
  createdAt: string
}

export interface PhotoFormData {
  title: string
  description?: string
  file: File
}

export interface CommentFormData {
  name: string
  content: string
}

