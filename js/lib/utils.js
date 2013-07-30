define([
  'underscore',
  'chaplin'
], function(_, Chaplin) {
  'use strict'

  // Application-specific utilities
  // ------------------------------

  // Delegate to Chaplin’s utils module
  var utils = Chaplin.utils.beget(Chaplin.utils);

  // Add additional application-specific properties and methods

  _(utils).extend({
    //someProperty: 'foo',
    debug: function(msg) {
      if (Chaplin.mediator.debugging) {
        console.log(msg);
      }
    }
  });

  return utils;
});
