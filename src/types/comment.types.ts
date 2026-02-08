// Типы для комментариев

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  parentId?: string; // для вложенных комментариев
  likes: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CommentFormData {
  postId: string;
  content: string;
  parentId?: string;
}
