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
          DEFAULT: '#7C5CBF',
          hover: '#6B4DAE',
          light: '#F5F3FF',
          border: '#DDD6FE',
        },
        secondary: {
          DEFAULT: '#C9A84C',
          light: '#FFFBEB',
          border: '#FDE68A',
        },
        'text-primary': '#0C0A18',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
        'bg-light': '#FAFAFA',
        border: '#E5E7EB',
        'border-subtle': '#F3F4F6',
        success: {
          DEFAULT: '#059669',
          light: '#ECFDF5',
        },
        danger: '#DC2626',
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        btn: '8px',
        card: '12px',
        'card-lg': '16px',
        badge: '20px',
        input: '8px',
      },
    },
  },
  plugins: [],
}

export default config
