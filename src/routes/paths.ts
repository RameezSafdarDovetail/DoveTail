export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  updatePassword: '/update-password',
  open: '/open',
  quotes: '/quotes',
  all: '/cases',
  closed: '/closed',
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];
