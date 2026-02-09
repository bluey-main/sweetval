/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          DEFAULT: '#d4567f',
          dark: '#8a223e',
          velvet: '#ff4d6d',
        },
        gold: {
          DEFAULT: '#d4af37',
        },
        cream: {
          DEFAULT: '#fffdfa',
        },
        romantic: {
          main: '#fff0f3', // bg-romantic-main base
        },
        deep: {
          romance: '#590d22', // bg-deep-romance base
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        vibes: ['Great Vibes', 'cursive'],
        courier: ['Courier Prime', 'monospace'],
        playfair: ['Playfair Display', 'serif'],
        josefin: ['Josefin Sans', 'sans-serif'],
      },
      backgroundImage: {
        'romantic-main': 'linear-gradient(135deg, #fff0f3 0%, #ffccd5 100%)',
        'deep-romance': 'linear-gradient(180deg, #590d22 0%, #120509 100%)',
        'rose-velvet': 'linear-gradient(135deg, #ff8fa3 0%, #ff4d6d 100%)',
        'midnight-gold': 'linear-gradient(180deg, #0a0406 0%, #1e1115 100%)',
        'envelope-body': 'linear-gradient(to bottom, #fdfcf0, #f2f1e6)',
        'envelope-flap': 'linear-gradient(135deg, #f2f1e6 0%, #e8e7da 100%)',
        'envelope-pocket': 'linear-gradient(to top, #f9f8e8, #fdfcf0)',
      },
      scale: {
        '115': '1.15',
      },
      animation: {
        'stage': 'fadeIn 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'shimmer': 'shimmer 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-romantic': 'pulse-romantic 3s ease-in-out infinite',
        'fall': 'fall linear forwards',
        'shake': 'shake 0.2s ease-in-out 3',
        'spin-slow': 'spin 3s linear infinite', // Added for loading states
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(15px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0)' },
          '50%': { transform: 'translateY(-12px) rotate(1.5deg)' },
        },
        'pulse-romantic': {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1) drop-shadow(0 0 10px rgba(212,86,127,0.2))' },
          '50%': { transform: 'scale(1.5)', filter: 'brightness(1.1) drop-shadow(0 0 40px rgba(212,86,127,0.7))' },
        },
        fall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      }
    },
  },
  plugins: [],
}
