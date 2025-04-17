//  // tailwind.config.js

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        transparent: "transparent",
        current: "currentColor",
        Blud: "#D50F3E",
        hoverBtn: "#dc3545",
        btColour: "#ff4500",
        HeroClr: "#8c3d86",
        textClr: "#1277e9",
        // green: "#00D121",
        white: "#ffffff",
        purple: "#8400AB",
        purple2: "#7402BA",
        dark: "#000000",
        formClr: "#0d2042",

        extend: {},
      },
      screens: {
        xs: "400px",
        sm: "640px",
        // => @media (min-width: 640px) { ... }
        md: "768px",
        // => @media (min-width: 768px) { ... }
        lg: " 1024px",
        // => @media (min-width: 1024px) { ... }
        xl: "1280px",
        // => @media (min-width: 1280px) { ... }
        "2xl": "1536px",
        // // => @media (min-width: 1536px) { ... }
        mod: { max: "639px" },
        expcard: { max: "1066px" },
        minilg: { min: "899px" },
        maxlg: { max: "900px" },
        mid: { max: "767px" },
        Nlg: { max: "1023px" },
        // => @media (min-width: 0px and max-width: 639px) { ... }
      },

      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        "montserrat-subrayada": ["Montserrat Subrayada", "sans-serif"],
        // Defined Montserrat and Montserrat Subrayada fonts
      },
      // animation: {
      //   marquee: "marquee 30s linear infinite",
      // },
      animation: {
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },

        glow: {
          "0%": { boxShadow: "0 0 10px rgba(255, 255, 0, 0.8)" },
          "100%": { boxShadow: "0 0 30px rgba(255, 255, 0, 1)" },
        },
        lightPulse: {
          "0%": { opacity: 0.3, transform: "scale(1)" },
          "100%": { opacity: 0.8, transform: "scale(1.3)" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.3s ease-out",
        glow: "glow 1.5s infinite alternate",
        lightPulse: "lightPulse 1.5s infinite alternate",
      },

      animation: {
        marquee: "marquee 25s linear infinite",
        marquee2: "marquee2 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
    },
  },
  variants: {
    extend: {
      transitionProperty: ["responsive", "hover", "focus"],
      translate: ["responsive", "hover", "focus"],
    },
  },
  plugins: [require("flowbite/plugin")],
};
