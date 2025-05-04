/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    " ./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{html,js,jsx}",
    "./src/components/**/*.{html,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "monospace"], // Add PT Mono to the font family
      },
      animation: {
        bounce: "bounce 2.5s ease-in-out infinite", // Set your preferred duration here
      },
      colors: {
        "light-bg": "#fff",
        "light-tranferant": "fff",
        "light-text": "#696d75",

        "dark-bg": "#0d1117",
        "dark-tranferant": "0d1117",
        "dark-text": "#fff",
      },
      screens:{
        'sm-plus': {'max': '1139px'}, // Custom max-width breakpoint for 'sm-plus'
        'xs':  {'max': '201px'}, // Custom breakpoint for 'xs' at 168px
      },
      backdropBlur: {
        md: '12px', // or another value for the blur effect
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
