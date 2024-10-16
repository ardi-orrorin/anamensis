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
      colors: {
        "main": "#246DCF",
      },
      borderWidth: {
        '5'  : '5px',
        '6'  : '6px',
        '12' : '12px',
      }
    },
  },
  safelist: [
      'bg-green-500',
      'bg-black',
      'bg-red-500',
      'bg-orange-600',
      'bg-gray-200',
      'bg-gray-100',
      'bg-yellow-600',
  ],
  plugins: [],
};
export default config;
