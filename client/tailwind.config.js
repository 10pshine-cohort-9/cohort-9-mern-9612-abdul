import forms from '@tailwindcss/forms';

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-container": "#1f2a44",
        "on-primary": "#ffffff",
        "primary": "#09152e",
        "on-surface-variant": "#45464d",
        "on-background": "#1b1b1d",
        "outline-variant": "#c6c6ce",
      },
      borderRadius: {
        "editorial": "4px"
      },
      spacing: {
        "margin-desktop": "40px",
        "margin-mobile": "16px",
        "xl": "32px",
        "lg": "24px",
        "md": "16px",
        "sm": "8px",
        "xs": "4px",
      },
      fontFamily: {
        "body-md": ["Inter"],
        "headline-lg": ["Inter"],
        "headline-lg-mobile": ["Inter"],
        "label-md": ["Inter"],
        "label-sm": ["Inter"],
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }],
      }
    },
  },
  plugins: [
    forms
  ],
}
