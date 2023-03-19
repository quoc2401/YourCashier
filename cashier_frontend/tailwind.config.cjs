/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        "73/100": "73%",
      },
      height: {
        "side-bar": "calc(100vh - 7.5rem)",
      },
      colors: {
        overlay: "rgba(0,0,0,0.4)",
        "primary-50": "rgba(116, 78, 166, 0.2);",
        "primary-100": "#7255b0",
        "primary-200": "#7351ab",
        "primary-300": "#744ea6",
        "secondary-100": "#6973db",
        "secondary-200": "#6a70d6",
        "secondary-300": "#6b6cd2",
      },
      maxWidth: {
        "mx-4": "calc(100% - 16px)",
      },
      keyframes: {
        "slide-in": {
          "0%": {
            "-webkit-transform": "translateX(-200px)",
            transform: "translateX(-200px)",
          },
          "100%": {
            "-webkit-transform": "translateX(0px)",
            transform: "translateX(0px)",
          },
        },
      },
      animation: {
        "slide-in": "slide-in 0.3s",
      },
    },
  },
  plugins: [],
};
