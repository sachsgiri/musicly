import GithubActionsReporter from 'vitest-github-actions-reporter';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // include: ['**/*.{test}.?(c|m)[jt]s?(x)'],
    environment: 'node',
    globals: false,
    reporters: process.env.GITHUB_ACTIONS ? ['default', new GithubActionsReporter()] : 'default',
    typecheck: {
      enabled: true,
      checker: 'tsc',
      // include: ['*.{test}.?(c|m)[jt]s?(x)'],
    },
    coverage: {
      provider: 'v8',
      exclude: [...(configDefaults.coverage.exclude ?? []), '**/index.ts'],
      thresholds: {
        lines: 0,
        branches: 0,
        functions: 0,
        statements: 0,
      },
    },
  },
});
