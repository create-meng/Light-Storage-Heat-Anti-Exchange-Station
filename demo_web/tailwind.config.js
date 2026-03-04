/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0a0a1a',
        'space-secondary': '#1a1a2e',
        'accent-blue': '#4f46e5',
        'status-normal': '#22c55e',
        'status-warning': '#eab308',
        'status-danger': '#f97316',
        'status-critical': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
