/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
          soft: '#F5F3FF',
        },
        ink: {
          DEFAULT: '#09090B',
          2: '#3F3F46',
        },
        muted: {
          DEFAULT: '#71717A',
          2: '#A1A1AA',
        },
        surface: {
          DEFAULT: '#FAFAFA',
          2: '#F4F4F5',
        },
        border: {
          DEFAULT: '#E4E4E7',
          strong: '#D4D4D8',
        },
        success: '#16A34A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(9,9,11,0.04), 0 1px 1px rgba(9,9,11,0.03)',
        md: '0 4px 16px rgba(9,9,11,0.06), 0 2px 4px rgba(9,9,11,0.04)',
        lg: '0 16px 48px rgba(9,9,11,0.10), 0 4px 12px rgba(9,9,11,0.06)',
        accent: '0 0 0 4px rgba(124,58,237,0.18)',
      },
      keyframes: {
        modal: {
          from: { opacity: '0', transform: 'translateY(10px) scale(0.985)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%, 55%': { transform: 'translateX(-8px)' },
          '30%, 70%': { transform: 'translateX(8px)' },
          '85%': { transform: 'translateX(-4px)' },
        },
        pulse: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        modal: 'modal 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)',
        shake: 'shake 0.42s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'icon-pulse': 'pulse 0.35s ease',
      },
    },
  },
  plugins: [],
}
