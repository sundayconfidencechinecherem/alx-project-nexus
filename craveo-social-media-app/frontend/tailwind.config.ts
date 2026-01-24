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
        // Primary Colors
        primary: {
          DEFAULT: '#1B9F20',
          hover: '#158518',
          light: '#E8F5E9',
        },
        
        // Background Colors
        background: '#FFFDF9',
        surface: '#FFFFFF',
        'surface-hover': '#F7F7F7',
        
        // Text Colors
        text: {
          primary: '#1A1A1A',
          secondary: '#6B6B6B',
          tertiary: '#A1A1A1',
          inverse: '#FFFFFF',
        },
        
        // UI Colors
        border: '#E0E0E0',
        divider: '#F0F0F0',
        error: '#DC2626',
        success: '#059669',
        warning: '#D97706',
        info: '#2563EB',
      },
      
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
