/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        sand: '#E8DCC8',
        bark: '#8B6F47',
        charcoal: '#1C1C1C',
        ink: '#0A0A0A',
        rust: '#C4622D',
        sage: '#7A8C6E',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        accent: ['"Cormorant"', 'serif'],
      },
    },
  },
  plugins: [],
}
