import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#247BF7',
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#baddff',
          300: '#7cc2ff',
          400: '#36a3ff',
          500: '#247BF7',
          600: '#1a5fcc',
          700: '#1E40AF',
          800: '#1a3480',
          900: '#162b66',
        },
        secondary: {
          DEFAULT: '#1E40AF',
          50: '#eff6ff',
          100: '#dbebfe',
          500: '#1E40AF',
          700: '#153084',
          900: '#0f235e',
        },
      },
      backgroundImage: {
        'grid-slate-100': 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'rgb(241 245 249 / 0.5)\'%3e%3cpath d=\'M0 .5H31.5V32\'/%3e%3c/svg%3e")',
        'grid-white': 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'rgb(255 255 255 / 0.1)\'%3e%3cpath d=\'M0 .5H31.5V32\'/%3e%3c/svg%3e")',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(36, 123, 247, 0.3)',
        'glow-lg': '0 0 40px rgba(36, 123, 247, 0.4)',
      },
    },
  },
  plugins: [],
}

export default config