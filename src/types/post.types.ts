// Типы для постов блога

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categoryId: string;
  authorId: string;
  tagIds: string[];
  coverImage?: string;
  views: number;
  likes: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categoryId: string;
  tagIds: string[];
  coverImage?: string;
  isPublished: boolean;
}

export interface PostFilters {
  categoryId?: string;
  authorId?: string;
  tagId?: string;
  isPublished?: boolean;
  search?: string;
}
