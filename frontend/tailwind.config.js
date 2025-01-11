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
        "custom-light": "#F8FAFC",
        lightBlue: "#D9EAFD", // Make sure this is defined
      },
    },
  },
  plugins: [],
};
