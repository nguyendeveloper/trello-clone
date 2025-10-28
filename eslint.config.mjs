import nextVitals from 'eslint-config-next/core-web-vitals';
import { defineConfig, globalIgnores } from 'eslint/config';
import perfectionist from 'eslint-plugin-perfectionist';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'README.md',
  ]),
  {
    rules: {
      'perfectionist/sort-imports': [
        'warn',
        {
          customGroups: [
            {
              elementNamePattern: '^server-only$',
              groupName: 'server-only',
              modifiers: ['value'],
            },
            {
              elementNamePattern: ['^react$', '^react.+'],
              modifiers: ['value'],
              groupName: 'react',
            },
            {
              elementNamePattern: ['^next.*$', '^next-.+'],
              modifiers: ['value'],
              groupName: 'next',
            },
            {
              elementNamePattern: '^@/components/ui/.+',
              modifiers: ['value'],
              groupName: 'shadcn',
            },
            {
              elementNamePattern: '^@/components/.+',
              groupName: 'components',
              modifiers: ['value'],
            },
            {
              elementNamePattern: '^@/core/lib.+',
              modifiers: ['value'],
              groupName: 'lib',
            },
            {
              elementNamePattern: '^@/modules.+',
              groupName: 'modules',
              modifiers: ['value'],
            },
            {
              elementNamePattern: '^@/.+',
              groupName: 'other-libs',
              modifiers: ['value'],
            },
            {
              elementNamePattern: ['^lucide-react.*', '^@iconify/react.*'],
              modifiers: ['value'],
              groupName: 'icon',
            },
            {
              elementNamePattern: ['^next/font/.+'],
              modifiers: ['value'],
              groupName: 'font',
            },
          ],
          groups: [
            'server-only',
            'type',
            'react',
            'builtin',
            'external',
            'next',
            'internal',
            'shadcn',
            'components',
            'lib',
            'modules',
            'other-libs',
            'parent',
            'sibling',
            'index',
            'icon',
            'font',
            'style',
          ],
          fallbackSort: { type: 'alphabetical', order: 'asc' },
          tsconfig: {
            rootDir: '.',
          },
          partitionByComment: false,
          partitionByNewLine: false,
          type: 'line-length',
          newlinesBetween: 1,
          order: 'desc',
        },
      ],
      'perfectionist/sort-variable-declarations': [
        'warn',
        {
          fallbackSort: { type: 'alphabetical', order: 'asc' },
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-intersection-types': [
        'warn',
        {
          fallbackSort: { type: 'alphabetical', order: 'asc' },
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-object-types': [
        'warn',
        {
          fallbackSort: { type: 'alphabetical', order: 'asc' },
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-union-types': [
        'warn',
        {
          fallbackSort: { type: 'alphabetical', order: 'asc' },
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-interfaces': [
        'warn',
        {
          fallbackSort: { type: 'alphabetical', order: 'asc' },
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-jsx-props': [
        'warn',
        {
          fallbackSort: { type: 'alphabetical', order: 'asc' },
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-classes': [
        'warn',
        {
          fallbackSort: { type: 'alphabetical', order: 'asc' },
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-exports': [
        'warn',
        {
          fallbackSort: { type: 'alphabetical', order: 'asc' },
          type: 'line-length',
          order: 'desc',
        },
      ],
      'perfectionist/sort-objects': [
        'warn',
        {
          fallbackSort: { type: 'alphabetical', order: 'asc' },
          type: 'line-length',
          order: 'desc',
        },
      ],
    },
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', './eslint.config.mjs'],
    plugins: {
      perfectionist,
    },
  },
]);

export default eslintConfig;
