import { observer } from 'mobx-react-lite';
import { dataStore, navigationStore } from '@/store';
import { Card, Badge } from '@/components/UI';
import styles from './TagsPage.module.scss';

export const TagsPage = observer(() => {
  const { activeTags, publishedPosts } = dataStore;
  const { navigate } = navigationStore;

  const handleTagClick = (tagId: string) => {
    dataStore.setFilter('tagId', tagId);
    navigate('posts');
  };

  const getPostsCountForTag = (tagId: string): number => {
    return publishedPosts.filter(p => (p.tagIds || []).includes(tagId)).length;
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div><h1 className={styles.title}>Теги</h1><p className={styles.subtitle}>Категории статей блога</p></div>
      </div>

      <div className={styles.tagsGrid}>
        {activeTags.map(tag => (
          <Card key={tag.id} className={styles.tagCard} hoverable onClick={() => handleTagClick(tag.id)}>
            <Badge variant="info" style={{ backgroundColor: tag.color, color: '#fff' }} className={styles.tagBadge}>
              {tag.name}
            </Badge>
            <div className={styles.tagCount}>{getPostsCountForTag(tag.id)} статей</div>
          </Card>
        ))}
        {activeTags.length === 0 && <p className={styles.empty}>Теги не найдены</p>}
      </div>
    </div>
  );
});
