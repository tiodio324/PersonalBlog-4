// Типы для тегов блога

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  createdAt: string;
  isActive: boolean;
}

export interface TagFormData {
  name: string;
  slug: string;
  color: string;
  description?: string;
}
