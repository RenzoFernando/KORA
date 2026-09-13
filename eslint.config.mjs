import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules/**',
      'Branding/**',
      'branding/**',
      'assets/audio/**',
      'assets/img/**',
      'dist/**',
      'build/**',
      'coverage/**',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: globals.browser,
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
    rules: {
      'no-debugger': 'warn',
      'no-dupe-args': 'error',
      'no-dupe-else-if': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-redeclare': 'error',
      'no-unreachable': 'error',
      'no-unsafe-finally': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
    },
  },
];
