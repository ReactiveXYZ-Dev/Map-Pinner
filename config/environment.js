'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'site',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },
    
    contentSecurityPolicy: {
      'img-src': "'self' data: *.mapbox.com",
      'child-src': "blob:",
      'connect-src': "'self' *.mapbox.com"
    },

    'mapbox-gl': {
      accessToken: 'pk.eyJ1IjoicmVhY3RpdmV4eXoiLCJhIjoiY2pldWd3ZG02NzZtMDJ4bzczeHh5anhwaiJ9.NgHQVPh5UAquYGZQ79Bjew',
      map: {
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 4,
        center: [-96.0469, 36.24] // default center to US
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
