module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1', // indigo-500
          dark: '#4338ca',   // indigo-700
          light: '#a5b4fc',  // indigo-300
        },
        accent: {
          blue: '#38bdf8',   // sky-400
          teal: '#2dd4bf',   // teal-400
          purple: '#a78bfa', // purple-400
        },
        background: '#f8fafc', // slate-50
        surface: '#fff',
      },
      fontFamily: {
        sans: ["Geist", "Inter", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        xl: '1.25rem',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(60,60,60,0.08)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}; 