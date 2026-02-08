export type UserRole = 'viewer' | 'author' | 'admin';

export interface User {
  id?: string;
  role: UserRole;
  name: string;
}

export interface RolePermissions {
  canViewPosts: boolean;
  canCreatePosts: boolean;
  canEditPosts: boolean;
  canDeletePosts: boolean;
  canManageTags: boolean;
  canManageComments: boolean;
  canAccessAdmin: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  viewer: {
    canViewPosts: true,
    canCreatePosts: false,
    canEditPosts: false,
    canDeletePosts: false,
    canManageTags: false,
    canManageComments: false,
    canAccessAdmin: false,
  },
  author: {
    canViewPosts: true,
    canCreatePosts: true,
    canEditPosts: true,
    canDeletePosts: true,
    canManageTags: false,
    canManageComments: false,
    canAccessAdmin: true,
  },
  admin: {
    canViewPosts: true,
    canCreatePosts: true,
    canEditPosts: true,
    canDeletePosts: true,
    canManageTags: true,
    canManageComments: true,
    canAccessAdmin: true,
  },
};
