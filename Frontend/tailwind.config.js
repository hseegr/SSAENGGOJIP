/** @type {import('tailwindcss').Config} */
import { defineConfig } from 'vite'
import path from 'path'
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ssaeng-purple': '#7171D7',
        'ssaeng-green': '#5195F7',
        'ssaeng-gray-1': '#F4F4F4',
        'ssaeng-gray-2': '#E5E5E5',
        'ssaeng-gray-3': '#FCFCFC',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      fontFamily: {
        sans: ['Montserrat', 'Pretendard', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        pretendard: ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
