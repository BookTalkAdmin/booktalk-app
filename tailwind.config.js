/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5D4037',
          light: '#8D6E63',
          dark: '#321911'
        }
      }
    },
  },
  plugins: [],
}
