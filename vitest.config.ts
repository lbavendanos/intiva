import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', '__tests__/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', '__tests__/e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        '.next',
        '**/*.config.{ts,js,mts}',
        '**/*.d.ts',
        '__tests__/e2e',
      ],
    },
  },
})
