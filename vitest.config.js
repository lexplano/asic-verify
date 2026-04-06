import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        coverage: {
            provider: 'v8',
            include: ['lib/**/*.js'],
            reporter: ['text'],
            thresholds: {
                statements: 95,
                branches: 78,
                functions: 93,
                lines: 95,
            },
        },
    },
});
