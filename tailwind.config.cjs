/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '-100% 0' },
        },
      },
      animation: {
        // Mais rápido (3.5s) para dar sensação de brilho
        shimmer: 'shimmer 8s linear infinite',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-primary': '#ec6246',
        'brand-purple': '#4f297c',
        'brand-pink': '#c71762',
        'brand-magenta': '#841977',
        'brand-orange-light': '#f48131',
        'brand-orange-dark': '#e5672c',
        'brand-purple-dark': '#460d5e',
        'dark-bg': '#0a0a0a',
        'dark-card': '#171717',
        'dark-border': '#262626',
      },
    },
  },
  plugins: [],
}
