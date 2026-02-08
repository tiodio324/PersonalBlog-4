import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { dataStore, uiStore, authStore } from '@/store';
import { Card, Button, Table, Modal, Input, Badge } from '@/components/UI';
import type { TableColumn } from '@/components/UI';
import type { Post, Tag, Comment, PostFormData, TagFormData } from '@/types';
import styles from './AdminPage.module.scss';

type AdminTab = 'posts' | 'comments' | 'tags';

export const AdminPage = observer(() => {
  const {
    posts,
    comments,
    tags,
    activeTags,
    postsLoading,
    commentsLoading,
    tagsLoading,
    getPostById,
    getTagsForPost,
    createPost,
    updatePost,
    deletePost,
    createTag,
    deleteTag,
    approveComment,
    deleteComment,
  } = dataStore;
  const { isAdmin } = authStore;
  const [activeTab, setActiveTab] = useState<AdminTab>('posts');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<PostFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    categoryId: '',
    tagIds: [],
    coverImage: '',
    isPublished: false,
  });
  const [tagForm, setTagForm] = useState<TagFormData>({ name: '', slug: '', color: '#64748B' });

  const resetForms = () => {
    setPostForm({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      categoryId: '',
      tagIds: [],
      coverImage: '',
      isPublished: false,
    });
    setTagForm({ name: '', slug: '', color: '#64748B' });
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForms();
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (item: Post | Tag) => {
    setModalMode('edit');
    setEditingId(item.id);
    if (activeTab === 'posts') {
      const p = item as Post;
      setPostForm({
        title: p.title,
        slug: p.slug,
        content: p.content,
        excerpt: p.excerpt,
        categoryId: p.categoryId,
        tagIds: p.tagIds || [],
        coverImage: p.coverImage || '',
        isPublished: p.isPublished,
      });
    } else {
      const t = item as Tag;
      setTagForm({ name: t.name, slug: t.slug, color: t.color });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (activeTab === 'posts') {
        if (!postForm.title) {
          uiStore.showError('Введите название');
          return;
        }
        if (modalMode === 'create') {
          await createPost(postForm);
        } else if (editingId) {
          await updatePost(editingId, postForm);
        }
      } else if (activeTab === 'tags') {
        if (!tagForm.name) {
          uiStore.showError('Введите название');
          return;
        }
        if (modalMode === 'create') {
          await createTag(tagForm);
        }
      }
      uiStore.showSuccess('Сохранено');
      setModalOpen(false);
      resetForms();
    } catch {
      uiStore.showError('Ошибка');
    }
  };

  const handleDelete = (id: string) => {
    uiStore.showConfirm('Удаление', 'Удалить?', async () => {
      if (activeTab === 'posts') {
        await deletePost(id);
      } else if (activeTab === 'tags') {
        await deleteTag(id);
      } else {
        await deleteComment(id);
      }
      uiStore.showSuccess('Удалено');
    });
  };

  const handleApprove = async (id: string) => {
    await approveComment(id);
    uiStore.showSuccess('Одобрено');
  };

  const togglePostTag = (tagId: string) => {
    const currentTags = postForm.tagIds || [];
    if (currentTags.includes(tagId)) {
      setPostForm({ ...postForm, tagIds: currentTags.filter(id => id !== tagId) });
    } else {
      setPostForm({ ...postForm, tagIds: [...currentTags, tagId] });
    }
  };

  const postColumns: TableColumn<Post>[] = [
    { key: 'title', title: 'Название' },
    {
      key: 'tagIds',
      title: 'Теги',
      width: '200px',
      render: (_: unknown, r: Post) => (
        <div className={styles.tagsList}>
          {getTagsForPost(r).map(tag => (
            <span
              key={tag.id}
              className={styles.tagBadge}
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
          {(!r.tagIds || r.tagIds.length === 0) && (
            <span className={styles.noTags}>—</span>
          )}
        </div>
      ),
    },
    {
      key: 'isPublished',
      title: 'Статус',
      width: '100px',
      render: (v: unknown) => (
        <Badge variant={(v as boolean) ? 'success' : 'warning'}>
          {(v as boolean) ? 'Опубликовано' : 'Черновик'}
        </Badge>
      ),
    },
    { key: 'views', title: 'Просмотры', width: '90px' },
    {
      key: 'actions',
      title: '',
      width: '100px',
      render: (_: unknown, r: Post) => (
        <div className={styles.actions}>
          <Button size="sm" variant="ghost" onClick={() => openEditModal(r)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </Button>
        </div>
      ),
    },
  ];

  const commentColumns: TableColumn<Comment>[] = [
    { key: 'authorName', title: 'Автор' },
    {
      key: 'postId',
      title: 'Статья',
      render: (v: unknown) => getPostById(v as string)?.title || '—',
    },
    {
      key: 'content',
      title: 'Комментарий',
      render: (v: unknown) => (v as string).substring(0, 50) + '...',
    },
    {
      key: 'isApproved',
      title: 'Статус',
      width: '100px',
      render: (v: unknown) => (
        <Badge variant={(v as boolean) ? 'success' : 'warning'}>
          {(v as boolean) ? 'Одобрен' : 'Ожидает'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: '',
      width: '120px',
      render: (_: unknown, r: Comment) => (
        <div className={styles.actions}>
          {!r.isApproved && (
            <Button size="sm" variant="ghost" onClick={() => handleApprove(r.id)}>
              Одобрить
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </Button>
        </div>
      ),
    },
  ];

  const tagColumns: TableColumn<Tag>[] = [
    { key: 'name', title: 'Название' },
    {
      key: 'color',
      title: 'Цвет',
      width: '100px',
      render: (v: unknown) => (
        <div style={{ width: '30px', height: '30px', backgroundColor: v as string, borderRadius: '4px' }} />
      ),
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            title: '',
            width: '60px',
            render: (_: unknown, r: Tag) => (
              <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </Button>
            ),
          } as TableColumn<Tag>,
        ]
      : []),
  ];

  // Determine if the "Добавить" button should be shown
  const showCreateButton =
    (activeTab === 'posts') ||
    (activeTab === 'tags' && isAdmin);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Управление блогом</h1>
      </div>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'posts' ? styles.active : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Статьи
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'comments' ? styles.active : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          Комментарии
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'tags' ? styles.active : ''}`}
          onClick={() => setActiveTab('tags')}
        >
          Теги
        </button>
      </div>
      {showCreateButton && (
        <Card className={styles.toolbar}>
          <Button variant="primary" onClick={openCreateModal}>
            Добавить {activeTab === 'posts' ? 'статью' : 'тег'}
          </Button>
        </Card>
      )}
      <Card padding="none">
        {activeTab === 'posts' && (
          <Table
            columns={postColumns}
            data={posts.filter(p => p.isActive)}
            keyField="id"
            loading={postsLoading}
            emptyText="Нет статей"
          />
        )}
        {activeTab === 'comments' && (
          <Table
            columns={commentColumns}
            data={comments.filter(c => c.isActive)}
            keyField="id"
            loading={commentsLoading}
            emptyText="Нет комментариев"
          />
        )}
        {activeTab === 'tags' && (
          <Table
            columns={tagColumns}
            data={tags.filter(t => t.isActive)}
            keyField="id"
            loading={tagsLoading}
            emptyText="Нет тегов"
          />
        )}
      </Card>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === 'create' ? 'Добавить' : 'Редактировать'}
        footer={
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Сохранить
            </Button>
          </div>
        }
      >
        <div className={styles.form}>
          {activeTab === 'posts' && (
            <>
              <Input
                label="Название *"
                value={postForm.title}
                onChange={e => setPostForm({ ...postForm, title: e.target.value })}
              />
              <Input
                label="Краткое описание"
                value={postForm.excerpt}
                onChange={e => setPostForm({ ...postForm, excerpt: e.target.value })}
              />
              <Input
                label="Содержание"
                type="textarea"
                value={postForm.content}
                onChange={e => setPostForm({ ...postForm, content: e.target.value })}
              />
              <Input
                label="URL изображения"
                value={postForm.coverImage || ''}
                onChange={e => setPostForm({ ...postForm, coverImage: e.target.value })}
              />
              {activeTags.length > 0 && (
                <div className={styles.tagSelector}>
                  <label className={styles.tagSelectorLabel}>Теги</label>
                  <div className={styles.tagOptions}>
                    {activeTags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        className={`${styles.tagOption} ${postForm.tagIds.includes(tag.id) ? styles.tagOptionActive : ''}`}
                        onClick={() => togglePostTag(tag.id)}
                        style={
                          postForm.tagIds.includes(tag.id)
                            ? { backgroundColor: tag.color, borderColor: tag.color, color: '#fff' }
                            : undefined
                        }
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={postForm.isPublished}
                  onChange={e => setPostForm({ ...postForm, isPublished: e.target.checked })}
                  id="published"
                />
                <label htmlFor="published">Опубликовать</label>
              </div>
            </>
          )}
          {activeTab === 'tags' && (
            <>
              <Input
                label="Название *"
                value={tagForm.name}
                onChange={e => setTagForm({ ...tagForm, name: e.target.value })}
              />
              <Input
                label="Цвет"
                type="color"
                value={tagForm.color}
                onChange={e => setTagForm({ ...tagForm, color: e.target.value })}
              />
            </>
          )}
        </div>
      </Modal>
    </div>
  );
});
