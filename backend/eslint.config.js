import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used' }],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always']
    }
  }
])
