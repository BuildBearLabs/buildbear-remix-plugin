/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['selector', '[style*="--theme: dark"]', 'class'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    },
    extend: {
      borderRadius: {
        sm: '3px',
      },
      colors: {
        border: 'hsl(var(--border))',
      },
    },
  },
  plugins: [],
}
