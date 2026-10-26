import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import hooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'backend/**', 'public/**'] },
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.ts', '*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': hooks },
    rules: { 'react-hooks/rules-of-hooks': 'error' },
  },
  {
    files: ['scripts/**/*.mjs', '*.js'],
    ...js.configs.recommended,
    languageOptions: { globals: globals.node },
  },
  prettier,
);
