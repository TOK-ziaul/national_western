/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "navy-blue": "#204051",
        "legacy-beige": "#E7DFD5",
      },
      fontFamily: {
        "gin-test": ["Gin Test", "sans-serif"],
        "gin-test-lines": ["Gin Test Lines", "sans-serif"],
        "gin-test-rough": ["Gin Test Rough", "sans-serif"],
        "gin-test-round": ["Gin Test Round", "sans-serif"],
      },
    },
  },
  plugins: [],
};
