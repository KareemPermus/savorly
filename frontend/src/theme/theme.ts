export const themeTokens = {
  colors: {
    primary: '#059669',
    primaryLight: '#f0fdf4',
    primaryDark: '#047857',
    accent: '#F97316',
    background: '#fafaf9',
    surface: '#ffffff',
    border: '#e7e5e4',
    textPrimary: '#292524',
    textMuted: '#a8a29e',
  },
  gradients: {
    headerPrimary: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    panelDark: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
    softSurface: 'linear-gradient(135deg, #f0fdf4 0%, #fafaf9 100%)',
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    fontFamilySerif: '"Fraunces", serif',
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    body1: { fontSize: '0.875rem', fontWeight: 400 },
    body2: { fontSize: '0.75rem', fontWeight: 400 },
  },
  radius: { md: '12px', lg: '16px', xl: '24px', full: '9999px' },
};

export default themeTokens;