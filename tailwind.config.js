module.exports = {
  darkMode: "class",
  content: ["./index.html", "./script.js"],
  theme: {
    extend: {
      colors: {
        "tertiary-fixed-dim": "#d4c5a7",
        secondary: "#5e5e5e",
        "on-secondary-fixed": "#1b1c1c",
        "on-tertiary-fixed-variant": "#50462f",
        tertiary: "#695d45",
        "on-tertiary-fixed": "#221b08",
        "surface-container-highest": "#e3e2e0",
        "on-error-container": "#93000a",
        "error-container": "#ffdad6",
        "on-primary-fixed": "#261900",
        "inverse-primary": "#e9c176",
        "surface-container-low": "#f4f3f1",
        "tertiary-container": "#b2a488",
        "primary-container": "#c5a059",
        "surface-dim": "#dadad8",
        "on-error": "#ffffff",
        surface: "#faf9f7",
        "inverse-on-surface": "#f1f1ef",
        "on-tertiary": "#ffffff",
        "secondary-container": "#e3e2e2",
        "surface-container-lowest": "#ffffff",
        outline: "#7f7667",
        "outline-variant": "#d1c5b4",
        "surface-variant": "#e3e2e0",
        "on-primary-container": "#4e3700",
        "primary-fixed-dim": "#e9c176",
        "on-secondary": "#ffffff",
        "surface-container": "#efeeec",
        background: "#faf9f7",
        "surface-bright": "#faf9f7",
        "on-background": "#1a1c1b",
        "tertiary-fixed": "#f1e1c2",
        "on-surface": "#1a1c1b",
        "on-primary-fixed-variant": "#5d4201",
        "secondary-fixed-dim": "#c7c6c6",
        error: "#ba1a1a",
        "on-primary": "#ffffff",
        primary: "#775a19",
        "on-secondary-fixed-variant": "#464747",
        "on-tertiary-container": "#443a25",
        "surface-container-high": "#e9e8e6",
        "secondary-fixed": "#e3e2e2",
        "primary-fixed": "#ffdea5",
        "surface-tint": "#775a19",
        "on-surface-variant": "#4e4639",
        "on-secondary-container": "#646464",
        "inverse-surface": "#2f3130"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        "section-gap": "80px",
        "container-max": "1280px",
        "margin-mobile": "20px",
        unit: "8px",
        gutter: "24px"
      },
      fontFamily: {
        display: ["Playfair Display"],
        body: ["Inter"],
        headline: ["Playfair Display"],
        label: ["Inter"],
        price: ["Space Grotesk"],
        accent: ["Cormorant Garamond"]
      },
      fontSize: {}
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries")
  ]
};