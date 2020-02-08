const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const postcssPurgecss = require('@fullhuman/postcss-purgecss');

const purgecss = postcssPurgecss({
  content: [
    './public/**/*.html',
    './src/**/*.vue',
    './src/**/*.ts',
  ],
  whitelistPatterns: [
    /-(leave|enter|appear)(|-(to|from|active))$/,
    /^(?!(|.*?:)cursor-move).+-move$/,
    /^router-link(|-exact)-active$/,
    /^(tui.*|te.*|CodeMirror.*|hljs.*|code|pre)/,
  ],
  whitelistPatternsChildren: [
    /-(leave|enter|appear)(|-(to|from|active))$/,
    /^(?!(|.*?:)cursor-move).+-move$/,
    /^router-link(|-exact)-active$/,
    /^(tui.*|te.*|CodeMirror.*|hljs.*|code|pre)/,
  ],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
    ...process.env.NODE_ENV === 'production' ? [purgecss] : [],
  ],
};
