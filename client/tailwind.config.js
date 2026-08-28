import forms from '@tailwindcss/forms';

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "ink-black": "#0d1321",
        "deep-space-blue": "#1d2d44",
        "blue-slate": "#3e5c76",
        "dusty-denim": "#748cab",
        "eggshell": "#f0ebd8",

        "sidebar": "#0d1321",
        "sidebar-hover": "#1d2d44",
        "sidebar-text": "#f0ebd8",
        "sidebar-muted": "#748cab",
        "sidebar-border": "#1d2d44",

        "primary": "#3e5c76",
        "primary-hover": "#1d2d44",
        "on-primary": "#f0ebd8",

        "background": "#f0ebd8",
        "surface": "#ffffff",
        "on-surface": "#0d1321",
        "on-surface-variant": "#1d2d44",

        "outline": "#748cab",
        "outline-variant": "#3e5c76",

        "danger": "#ef4444",
        "danger-hover": "#dc2626",
      },
      borderRadius: {
        "editorial": "8px",
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'floating': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'float-1': 'float-1 15s infinite ease-in-out',
        'float-2': 'float-2 20s infinite ease-in-out',
        'float-3': 'float-3 25s infinite ease-in-out',
      },
      keyframes: {
        'float-1': {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '33%': { transform: 'translate(50px, -50px) rotate(90deg)' },
          '66%': { transform: 'translate(-20px, 40px) rotate(180deg)' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '33%': { transform: 'translate(-40px, 60px) rotate(-90deg)' },
          '66%': { transform: 'translate(30px, -30px) rotate(-180deg)' },
        },
        'float-3': {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '50%': { transform: 'translate(60px, 20px) rotate(180deg)' },
        }
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
        "body-md": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
      },
      fontSize: {
        "headline-lg": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "label-sm": ["13px", { lineHeight: "18px", fontWeight: "500" }],
      }
    },
  },
  plugins: [
    forms
  ],
}
