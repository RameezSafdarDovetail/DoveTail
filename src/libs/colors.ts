/**
 * Centralized color tokens. Visual source of truth lives in `theme.css`
 * as CSS variables; these constants reference those variables so JS/inline
 * styles stay in sync with global theme updates.
 */
export const colors = {
  bg: 'var(--bg)',
  surface: 'var(--surface)',
  border: 'var(--border)',
  borderSoft: 'var(--border-soft)',
  text1: 'var(--text-1)',
  text2: 'var(--text-2)',
  text3: 'var(--text-3)',
  accent: 'var(--accent)',
  accentSoft: 'var(--accent-soft)',
  accentMid: 'var(--accent-mid)',
  green: 'var(--green)',
  greenBg: 'var(--green-bg)',
  amber: 'var(--amber)',
  amberBg: 'var(--amber-bg)',
  red: 'var(--red)',
  redBg: 'var(--red-bg)',
  slate: 'var(--slate)',
  slateBg: 'var(--slate-bg)',
  white: 'var(--white)',
  brandNavy: 'var(--brand-navy)',
  btnPrimary: 'var(--btn-primary)',
  logCaseIconBg: 'var(--log-case-icon-bg)',
  changeRequestIconBg: 'var(--cr-icon-bg)',
  priorityP1IconBg: 'var(--priority-p1-icon-bg)',
  priorityP2IconBg: 'var(--priority-p2-icon-bg)',
  priorityP3IconBg: 'var(--priority-p3-icon-bg)',
} as const;

export type ColorToken = keyof typeof colors;
