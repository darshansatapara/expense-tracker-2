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
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
