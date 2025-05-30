import { useContext } from 'react';
import styles from './main-app-layout.module.css';
import { Context } from '../../context-provider';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router';
import { BOTTOM_NAV_TABS, ROUTES, ROUTES_BY_PATH } from '../../constants';
import Header from '../../components/header/header';

const MainAppLayout = () => {
  const context = useContext(Context);

  if (context.isSignedIn === false) {
    return <Navigate to={ROUTES.SIGN_IN.path} replace />;
  }

  const location = useLocation();

  const pageData = ROUTES_BY_PATH[location.pathname];

  return (
    <div className={styles.wrapper} style={{ height: context.deviceHeight }}>
      <Header />
      <main className={styles.main}>{<Outlet />}</main>

      {pageData.showBottomNav && (
        <nav className={styles.bottomNav}>
          {BOTTOM_NAV_TABS.map((tab) => (
            <NavLink key={tab.icon} className={styles.navLink} to={tab.path}>
              <span className={`${styles.icon} material-symbols-outlined`}>
                {tab.icon}
              </span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
};

export default MainAppLayout;
