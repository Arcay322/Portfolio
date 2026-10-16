const globals = Object.fromEntries(
  [
    'window',
    'document',
    'navigator',
    'location',
    'matchMedia',
    'innerWidth',
    'innerHeight',
    'devicePixelRatio',
    'performance',
    'requestAnimationFrame',
    'cancelAnimationFrame',
    'requestIdleCallback',
    'addEventListener',
    'removeEventListener',
    'URL',
    'URLSearchParams',
    'setTimeout',
    'clearTimeout',
    'setImmediate',
    'console',
    'process',
    'Buffer',
    'fetch',
  ].map((name) => [name, 'readonly'])
);
export default [
  {
    files: ['**/*.js', '**/*.mjs'],
    ignores: ['**/vendor/**', '**/node_modules/**', '**/dist/**'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-unreachable': 'error',
      'no-constant-condition': 'error',
      'no-debugger': 'error',
      'no-var': 'error',
      eqeqeq: 'error',
    },
  },
];
