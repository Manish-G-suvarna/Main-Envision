/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#E6B65C",
        deepRed: "#7A0E0E",
      },
    },
  },
  plugins: [],
}
