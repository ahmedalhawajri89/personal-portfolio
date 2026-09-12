export default {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './content/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        ar: ['var(--font-ar)', 'system-ui', 'sans-serif'],
        en: ['var(--font-en)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
