/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bambinos: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Core Bambinos Blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          dark: '#0f172a',
          surface: '#ffffff',
          card: '#f8fafc',
          boardLight: '#f1f5f9',
          boardDark: '#3b82f6',
          boardDarkSquare: '#2563eb',
          highlight: 'rgba(250, 204, 21, 0.5)',
          moveSelect: 'rgba(59, 130, 246, 0.4)'
        }
      }
    },
  },
  plugins: [],
}
