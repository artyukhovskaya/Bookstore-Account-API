const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx,feature}',
    screenshotOnRunFailure: true,
    testIsolation: true,
    viewportWidth: 1280, 
    viewportHeight: 720
  },
});
