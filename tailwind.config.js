/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#060606', secondary: '#0c0c0c', tertiary: '#141414' },
        surface: { DEFAULT: '#111111', hover: '#1a1a1a' },
        neon: {
          red: 'rgb(var(--theme-primary) / <alpha-value>)',
          purple: 'rgb(var(--theme-secondary) / <alpha-value>)',
          pink: 'rgb(var(--theme-accent) / <alpha-value>)',
          cyan: '#00D1FF',
          gold: '#f59e0b',
        },
        border: { DEFAULT: 'rgba(255,255,255,0.06)', hover: 'rgba(255,255,255,0.12)' },
      },
      fontFamily: {
        display: ['var(--font-outfit)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      letterSpacing: {
        'tighter-custom': '-0.03em',
        'tight-custom': '-0.02em',
        'label': '0.08em',
        'wide-custom': '0.12em',
      },
      lineHeight: {
        'display': '1.05',
        'heading': '1.15',
        'body': '1.65',
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
        'reveal': 'reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'progress': 'progressBar 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2s infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-1px, 1px)' },
          '40%': { transform: 'translate(1px, -1px)' },
        },
        pulseNeon: {
          '0%, 100%': { opacity: '1', textShadow: '0 0 20px currentColor' },
          '50%': { opacity: '0.7', textShadow: '0 0 8px currentColor' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-5%,-10%)' },
          '30%': { transform: 'translate(3%,-15%)' },
          '50%': { transform: 'translate(12%,9%)' },
          '70%': { transform: 'translate(9%,4%)' },
          '90%': { transform: 'translate(-1%,7%)' },
        },
        reveal: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-100px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        progressBar: {
          from: { width: '0%' },
          to: { width: 'var(--progress)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          from: { boxShadow: '0 0 20px var(--glow-color, rgba(255,0,51,0.2))' },
          to: { boxShadow: '0 0 40px var(--glow-color, rgba(255,0,51,0.4))' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}