/**
 * Centralized font tokens. Update here and in `theme.css` `--font-*`
 * variables to change typography globally.
 */
export const fonts = {
  sans: 'var(--font-sans)',
  display: 'var(--font-display)',
  mono: 'var(--font-mono)',
  googleFontsUrl:
    'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&family=Bricolage+Grotesque:wght@400;600;800&display=swap',
  families: {
    sans: "'DM Sans', sans-serif",
    display: "'Bricolage Grotesque', sans-serif",
    mono: "'DM Mono', monospace",
  },
} as const;
