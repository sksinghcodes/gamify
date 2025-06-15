import { Navigate, NavLink, Outlet, useLocation } from 'react-router';
import ThemeSelector from '~/components/theme-selector/theme-selector';
import styles from './auth-layout.module.css';
import { useContext } from 'react';
import { Context } from '~/context-provider';
import { ROUTES } from '~/constants';

const {
  SIGN_IN: { path: SIGN_IN },
  SIGN_UP: { path: SIGN_UP },
  TASK_LIST: { path: TASK_LIST },
} = ROUTES;

const AuthLayout = () => {
  const context = useContext(Context);

  if (context.isSignedIn === true) {
    return <Navigate to={TASK_LIST} replace />;
  }

  const { pathname } = useLocation();

  const isSignInOrSignUp = pathname === SIGN_IN || pathname === SIGN_UP;

  return (
    <>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.logo}>GAMIFY</h1>
          <ThemeSelector />
        </div>
      </div>

      {isSignInOrSignUp && (
        <div className={styles.tabButtons}>
          <NavLink to={SIGN_IN} end className={styles.tabButton}>
            Sign In
          </NavLink>
          <NavLink to={SIGN_UP} end className={styles.tabButton}>
            Sign Up
          </NavLink>
        </div>
      )}
      <div
        className={`${styles.formWrap} ${
          isSignInOrSignUp ? '' : styles.noTabs
        }`}
      >
        <Outlet />
      </div>
    </>
  );
};

export default AuthLayout;
