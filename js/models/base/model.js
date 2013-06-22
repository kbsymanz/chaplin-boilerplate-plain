define([
  'chaplin'
], function(Chaplin) {
  'use strict';

  var Model = Chaplin.Model.extend({

    // --------------------------------------------------------
    // We override the read method to use the sub-classes' own
    // getData() method to do the work.
    // --------------------------------------------------------
    sync: function(method, model, options) {
      if (method === 'read' && typeof this.getData === 'function') {
        this.getData(function(message) {
          model.set(options.field, message);
        });
      } else {
        Model.__super__.initialize.call(this, method, model, options);
      }
    }
  });

  return Model;
});
