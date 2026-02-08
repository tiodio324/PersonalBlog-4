import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { Post, PostFormData, Comment, CommentFormData, Tag, TagFormData, Category, FilterParams } from '@/types';
import FirebaseService from '@/firebase';
import { authStore } from './AuthStore';

export class DataStore {
  posts: Post[] = [];
  comments: Comment[] = [];
  tags: Tag[] = [];
  categories: Category[] = [];
  
  postsLoading = false;
  commentsLoading = false;
  tagsLoading = false;
  categoriesLoading = false;
  
  error: string | null = null;
  filters: FilterParams = {};

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // === ВЫЧИСЛЯЕМЫЕ СВОЙСТВА ===
  
  get publishedPosts(): Post[] {
    return this.posts.filter(p => p.isActive && p.isPublished);
  }

  get draftPosts(): Post[] {
    return this.posts.filter(p => p.isActive && !p.isPublished);
  }

  get activeTags(): Tag[] {
    return this.tags.filter(t => t.isActive).sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }

  get activeCategories(): Category[] {
    return this.categories.filter(c => c.isActive).sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }

  get approvedComments(): Comment[] {
    return this.comments.filter(c => c.isActive && c.isApproved);
  }

  get pendingComments(): Comment[] {
    return this.comments.filter(c => c.isActive && !c.isApproved);
  }

  get filteredPosts(): Post[] {
    let result = this.publishedPosts;
    
    if (this.filters.tagId) {
      result = result.filter(p => (p.tagIds || []).includes(this.filters.tagId!));
    }
    
    if (this.filters.categoryId) {
      result = result.filter(p => p.categoryId === this.filters.categoryId);
    }
    
    if (this.filters.search) {
      const search = this.filters.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(search) || 
        p.excerpt.toLowerCase().includes(search)
      );
    }
    
    return result.sort((a, b) => 
      new Date(b.publishedAt || b.createdAt).getTime() - 
      new Date(a.publishedAt || a.createdAt).getTime()
    );
  }

  get filteredComments(): Comment[] {
    let result = this.comments.filter(c => c.isActive);
    
    if (this.filters.postId) {
      result = result.filter(c => c.postId === this.filters.postId);
    }
    
    if (this.filters.approved !== undefined) {
      result = result.filter(c => c.isApproved === this.filters.approved);
    }
    
    return result.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  get totalViews(): number {
    return this.posts.reduce((sum, post) => sum + post.views, 0);
  }

  get totalLikes(): number {
    return this.posts.reduce((sum, post) => sum + post.likes, 0);
  }

  // === ПОЛУЧЕНИЕ ПО ID ===
  
  getPostById = (id: string): Post | undefined => {
    return this.posts.find(p => p.id === id);
  };

  getTagById = (id: string): Tag | undefined => {
    return this.tags.find(t => t.id === id);
  };

  getCategoryById = (id: string): Category | undefined => {
    return this.categories.find(c => c.id === id);
  };

  getCommentsForPost = (postId: string): Comment[] => {
    return this.approvedComments.filter(c => c.postId === postId);
  };

  getTagsForPost = (post: Post): Tag[] => {
    return (post.tagIds || [])
      .map(id => this.getTagById(id))
      .filter(Boolean) as Tag[];
  };

  // === ЗАГРУЗКА ДАННЫХ ===
  
  loadAllData = async (): Promise<void> => {
    await Promise.all([
      this.loadPosts(),
      this.loadComments(),
      this.loadTags(),
      this.loadCategories()
    ]);
  };

  loadPosts = async (): Promise<void> => {
    this.postsLoading = true;
    try {
      const data = await FirebaseService.getData<Record<string, Post>>('posts');
      runInAction(() => {
        this.posts = data ? Object.values(data) : [];
        this.postsLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка загрузки постов';
        this.postsLoading = false;
      });
    }
  };

  loadComments = async (): Promise<void> => {
    this.commentsLoading = true;
    try {
      const data = await FirebaseService.getData<Record<string, Comment>>('comments');
      runInAction(() => {
        this.comments = data ? Object.values(data) : [];
        this.commentsLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка загрузки комментариев';
        this.commentsLoading = false;
      });
    }
  };

  loadTags = async (): Promise<void> => {
    this.tagsLoading = true;
    try {
      const data = await FirebaseService.getData<Record<string, Tag>>('tags');
      runInAction(() => {
        this.tags = data ? Object.values(data) : [];
        this.tagsLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка загрузки тегов';
        this.tagsLoading = false;
      });
    }
  };

  loadCategories = async (): Promise<void> => {
    this.categoriesLoading = true;
    try {
      const data = await FirebaseService.getData<Record<string, Category>>('categories');
      runInAction(() => {
        this.categories = data ? Object.values(data) : [];
        this.categoriesLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка загрузки категорий';
        this.categoriesLoading = false;
      });
    }
  };

  // === CRUD ПОСТЫ ===
  
  createPost = async (data: PostFormData): Promise<Post | null> => {
    if (!authStore.canCreatePosts()) return null;
    
    const now = new Date().toISOString();
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    const post: Post = {
      id: uuidv4(),
      ...data,
      coverImage: data.coverImage || '',
      slug,
      authorId: authStore.user.id || '',
      views: 0,
      likes: 0,
      publishedAt: data.isPublished ? now : '',
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
    
    try {
      await FirebaseService.setData(`posts/${post.id}`, post);
      runInAction(() => {
        this.posts.push(post);
      });
      return post;
    } catch (error) {
      return null;
    }
  };

  updatePost = async (id: string, data: Partial<PostFormData>): Promise<boolean> => {
    if (!authStore.canEditPosts()) return false;
    
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    const existingPost = this.posts[index];
    const updates: Partial<Post> = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    if (data.isPublished && !existingPost.isPublished) {
      updates.publishedAt = new Date().toISOString();
    }
    
    try {
      await FirebaseService.updateData(`posts/${id}`, updates);
      runInAction(() => {
        this.posts[index] = { ...this.posts[index], ...updates };
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  deletePost = async (id: string): Promise<boolean> => {
    if (!authStore.canDeletePosts()) return false;
    
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    try {
      await FirebaseService.updateData(`posts/${id}`, { isActive: false });
      runInAction(() => {
        this.posts[index].isActive = false;
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  incrementPostViews = async (id: string): Promise<void> => {
    const index = this.posts.findIndex(p => p.id === id);
    if (index !== -1) {
      const newViews = this.posts[index].views + 1;
      await FirebaseService.updateData(`posts/${id}`, { views: newViews });
      runInAction(() => {
        this.posts[index].views = newViews;
      });
    }
  };

  // === CRUD ТЕГИ ===
  
  createTag = async (data: TagFormData): Promise<Tag | null> => {
    if (!authStore.canManageTags()) return null;
    
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const tag: Tag = {
      id: uuidv4(),
      ...data,
      description: data.description || '',
      slug,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    try {
      await FirebaseService.setData(`tags/${tag.id}`, tag);
      runInAction(() => {
        this.tags.push(tag);
      });
      return tag;
    } catch (error) {
      return null;
    }
  };

  deleteTag = async (id: string): Promise<boolean> => {
    if (!authStore.canManageTags()) return false;
    
    const index = this.tags.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    try {
      await FirebaseService.updateData(`tags/${id}`, { isActive: false });
      runInAction(() => {
        this.tags[index].isActive = false;
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  // === CRUD КОММЕНТАРИИ ===
  
  createComment = async (data: CommentFormData, authorName: string): Promise<Comment | null> => {
    const comment: Comment = {
      id: uuidv4(),
      ...data,
      parentId: data.parentId || '',
      authorId: authStore.user.id || '',
      authorName,
      likes: 0,
      isApproved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
    
    try {
      await FirebaseService.setData(`comments/${comment.id}`, comment);
      runInAction(() => {
        this.comments.push(comment);
      });
      return comment;
    } catch (error) {
      return null;
    }
  };

  approveComment = async (id: string): Promise<boolean> => {
    if (!authStore.canManageComments()) return false;
    
    const index = this.comments.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    try {
      await FirebaseService.updateData(`comments/${id}`, { 
        isApproved: true,
        updatedAt: new Date().toISOString()
      });
      runInAction(() => {
        this.comments[index].isApproved = true;
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  deleteComment = async (id: string): Promise<boolean> => {
    if (!authStore.canManageComments()) return false;
    
    const index = this.comments.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    try {
      await FirebaseService.updateData(`comments/${id}`, { isActive: false });
      runInAction(() => {
        this.comments[index].isActive = false;
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  // === ФИЛЬТРЫ ===
  
  setFilter = (key: keyof FilterParams, value: string | boolean | undefined): void => {
    this.filters = { ...this.filters, [key]: value };
  };

  clearFilters = (): void => {
    this.filters = {};
  };

  clearError = (): void => {
    this.error = null;
  };
}

export const dataStore = new DataStore();
