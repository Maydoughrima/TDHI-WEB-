/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        bg: "#f8f9fa",
        bgIf: "F1F1F1",
        primary: "#03045e",
        secondary: "#0077B6",
        complimentary: "#FF6B6B",
        accent: "#00B4D8",
        bgshade: "#e9ecef",
        fontc: "#001219",
    },
    fontFamily: {
      heading: ["Roboto", "sans-serif"],
      body: ["Montserrat", "sans-serif"],
  },
  screens: {
    sm: '320px',
    lm: '425px',
    md: '768px',
    lg: '1024px',
    xl: '1440px',
    xxl: '2560px',
  },
},
},
  plugins: [],
}

