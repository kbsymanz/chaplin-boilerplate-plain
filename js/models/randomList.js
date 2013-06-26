define([
  'chaplin',
  'models/base/collection'
], function(Chaplin, Collection) {
  'use strict';

  var maxFortunes = 3;

  var RandomList = Collection.extend({

    initialize: function(attributes, options) {
      Collection.prototype.initialize.apply(this, arguments);

      this.on('add', this.prune, this);
    },

    // --------------------------------------------------------
    // Keep the list of fortunes to a set length.
    // --------------------------------------------------------
    prune: function(model) {
      if (this.length > maxFortunes) {
        this.pop();
      }
    }

  });

  return RandomList;
});

