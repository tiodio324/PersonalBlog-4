export type PageId = 'home' | 'posts' | 'tags' | 'admin' | 'admin-posts' | 'admin-comments' | 'admin-tags';

export interface PageConfig {
  id: PageId;
  title: string;
  icon: string;
  requiresAuth: boolean;
  requiredRole?: 'author' | 'admin';
  showInNav: boolean;
  parentId?: PageId;
}

export interface NavigationItem {
  id: PageId;
  title: string;
  icon: string;
  isActive: boolean;
}

export const PAGES_CONFIG: Record<PageId, PageConfig> = {
  home: { id: 'home', title: 'Главная', icon: 'home', requiresAuth: false, showInNav: true },
  posts: { id: 'posts', title: 'Статьи', icon: 'file-text', requiresAuth: false, showInNav: true },
  tags: { id: 'tags', title: 'Теги', icon: 'tag', requiresAuth: false, showInNav: true },
  admin: { id: 'admin', title: 'Управление', icon: 'settings', requiresAuth: true, requiredRole: 'author', showInNav: true },
  'admin-posts': { id: 'admin-posts', title: 'Статьи', icon: 'file-text', requiresAuth: true, requiredRole: 'author', showInNav: false, parentId: 'admin' },
  'admin-comments': { id: 'admin-comments', title: 'Комментарии', icon: 'message-circle', requiresAuth: true, requiredRole: 'author', showInNav: false, parentId: 'admin' },
  'admin-tags': { id: 'admin-tags', title: 'Теги', icon: 'tag', requiresAuth: true, requiredRole: 'author', showInNav: false, parentId: 'admin' },
};
