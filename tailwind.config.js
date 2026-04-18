/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0a0a0a', secondary: '#111111', tertiary: '#1a1a1a' },
        neon: { 
          red: '#ff0033', 
          purple: '#a855f7', 
          pink: '#ec4899',
          cyan: '#00D1FF', // Tu color de logo
          gold: '#f59e0b' 
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
        },
        pulseNeon: {
          '0%, 100%': { opacity: '1', textShadow: '0 0 20px currentColor' },
          '50%': { opacity: '0.8', textShadow: '0 0 10px currentColor' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}