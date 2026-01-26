/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F9F8',
          100: '#E0EFEA',
          200: '#BFDFD4',
          300: '#94C7B5',
          400: '#64A992',
          500: '#418B73',
          600: '#31705D', // Brand Base Green
          700: '#285A4C',
          800: '#23483E',
          900: '#1F3C34', // Deep Forest (Footer/Headers)
          950: '#11231F',
        },
        secondary: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
        accent: {
          DEFAULT: '#F59E0B', // Harvest Gold (Amber-500 equivalent)
          hover: '#D97706',   // Amber-600
          light: '#FCD34D',
        },
        surface: {
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F4F5F7',
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
