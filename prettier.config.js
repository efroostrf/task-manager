/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindConfig: './tailwind.config.ts',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'auto',
  printWidth: 80,
  trailingComma: 'all',
  arrowParens: 'avoid',
};

module.exports = config;
