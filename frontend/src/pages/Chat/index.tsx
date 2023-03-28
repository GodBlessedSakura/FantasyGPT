import Nav from '@/components/Nav';
import styles from './index.less';
import { history, Outlet } from 'umi';

export default function Chat() {
  const isLogin = localStorage.getItem('FantasyGPT');
  if (!isLogin) {
    return history.push('./login');
  }
  return (
    <div className={styles.wrapper}>
      <Nav />
      <Outlet />
    </div>
  );
}
