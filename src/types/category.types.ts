// Типы для категорий блога

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon?: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon?: string;
}
