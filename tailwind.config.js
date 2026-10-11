/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0f172a',
        'secondary': '#ffffff',
        'retro-cream': '#fbf8f2',
        'retro-amber': '#ffde59',
        'retro-coral': '#ff5a5f',
        'retro-blue': '#2563eb',
        'retro-cyan': '#00d2d3',
        'retro-card': '#ffffff',
      },
      fontFamily: {
        'sans': ['Space Grotesk', 'sans-serif'],
        'mono': ['Courier Prime', 'monospace'],
      },
      boxShadow: {
        'retro-sm': '2px 2px 0px #000000',
        'retro': '4px 4px 0px #000000',
        'retro-lg': '6px 6px 0px #000000',
        'retro-xl': '8px 8px 0px #000000',
        'retro-blue': '4px 4px 0px #1e40af',
      },
    },
  },
  plugins: [],
}