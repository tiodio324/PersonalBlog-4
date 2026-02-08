import { observer } from 'mobx-react-lite';
import { dataStore, authStore, navigationStore, uiStore } from '@/store';
import { Card, Button, Badge } from '@/components/UI';
import styles from './HomePage.module.scss';

const StatCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: 'primary' | 'success' | 'warning' | 'info'; }) => (
  <Card className={`${styles.statCard} ${styles[color]}`}>
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statContent}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statTitle}>{title}</span>
    </div>
  </Card>
);

export const HomePage = observer(() => {
  const { publishedPosts, activeTags, totalViews, pendingComments, postsLoading } = dataStore;
  const { isAuthor } = authStore;
  const { navigate } = navigationStore;

  return (
    <div className={styles.page}>
      <section className={styles.welcome}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>Личный блог</h1>
          <p className={styles.welcomeText}>
            Мысли, идеи и истории из жизни.
            {!isAuthor && ' Войдите для управления блогом.'}
          </p>
          {!authStore.isAuthenticated && (
            <Button variant="primary" size="lg" onClick={() => uiStore.openLoginModal()}>
              Войти
            </Button>
          )}
        </div>
        <div className={styles.welcomeDecor}>
          <svg viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" opacity="0.2" />
            <path d="M60 100 L80 120 L100 100 L120 80 L140 100" stroke="currentColor" strokeWidth="3" opacity="0.4" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      <section className={styles.stats}>
        <StatCard
          title="Статей"
          value={postsLoading ? '...' : publishedPosts.length}
          color="primary"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
            </svg>
          }
        />
        <StatCard
          title="Тегов"
          value={activeTags.length}
          color="info"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          }
        />
        <StatCard
          title="Просмотров"
          value={totalViews.toLocaleString('ru-RU')}
          color="success"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
        />
        {isAuthor && (
          <StatCard
            title="Комментариев"
            value={pendingComments.length}
            color={pendingComments.length > 0 ? 'warning' : 'info'}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            }
          />
        )}
      </section>

      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Разделы</h2>
        <div className={styles.actionCards}>
          <Card className={styles.actionCard} hoverable onClick={() => navigate('posts')}>
            <div className={styles.actionIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
            <h3>Статьи</h3>
            <p>Читать блог</p>
            <Badge variant="primary">{publishedPosts.length} статей</Badge>
          </Card>

          <Card className={styles.actionCard} hoverable onClick={() => navigate('tags')}>
            <div className={styles.actionIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
              </svg>
            </div>
            <h3>Теги</h3>
            <p>Категории статей</p>
            <Badge variant="info">{activeTags.length} тегов</Badge>
          </Card>

          {isAuthor && (
            <Card className={styles.actionCard} hoverable onClick={() => navigate('admin')}>
              <div className={styles.actionIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
              </div>
              <h3>Управление</h3>
              <p>Редактирование блога</p>
              {pendingComments.length > 0 && (
                <Badge variant="warning">{pendingComments.length} новых</Badge>
              )}
            </Card>
          )}
        </div>
      </section>
    </div>
  );
});
