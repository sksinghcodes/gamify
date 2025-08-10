import React, { createContext, useEffect, useState, type JSX } from 'react';
import api from './api';
import LoadingScreen from './components/loading-screen/loading-screen';
import type { UserIF } from './types/common-types';
import { API_ENDPOINTS } from './constants';
import { getTodayEpoch } from './utils/date-utils';
import type { Task, TaskWithRecord } from './types/task-types';

export interface ContextInterface {
  isSignedIn: boolean | null;
  checkSignedInStatus: () => void;
  deviceHeight: string;
  user: UserIF;
  appLoading: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  isSigningOut: boolean;
  signOut: () => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  taskListDate: number;
  setTaskListDate: (date: number) => void;
  cacheById: Record<string, TaskWithRecord> | null;
  cacheByDate: Record<string, TaskWithRecord[]> | null;
  setCacheByDate: React.Dispatch<
    React.SetStateAction<Record<string, TaskWithRecord[]> | null>
  >;
  setCacheById: React.Dispatch<
    React.SetStateAction<Record<string, TaskWithRecord> | null>
  >;
}

export const Context = createContext<ContextInterface>({} as ContextInterface);

const ContextProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [appLoading, setAppLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const [taskListDate, setTaskListDate] = useState<number>(getTodayEpoch());
  const [deviceHeight, setDeviceHeight] = useState<string>(
    `${window.visualViewport?.height}px`
  );
  const [user, setUser] = useState<UserIF>({} as UserIF);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [cacheByDate, setCacheByDate] = useState<Record<
    string,
    TaskWithRecord[]
  > | null>(null);
  const [cacheById, setCacheById] = useState<Record<
    string,
    TaskWithRecord
  > | null>(null);

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
    setAppLoading(true);
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
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setAppLoading(false);
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
        appLoading,
        isDarkMode,
        setIsDarkMode,
        isSigningOut,
        signOut,
        loading,
        setLoading,
        taskListDate,
        setTaskListDate,
        cacheByDate,
        cacheById,
        setCacheByDate,
        setCacheById,
      }}
    >
      {appLoading ? (
        <LoadingScreen />
      ) : isSignedIn === null ? (
        <div
          style={{
            padding: '60% 20px 0',
            height: deviceHeight,
          }}
        >
          <h1
            style={{
              fontSize: '1.5rem',
              marginBottom: '0.5rem',
            }}
          >
            Something went wrong!
          </h1>
          <p>The app can't be loaded right now</p>
        </div>
      ) : (
        children
      )}
    </Context.Provider>
  );
};

export default ContextProvider;
