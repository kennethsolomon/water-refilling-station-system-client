module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier'],
  plugins: [],
  // add your custom rules here
  rules: {
    'no-unused-expressions': 'off',
    'vue/multi-word-component-names': 'off',
    'camelcase': 'off',
    'vue/valid-v-slot': 'off'
  },
}
