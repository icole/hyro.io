"use strict";

module.exports = function (environment) {
  let ENV = {
    modulePrefix: "hyro",
    environment,
    rootURL: "/",
    historySupportMiddleware: true,
    locationType: "auto",
    ifa: { enabled: true },
    "ember-websockets": {
      socketIO: true,
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === "development") {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === "test") {
    // Testem prefers this...
    ENV.locationType = "none";

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = "#ember-testing";
    ENV.APP.autoboot = false;
  }

  if (environment === "production") {
    // here you can enable a production-specific feature
  }

  //ENV.APP.apiHost = process.env.API_HOST || "http://localhost:3030";
  //ENV.APP.contractsPath = process.env.CONTRACTS_PATH || "/local_contracts/";

  ENV["ember-simple-auth-token"] = {
    serverTokenEndpoint: `${ENV.APP.apiHost}/authentication`, // Server endpoint to send authenticate request
    tokenPropertyName: "accessToken", // Key in server response that contains the access token
    headers: {}, // Headers to add to the
  };

  return ENV;
};
