export interface Photo {
  id: string
  url: string
  title: string
  description?: string
  createdAt: string
  comments?: Comment[]
}

export interface Comment {
  id: string
  photoId: string
  name: string
  content: string
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

