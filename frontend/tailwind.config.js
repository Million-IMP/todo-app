/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'priority-high': '#ef4444',
        'priority-medium': '#f59e0b',
        'priority-low': '#10b981',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
