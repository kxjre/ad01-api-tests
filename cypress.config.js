const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    retries: 2,
    reporter: "mochawesome",
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      return config;
    },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: true,
      html: true,
      json: true
    },
  },
  env: {
    BASE_URL: "https://www.rijksmuseum.nl/api/nl/collection/",
    API_KEY: "0fiuZFh4"
  }
});
