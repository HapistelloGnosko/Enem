/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#111118',
        'bg-tertiary': '#181824',
        'bg-card': '#13131c',
        accent: '#7c3aed',
        'accent-bright': '#8b5cf6',
        'accent-glow': '#6d28d9',
        'neon-blue': '#3b82f6',
        'neon-cyan': '#06b6d4',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-accent': '0 0 20px rgba(124, 58, 237, 0.35)',
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.35)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
