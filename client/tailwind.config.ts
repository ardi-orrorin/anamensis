import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "outset-lg": "0px 1px 8px 0px rgba(0,0,0,0.23)",
      },
      fontSize: {
        "xs2" : "0.7rem",
        "xss" : "0.5rem",
      },
      // backgroundColor:{
      //   "main": "#246DCF",
      // },
      colors: {
        "main": "#246DCF",
      }
    },
  },
  plugins: [],
};
export default config;
