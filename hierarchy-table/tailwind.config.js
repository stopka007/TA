/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#121212',
        'dark-surface': '#1a1a1a',
        'dark-surface-2': '#222222',
        'dark-surface-3': '#2a2a2a',
        'dark-hover': '#333333',
        'teal-primary': '#00bcd4',
        'teal-hover': '#00a0b3',
        'red-danger': '#ff4444',
        'red-hover': '#ff6666',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
} 