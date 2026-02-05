/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF1F5',
          100: '#FFE4EB',
          200: '#FEC9D7',
          300: '#FE90AB',
          400: '#FD5780',
          500: '#E50046', // Floral Crimson (Primary)
          600: '#C2003B',
          700: '#9F0031',
          800: '#7C0026',
          900: '#59001C',
          950: '#360011',
        },
        secondary: {
          50: '#F8FAF5',
          100: '#F1F5EB',
          200: '#E3EDD7',
          300: '#C7DB9C', // Spring Leaf (Secondary)
          400: '#B0CB79',
          500: '#94B456',
          600: '#759044',
          700: '#566B32',
          800: '#374620',
          900: '#181E0E',
          950: '#0C0F07',
        },
        accent: {
          DEFAULT: '#FDAB9E', // Coral Bloom
          hover: '#FB8D7C',
          light: '#FFF0BD', // Morning Buttercup
        },
        surface: {
          50: '#FFFFFF',
          100: '#FFFDF9', // Soft Sunlight
          200: '#F7F9F5', // Dew Drop
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'], 
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/assets/hero-pattern.svg')", 
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
