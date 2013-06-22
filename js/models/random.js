define([
  'chaplin',
  'models/base/model'
], function(Chaplin, Model) {
  'use strict';

  /* --------------------------------------------------------
   * getRandom()
   *
   * Ultimately called when the read operation of Backbone.sync()
   * is called.
   *
   * API: private
   *
   * param       cb     callback
   * return      undefined
   * -------------------------------------------------------- */
  var getRandom = function(cb) {
    console.log('getRandom()');
    Chaplin.mediator.publish('random', function(msg) {
      console.log(msg);
      cb(msg);
    });
  };

  var Random = Model.extend({
    defaults: {
      msg: 'Waiting for server ...'
    }

    ,initialize: function(attributes, options) {
      var self = this
        , options = {}
        ;
      Model.prototype.initialize.apply(this, arguments);

      // --------------------------------------------------------
      // Get the initial fortune to because the fortunes will not
      // start arriving for options.interval seconds below.
      // --------------------------------------------------------
      options.isShort = true;
      Chaplin.mediator.publish('random', options, function(fortune) {
        self.set('msg', fortune);
      });

      // --------------------------------------------------------
      // Instruct server to emit random fortunes.
      // --------------------------------------------------------
      options.interval = 10;
      Chaplin.mediator.publish('randomInterval', options, function(fortune) {
        self.set('msg', fortune);
      });
    },

    // --------------------------------------------------------
    // Used by Backbone.sync() for read operations.
    // --------------------------------------------------------
    getData: getRandom
  });

  return Random;
});

