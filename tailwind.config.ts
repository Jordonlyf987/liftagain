/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:         '#f7f3ee',
          card:       '#ffffff',
          sidebar:    '#1e1a16',
          sidebar2:   '#2a2420',
          coral:      '#e8633a',
          coralSoft:  '#fdf0eb',
          coralMid:   '#f5c4ae',
          purple:     '#7c4dff',
          purpleSoft: '#ede9ff',
          teal:       '#2eb88a',
          tealSoft:   '#e6f7f2',
          yellow:     '#f5c518',
          yellowSoft: '#fef9e7',
          red:        '#e03131',
          redSoft:    '#fff0f0',
          text:       '#1e1a16',
          textMid:    '#5a5048',
          textLight:  '#9b8f84',
          border:     '#ede8e2',
          borderMid:  '#d9d0c8',
        },
      },
      fontFamily: {
        sans:  ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono:  ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(232,99,58,0.12)',
      },
    },
  },
  plugins: [],
};
