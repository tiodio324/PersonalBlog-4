import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { navigationStore, dataStore } from '@/store';
import { MainLayout, LoginModal, ConfirmModal, Toast } from '@/components';
import { HomePage, PostsPage, TagsPage, AdminPage } from '@/pages';
import '@/styles/global.scss';

const PageRouter = observer(() => {
  const { currentPage } = navigationStore;
  switch (currentPage) {
    case 'home': return <HomePage />;
    case 'posts': return <PostsPage />;
    case 'tags': return <TagsPage />;
    case 'admin': case 'admin-posts': case 'admin-comments': case 'admin-tags': return <AdminPage />;
    default: return <HomePage />;
  }
});

const App = observer(() => {
  useEffect(() => {
    dataStore.loadAllData();
  }, []);
  return (
    <>
      <MainLayout>
        <PageRouter />
      </MainLayout>
      <LoginModal />
      <ConfirmModal />
      <Toast />
    </>
  );
});

export default App;
