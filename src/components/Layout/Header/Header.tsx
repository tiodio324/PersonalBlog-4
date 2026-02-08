import { observer } from 'mobx-react-lite';
import { authStore, navigationStore, uiStore } from '@/store';
import { Button } from '@/components/UI';
import styles from './Header.module.scss';

export const Header = observer(() => {
  const { isAuthenticated, currentRole, logout } = authStore;
  const { pageTitle, toggleMobileMenu, mobileMenuOpen, navigate } = navigationStore;

  const getRoleName = (role: string): string => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'teacher': return 'Преподаватель';
      default: return 'Гость';
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button 
          className={styles.menuButton}
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <path d="M3 12h18M3 6h18M3 18h18" />
              </>
            )}
          </svg>
        </button>
        <div
          className={styles.logo}
          onClick={() => navigate('home')}
          aria-label="Перейти на главную страницу"
        >
          <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          <span className={styles.logoText}>Персональный блог</span>
        </div>
      </div>

      <div className={styles.titleSection}>
        <h1 className={styles.title}>{pageTitle}</h1>
        <div className={styles.titleUnderline} />
      </div>

      <div className={styles.right}>
        {isAuthenticated ? (
          <div className={styles.userInfo}>
            <span className={styles.role}>{getRoleName(currentRole)}</span>
            <Button variant="ghost" size="sm" onClick={logout} className={styles.headerButton}>
              Выйти
            </Button>
          </div>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => uiStore.openLoginModal()} className={styles.headerButton}>
            Войти
          </Button>
        )}
      </div>
    </header>
  );
});
