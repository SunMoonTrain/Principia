import { defineConfig } from 'vitest/config';

// 单独的配置：测试不加载内容插件，避免每次跑测试都编译一遍 content/
export default defineConfig({
  test: {
    include: ['compiler/**/*.test.ts', 'shared/**/*.test.ts', 'server/**/*.test.ts', 'tools/**/*.test.ts', 'src/**/*.test.ts', 'packages/**/*.test.ts'],
    environment: 'node',
    testTimeout: 30000,
  },
});
