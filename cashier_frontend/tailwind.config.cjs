/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        '73/100': '73%'
      },
      height: {
        'side-bar': 'calc(100vh - 7.5rem)'
      },
      colors: {
        overlay: 'rgba(0,0,0,0.4)',
        'primary-50': 'rgba(183, 224, 184, 0.3)',
        'primary-100': '#638A66',
        'primary-200': '#A3B899',
        'primary-300': '#667B68',
        'secondary-100': '#f7f3ef',
        'secondary-200': '#e9dcd1',
        'secondary-300': '#e3d3c6'
      },
      maxWidth: {
        'mx-4': 'calc(100% - 16px)'
      },
      keyframes: {
        'slide-in': {
          '0%': {
            '-webkit-transform': 'translateX(-200px)',
            transform: 'translateX(-200px)'
          },
          '100%': {
            '-webkit-transform': 'translateX(0px)',
            transform: 'translateX(0px)'
          }
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s'
      }
    }
  },
  plugins: []
}
