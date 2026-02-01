import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        accent: '#dc2626',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        wowoLight: {
          primary: '#000000',
          secondary: '#dc2626',
          accent: '#ef4444',
          neutral: '#1f2937',
          'base-100': '#ffffff',
        },
      },
      {
        wowoDark: {
          primary: '#ffffff',
          secondary: '#dc2626',
          accent: '#ef4444',
          neutral: '#111827',
          'base-100': '#000000',
        },
      },
    ],
  },
}
