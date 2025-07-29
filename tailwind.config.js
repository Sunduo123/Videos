/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        'bilibili': {
          pink: '#fb7299',
          blue: '#00a1d6',
          orange: '#ff6b35',
          red: '#ff4757',
          green: '#2ed573',
          gray: '#f4f5f7',
          dark: '#18191c',
          text: '#18191c',
          'text-secondary': '#61666d',
          border: '#e3e5e7'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif'
        ]
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'loading': 'loading 1.5s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        loading: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      boxShadow: {
        'bilibili': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'bilibili-hover': '0 12px 32px rgba(0, 0, 0, 0.15)'
      },
      borderRadius: {
        'bilibili': '12px',
        'bilibili-sm': '8px'
      }
    }
  },
  plugins: []
} 