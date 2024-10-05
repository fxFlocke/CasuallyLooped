/** @type {import('tailwindcss').Config} */ module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        '7.5': '30px', 
        '6.5': '26px',
        '18': '70px',
        '21': '82px',
        '23': '92px',
        '26': '108px',
        '33': '133px',
        '34': '135px'
      }
    },
  },
  plugins: [],
};
