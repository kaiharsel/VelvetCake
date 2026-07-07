/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm near-black ink
        ink: {
          DEFAULT: '#0C0809',
          800: '#140D0E',
          700: '#1C1315',
        },
        // Deep velvet wine
        wine: {
          DEFAULT: '#3A0C12',
          900: '#2A080D',
          700: '#4C1017',
        },
        // Crimson / blood red brand accent
        blood: {
          DEFAULT: '#8E1C2B',
          500: '#A8202F',
          400: '#C0293B',
        },
        ember: '#D4414E',
        // Brand gold — from the embroidered cake-slice logo
        gold: {
          DEFAULT: '#C6A15B',
          300: '#E4C889',
          600: '#A5813F',
        },
        // Warm cream / ivory
        cream: {
          DEFAULT: '#F4EDE2',
          200: '#EEE5D6',
        },
        sand: '#D7C6B3',
        mute: '#9A867B',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.28em',
      },
      maxWidth: {
        shell: '1600px',
      },
      transitionTimingFunction: {
        velvet: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'grain': {
          '0%,100%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-5%,5%)' },
          '40%': { transform: 'translate(-10%,-5%)' },
          '60%': { transform: 'translate(5%,-10%)' },
          '80%': { transform: 'translate(-5%,10%)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
}
