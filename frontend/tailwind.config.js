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
        Mono: ["Roboto Mono", "monospace"], // Add PT Mono to the font family
      },
      animation: {
        "gradient-bg": "gradientBG 8s ease infinite",
      },
      keyframes: {
        gradientBG: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
