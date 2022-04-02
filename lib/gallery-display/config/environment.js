/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'gallery-display',
    environment,

    APP: {}
  };

  ENV.APP.apiHost = process.env.API_HOST || "http://localhost:3030";

  return ENV;
};
