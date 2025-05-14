/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: { extend: {
      colors:{
        'yellow': {
    '50': '#fbffe7',
    '100': '#f4ffc1',
    '200': '#eeff86',
    '300': '#ecff41',
    '400': '#f2ff0d',
    '500': '#ffff00',
    '600': '#d1bf00',
    '700': '#a68b02',
    '800': '#896c0a',
    '900': '#74580f',
    '950': '#443004',
},
      }
    } },
    plugins: [daisyui],
    daisyui: {
      themes: ["light", "dark", "cupcake"], // Add themes you want to use
      darkTheme: "dark", // Optional: specify default dark theme
      base: true, // applies background color and foreground color for root element by default
      styled: true, // include daisyUI colors and design decisions for all components
      utils: true, // adds responsive and modifier utility classes
    },
  }