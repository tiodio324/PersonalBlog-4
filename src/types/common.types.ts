import { ReactNode } from 'react';

export interface FilterParams { 
  tagId?: string; 
  categoryId?: string;
  postId?: string;
  search?: string; 
  published?: boolean; 
  approved?: boolean; 
}
export interface ApiResponse<T> { data: T; success: boolean; message?: string; }

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  mode: 'view' | 'create' | 'edit' | 'delete';
}

// Select option type
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

// Table column definition
export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  width?: string | number;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}
