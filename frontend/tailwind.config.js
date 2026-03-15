/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        barlow : ["Barlow Condensed", "sans-serif"]
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
      themes: [
        {
        mytheme: {
          "primary": "#a991f7",
          "secondary": "#f6d860",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
        },
      },
      "cupcake","night"], // only those you use
      // themes: ["cupcake","night"], // only those you use
    },
};