import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0d12',
        surface: '#11141b',
        surface2: '#171b24',
        card: '#f7f8fb',
        text: '#121826',
        textMuted: '#5f6b7a',
        textInverse: '#f5f7fb',
        primary: '#026cdf',
      },
      borderRadius: {
        'card': '24px',
        'ui': '14px',
      },
      boxShadow: {
        ticket: '0 24px 80px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
