const colors = require('tailwindcss/colors')
const settings = require('./src/_data/settings.json')

module.exports = {
  content: ["./**/*.html"],
  theme: {
    fontFamily: {
      sans: ["'Source Sans 3'", 'sans-serif'],
      serif: ["'Source Serif 4'", 'serif'],
    },
    colors: {
      text: colors.black,
      textprimary: colors.white,
      primary: colors[settings.colorName]?.[settings.colorValue] || colors.violet[600],
      grey: colors.gray
    },
    container: {
      center: true,
    },
    extend: {
      borderRadius: {
        DEFAULT: '8px'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text'),
            a: {
              color: theme('colors.primary')
            },
            ol: {
              '& li::marker': {
                color: theme('colors.text')
              }
            }
          }
        }
      }),
      colors: {},
    },
  },
  variants: {},
  plugins: [
    require("@tailwindcss/typography"),
  ]
};
