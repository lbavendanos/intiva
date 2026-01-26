/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: false,
  singleQuote: true,
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/types/(.*)$',
    '^@/lib/(.*)$',
    '^@/actions/(.*)$',
    '^@/hooks/(.*)$',
    '^@/components/(.*)$',
    '^@/(.*)$',
    '',
    '^[./]',
  ],
  tailwindFunctions: ['cn', 'cva'],
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
}

export default config
