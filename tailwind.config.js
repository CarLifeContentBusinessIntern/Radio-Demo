/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import { transform } from 'typescript';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        'toggle-off': {
          '0%': { transform: 'translateY(0)' },
          '100%': {
            transform:
              'translateY(calc(var(--toggle-container-height) - 100% - var(--toggle-padding)))',
          },
        },
        'toggle-on': {
          '0%': {
            transform:
              'translateY(calc(var(--toggle-container-height) - 100% - var(--toggle-padding)))',
          },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'toggle-on': 'toggle-on 0.25s ease-out forwards',
        'toggle-off': 'toggle-off 0.25s ease-out forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
