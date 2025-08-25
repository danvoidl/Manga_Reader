/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'default-black': "#262626",
        'callout': '#AD89FF'
      }
    },
  },
  plugins: [],
}