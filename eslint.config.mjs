import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
  {
    // les éléments JSX de react-three-fiber (position, args, intensity…)
    // ne sont pas des attributs DOM
    files: ["components/three/**/*.tsx"],
    rules: {
      "react/no-unknown-property": "off",
    },
  },
];

export default config;
