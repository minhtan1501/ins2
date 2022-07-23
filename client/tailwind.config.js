/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class", 
  theme: {
    extend: {
      colors: {
        "submit-btn": '#0095F6',
        error: '#BB2D3B',
        success: '#157347',
        warning: '#FFCA2C',
        primary: "#171717",
        secondary: "#272727",
        'dark-subtle': "rgba(255,255,255,0.5)",
        'light-subtle': "rgba(39,39,39,0.5)",
        "highlight-dark":"#ffc200",
        highlight:'#058bfb'
      },
      gridTemplateColumns: {
        'img': 'repeat(auto-fill, minmax(100px, 1fr))',

      }
    },
  },
  plugins: [],
}
