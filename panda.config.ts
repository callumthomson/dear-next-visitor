import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  globalCss: {
    body: {
      background: 'zinc.700',
      color: 'zinc.300',
      fontFamily: "main",
    },
    'h1, h2, h3, h4, h5, h6': {
      fontFamily: "hand",
    },
    p: {
      letterSpacing: "wider",
    },
    a: {
      textDecoration: "underline",
    },
  },

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        fonts: {
          main: { value: `'Montserrat', sans-serif` },
          hand: { value: `'Shadows Into Light', handwriting`}
        }
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
