const antfu = require('@antfu/eslint-config')

module.exports = antfu.default(
  {
    rules: {
      'yaml/no-empty-document': 'off',
      'curly': ['error', 'multi-line', 'consistent'],
      'quotes': ['error', 'single'],
      'ts/ban-ts-comment': 'off',
      'style/max-statements-per-line': 'off',
      'import/order': 'warn',
      'ts/prefer-ts-expect-error': 'off',
      'no-console': 'off',
      'ts/ban-types': 'off',
      'vue/one-component-per-file': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
      'ts/no-namespace': 'off',
      'new-cap': 'off',
      'vue/require-explicit-emits': 'off',
    },
  },
)
