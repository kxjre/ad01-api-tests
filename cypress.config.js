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
      overwrite: false,
      html: true,
      json: true
    },
  },
  env: {
    base_url: "https://www.rijksmuseum.nl/api/nl/collection/",
    api_key: "0fiuZFh4"
  }
});
