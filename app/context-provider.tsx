import React, { createContext, useEffect, useState, type JSX } from 'react';
import api from './api';
import LoadingScreen from './components/loading-screen/loading-screen';
import type { ContextInterface, UserIF } from './types/common-types';
import { API_ENDPOINTS } from './constants';

export const Context = createContext<ContextInterface>({} as ContextInterface);

const ContextProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const [deviceHeight, setDeviceHeight] = useState<string>(
    `${window.visualViewport?.height}px`
  );
  const [user, setUser] = useState<UserIF>({} as UserIF);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Set initial device height
    window.visualViewport?.addEventListener('scroll', () =>
      setDeviceHeight(`${window.visualViewport?.height}px`)
    );
    window.visualViewport?.addEventListener('resize', () =>
      setDeviceHeight(`${window.visualViewport?.height}px`)
    );
    checkSignedInStatus();

    // Set initial theme
    const GAMIFY_THEME_IS_DARK = localStorage.getItem('GAMIFY_THEME_IS_DARK');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (GAMIFY_THEME_IS_DARK === 'true') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (GAMIFY_THEME_IS_DARK === 'false') {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setIsDarkMode(prefersDark);
    }
  }, []);

  const checkSignedInStatus = () => {
    setLoading(true);
    api
      .get(API_ENDPOINTS.CHECK_SIGNED_IN_STATUS)
      .then((response) => {
        if (response.data.success) {
          setUser(response.data.user);
          setIsSignedIn(true);
        } else {
          setUser({} as UserIF);
          setIsSignedIn(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsSignedIn(false);
        setLoading(false);
      });
  };

  const signOut = () => {
    setIsSigningOut(true);
    api
      .post(API_ENDPOINTS.SIGN_OUT)
      .then((response) => {
        if (response.data.success) {
          checkSignedInStatus();
        } else {
          setIsSigningOut(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Context.Provider
      value={{
        isSignedIn,
        checkSignedInStatus,
        deviceHeight,
        user,
        loading,
        isDarkMode,
        setIsDarkMode,
        isSigningOut,
        signOut,
      }}
    >
      {loading ? <LoadingScreen /> : children}
    </Context.Provider>
  );
};

export default ContextProvider;
