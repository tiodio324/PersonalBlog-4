import { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import styles from './MainLayout.module.scss';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = observer(({ children }: MainLayoutProps) => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.content}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
});
