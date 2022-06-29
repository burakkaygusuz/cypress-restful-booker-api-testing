const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://restful-booker.herokuapp.com',
    responseTimeout: 30000,
    video: false,
    env: {
      username: 'admin',
      password: 'password123',
    },

    setupNodeEvents(on, config) {
      on('file:preprocessor', createBundler());
    },
  },
});
