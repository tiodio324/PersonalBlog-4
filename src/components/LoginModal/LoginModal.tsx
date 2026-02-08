import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../store/AuthStore';
import { uiStore } from '../../store/UIStore';
import styles from './LoginModal.module.scss';

export const LoginModal = observer(() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { isLoginModalOpen } = uiStore;

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await authStore.login(username, password);
      
      if (success) {
        setUsername('');
        setPassword('');
        uiStore.closeLoginModal();
      } else {
        setError('Неверный логин или пароль');
      }
    } catch (err) {
      setError('Ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    uiStore.closeLoginModal();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          ✕
        </button>
        
        <div className={styles.header}>
          <h2>Вход в систему</h2>
          <p>Войдите, чтобы управлять блогом</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Логин</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите логин"
              required
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <br/>
      </div>
    </div>
  );
});
