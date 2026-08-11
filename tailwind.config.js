/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // LCA Resource "Sage & Oak" identity
        teal: {
          DEFAULT: '#295A66', // primary — headings / primary UI
        },
        charcoal: '#4C483D', // body text
        ground: '#E4E3E2', // page ground / panels
        // Secondary data-series + accent palette
        sage: '#8DBB70',
        oak: '#D0A06F',
        gold: '#F0BB44',
        skyteal: '#61ADBF',
        plum: '#A3648B',
        orange: '#F8943F',
      },
      fontFamily: {
        heading: ['"Century Gothic"', '"Open Sans"', 'system-ui', 'sans-serif'],
        body: ['Garamond', '"EB Garamond"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
