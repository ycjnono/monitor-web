module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2021,
    sourceType: "module"
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: 'off',
    quotes: 'off',
    'no-dupe-keys': 'off',
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
}
