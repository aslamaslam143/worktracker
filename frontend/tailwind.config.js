/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0F1218',
        darkCard: '#181C24',
        darkCardHover: '#202530',
        darkBorder: '#282F3E',
        neonBlue: '#3B82F6',
        neonGreen: '#10B981',
        neonYellow: '#F59E0B',
        neonPurple: '#8B5CF6',
        neonRed: '#EF4444'
      }
    },
  },
  plugins: [],
}