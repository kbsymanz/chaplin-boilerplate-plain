define([
  'controllers/base/controller',
  'models/random',
  'views/random-view'
], function(Controller, Random, RandomView) {
  'use strict';

  var RandomController = Controller.extend({
    show: function(params) {
      this.model = new Random();
      this.view = new RandomView({
        model: this.model
        , tagName: 'ul'
      });
    }
  });

  return RandomController;
});

