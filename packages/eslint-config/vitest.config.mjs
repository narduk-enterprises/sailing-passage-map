/** @type {import('vitest').UserConfig} */
export default {
  test: {
    globals: true,
    environment: 'node',
    include: ['eslint-plugins/tests/**/*.test.mjs'],
  },
}
