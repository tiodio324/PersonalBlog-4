import { observer } from 'mobx-react-lite';
import { navigationStore } from '../../../store/NavigationStore';
import { authStore } from '../../../store/AuthStore';
import { uiStore } from '../../../store/UIStore';
import type { PageId } from '../../../types';
import styles from './Sidebar.module.scss';

// SVG иконки для навигации
const NavIcon = ({ pageId }: { pageId: PageId }) => {
  switch (pageId) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      );
    case 'posts':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      );
    case 'admin':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

export const Sidebar = observer(() => {
  const { navigationItems, currentPage } = navigationStore;
  const { user, isAuthenticated } = authStore;
  const { isSidebarCollapsed } = uiStore;

  const handleNavigation = (pageId: PageId) => {
    navigationStore.navigateTo(pageId);
  };

  const handleLogout = () => {
    authStore.logout();
    navigationStore.navigateTo('home');
  };

  const handleLogin = () => {
    uiStore.openLoginModal();
  };

  const toggleSidebar = () => {
    uiStore.toggleSidebar();
  };

  return (
    <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
      {/* Логотип */}
      <div className={styles.logo}>
        <span className={styles.logoIcon}>✍️</span>
        {!isSidebarCollapsed && <span className={styles.logoText}>Блог</span>}
      </div>

      {/* Кнопка сворачивания */}
      <button className={styles.collapseButton} onClick={toggleSidebar}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isSidebarCollapsed ? (
            <polyline points="9,18 15,12 9,6" />
          ) : (
            <polyline points="15,18 9,12 15,6" />
          )}
        </svg>
      </button>

      {/* Навигация */}
      <nav className={styles.nav}>
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${currentPage === item.id ? styles.active : ''}`}
            onClick={() => handleNavigation(item.id)}
            title={isSidebarCollapsed ? item.title : undefined}
          >
            <span className={styles.navIcon}>
              <NavIcon pageId={item.id} />
            </span>
            {!isSidebarCollapsed && <span className={styles.navLabel}>{item.title}</span>}
          </button>
        ))}
      </nav>

      {/* Пользователь */}
      <div className={styles.userSection}>
        {isAuthenticated && user ? (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            {!isSidebarCollapsed && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userRole}>
                  {user.role === 'admin' ? 'Администратор' : 
                   user.role === 'author' ? 'Автор' : 'Читатель'}
                </span>
              </div>
            )}
            <button 
              className={styles.logoutButton} 
              onClick={handleLogout}
              title="Выйти"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <button className={styles.loginButton} onClick={handleLogin}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
              <polyline points="10,17 15,12 10,7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            {!isSidebarCollapsed && <span>Войти</span>}
          </button>
        )}
      </div>
    </aside>
  );
});
