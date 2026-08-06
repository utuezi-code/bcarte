import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C47FF',
          hover:   '#5B38EE',
          light:   '#F0EDFF',
          border:  '#C4B5FD',
        },
        secondary: {
          DEFAULT: '#C9A84C',
          light:   '#FFFBEB',
          border:  '#FDE68A',
        },
        'text-primary':   '#0C0A18',
        'text-secondary': '#6B7280',
        'text-tertiary':  '#9CA3AF',
        'bg-light':       '#F7F6FF',
        'bg-subtle':      '#FAFAFA',
        border:           '#EBEBF0',
        'border-subtle':  '#F3F4F6',
        'border-strong':  '#D1D5DB',
        success: {
          DEFAULT: '#059669',
          light:   '#ECFDF5',
        },
        danger:    '#DC2626',
        whatsapp:  '#25D366',

        // sidebar
        'sidebar-bg':     '#0F0E1A',
        'sidebar-border': 'rgba(255,255,255,0.07)',
        'sidebar-text':   'rgba(255,255,255,0.55)',
        'sidebar-active': 'rgba(108,71,255,0.18)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        btn:      '10px',
        card:     '14px',
        'card-lg':'18px',
        badge:    '20px',
        input:    '10px',
      },
      boxShadow: {
        card:   '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
        'ring-primary': '0 0 0 3px rgba(108,71,255,0.15)',
      },
    },
  },
  plugins: [],
}

export default config
