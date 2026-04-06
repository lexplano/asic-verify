import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        coverage: {
            provider: 'v8',
            include: ['lib/**/*.js'],
            reporter: ['text', 'html'],
            thresholds: {
                statements: 96,
                branches: 78,
                functions: 93,
                lines: 96,
            },
        },
    },
});
