import { type RouteConfig, route, layout } from '@react-router/dev/routes';
import { ROUTES } from './constants';

const {
  TASK_LIST: { path: TASK_LIST },
  TASK_PREVIEW: { path: TASK_PREVIEW },
  TASK_PROGRESS: { path: TASK_PROGRESS },
  CREATE_TASK: { path: CREATE_TASK },
  EDIT_TASK: { path: EDIT_TASK },
  PROGRESS_OVERVIEW: { path: PROGRESS_OVERVIEW },
  SETTINGS: { path: SETTINGS },
  PROFILE: { path: PROFILE },
  SIGN_IN: { path: SIGN_IN },
  SIGN_UP: { path: SIGN_UP },
  RESET_PASSWORD: { path: RESET_PASSWORD },
  VERIFY_PROFILE: { path: VERIFY_PROFILE },
} = ROUTES;

export default [
  // should be logged in to access these routes
  layout('layouts/main-app-layout/main-app-layout.tsx', [
    route(TASK_LIST, 'pages/task-list/task-list.tsx'),
    route(TASK_PREVIEW, 'pages/task-preview/task-preview.tsx'),
    route(TASK_PROGRESS, 'pages/task-progress/task-progress.tsx'),
    route(CREATE_TASK, 'pages/create-task/create-task.tsx'),
    route(EDIT_TASK, 'pages/edit-task/edit-task.tsx'),
    route(PROGRESS_OVERVIEW, 'pages/progress-overview/progress-overview.tsx'),
    route(SETTINGS, 'pages/settings/settings.tsx'),
    route(PROFILE, 'pages/profile/profile.tsx'),
  ]),

  // should be not logged in to access these routes
  layout('layouts/auth-layout/auth-layout.tsx', [
    route(SIGN_UP, 'pages/auth/sign-up/sign-up.tsx'),
    route(SIGN_IN, 'pages/auth/sign-in/sign-in.tsx'),
    route(RESET_PASSWORD, 'pages/auth/reset-password/reset-password.tsx'),
    route(VERIFY_PROFILE, 'pages/auth/verify-profile/verify-profile.tsx'),
  ]),

  // * matches all URLs, the ? makes it optional so it will match / as well
  route('*', 'catchall.tsx'),
] satisfies RouteConfig;
