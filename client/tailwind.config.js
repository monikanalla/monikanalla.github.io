/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* HAIR5S palette — paper, ink, oxblood */
        bone: '#F2EDE3',
        paper: '#FEFCF8',
        char: '#14110E',
        sand: '#E3D9C8',
        steel: '#A19A8E',
        wine: {
          100: '#F6E3E4',
          200: '#E8C2C6',
          300: '#C4757F',
          400: '#A23443',
          500: '#7C1B26',
          600: '#56101A',
        },

        /* Legacy semantic tokens, remapped onto the light theme.
           Every existing screen (public + admin) follows automatically. */
        onyx: '#F2EDE3',
        ink: '#EBE4D6',
        coal: '#FEFCF8',
        smoke: '#F6F1E7',
        ember: '#E7DECD',
        copper: {
          100: '#7C1B26',
          200: '#A23443',
          300: '#A23443',
          400: '#7C1B26',
          500: '#65141E',
          600: '#4C0E16',
        },
        champagne: '#14110E',
        ash: '#6F675C',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.32em',
      },
      boxShadow: {
        glow: '0 30px 90px -45px rgba(124, 27, 38, 0.45)',
        card: '0 30px 70px -50px rgba(20, 17, 14, 0.45)',
        lift: '0 18px 44px -28px rgba(20, 17, 14, 0.35)',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.55' },
          '70%': { transform: 'scale(1.25)', opacity: '0' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 38s linear infinite',
        float: 'float 7s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.8s ease-out infinite',
      },
    },
  },
  plugins: [],
};
