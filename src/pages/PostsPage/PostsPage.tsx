import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { dataStore } from '@/store';
import { Card, Input, Badge } from '@/components/UI';
import type { Post } from '@/types';
import styles from './PostsPage.module.scss';

export const PostsPage = observer(() => {
  const { filteredPosts, activeTags, getTagsForPost, setFilter, filters } = dataStore;
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFilter('search', searchQuery || undefined);
  }, [searchQuery, setFilter]);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    dataStore.incrementPostViews(post.id);
  };

  const handleTagFilter = (tagId: string) => {
    if (filters.tagId === tagId) {
      setFilter('tagId', undefined);
    } else {
      setFilter('tagId', tagId);
    }
  };

  const clearTagFilter = () => {
    setFilter('tagId', undefined);
  };

  const activeTagName = filters.tagId
    ? activeTags.find(t => t.id === filters.tagId)?.name
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Статьи</h1>
          <p className={styles.subtitle}>Все публикации блога</p>
        </div>
      </div>

      <Card className={styles.filters}>
        <Input
          placeholder="Поиск статей..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </Card>

      {activeTags.length > 0 && (
        <div className={styles.tagsSection}>
          {activeTags.map(tag => (
            <button
              key={tag.id}
              className={`${styles.tagButton} ${filters.tagId === tag.id ? styles.activeTag : ''}`}
              onClick={() => handleTagFilter(tag.id)}
              style={filters.tagId === tag.id ? { backgroundColor: tag.color, borderColor: tag.color } : undefined}
            >
              {tag.name}
            </button>
          ))}
          {filters.tagId && (
            <button className={styles.clearTag} onClick={clearTagFilter}>
              ✕ Сбросить: {activeTagName}
            </button>
          )}
        </div>
      )}

      {selectedPost ? (
        <Card className={styles.postDetail}>
          <button className={styles.backButton} onClick={() => setSelectedPost(null)}>
            ← Назад
          </button>
          {selectedPost.coverImage && (
            <img src={selectedPost.coverImage} alt={selectedPost.title} className={styles.coverImage} />
          )}
          <h1 className={styles.postTitle}>{selectedPost.title}</h1>
          <div className={styles.postMeta}>
            <span>
              {new Date(selectedPost.publishedAt || selectedPost.createdAt).toLocaleDateString('ru-RU')}
            </span>
            <span>👁 {selectedPost.views}</span>
            <div className={styles.postTags}>
              {getTagsForPost(selectedPost).map(tag => (
                <Badge key={tag.id} variant="info" style={{ backgroundColor: tag.color }}>
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n/g, '<br />') }}
          />
        </Card>
      ) : (
        <div className={styles.postsGrid}>
          {filteredPosts.map(post => (
            <Card key={post.id} className={styles.postCard} hoverable onClick={() => handlePostClick(post)}>
              {post.coverImage && (
                <div className={styles.postImage} style={{ backgroundImage: `url(${post.coverImage})` }} />
              )}
              <div className={styles.postContent}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <div className={styles.postFooter}>
                  <span className={styles.postDate}>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                  <span className={styles.postViews}>👁 {post.views}</span>
                </div>
                <div className={styles.postTags}>
                  {getTagsForPost(post).slice(0, 3).map(tag => (
                    <Badge key={tag.id} variant="info" style={{ backgroundColor: tag.color }}>
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
          {filteredPosts.length === 0 && <p className={styles.empty}>Статьи не найдены</p>}
        </div>
      )}
    </div>
  );
});
