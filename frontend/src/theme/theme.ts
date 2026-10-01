export const themeTokens = {
  colors: {
    primary: '#dc2626',
    primaryHover: '#b91c1c',
    primaryLight: '#fef2f2',
    accent: '#ea580c',
    background: '#faf8f3',
    surface: '#ffffff',
    border: '#e7e5e4',
    textPrimary: '#292524',
    textMuted: '#78716c',
  },
  gradients: {
    headerPrimary: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
    panelDark: 'linear-gradient(135deg, #292524 0%, #44403c 100%)',
    softSurface: 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)',
  },
  typography: {
    fontHeading: "'Fraunces', serif",
    fontBody: "'Inter', sans-serif",
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    body1: { fontSize: '0.875rem', fontWeight: 400 },
    body2: { fontSize: '0.75rem', fontWeight: 400 },
  },
  radius: { md: '12px', lg: '16px' },
};

export default themeTokens;