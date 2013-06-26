define([
  'chaplin',
  'controllers/base/controller',
  'models/random',
  'models/randomList',
  'views/randomList-view',
  'lib/sockets'
], function(Chaplin, Controller, Random, RandomList, RandomListView, Sockets) {
  'use strict';

  var fortuneInterval = 10
    , shortFortunes = true
    ;

  /* --------------------------------------------------------
   * getOne()
   *
   * Get one fortune immediately so that something is shown
   * while we wait for the fortunes to arrive at intervals.
   *
   * param       context - the RandomController
   * param       options
   * return      undefined
   * -------------------------------------------------------- */
  var getOne = function(context, options) {
    Chaplin.mediator.publish('random', options, function(fortune) {
      context.model = new Random({msg: fortune});
      context.collection.add(context.model);
    });
  };

  /* --------------------------------------------------------
   * setIntervals()
   *
   * Instructs the server to send a fortune at a regular
   * interval.
   *
   * param       context - the RandomController
   * param       options
   * return      undefined
   * -------------------------------------------------------- */
  var setIntervals = function(context, options) {
    Chaplin.mediator.publish('randomInterval', options, function(fortune) {
      context.model = new Random({msg: fortune});
      context.collection.add(context.model, {at: 0});
    });
  };

  var RandomController = Controller.extend({
    show: function(params) {
      var self = this
        , options = {}
        ;
      options.isShort = shortFortunes;
      this.collection = new RandomList();
      self.view = new RandomListView({
        collection: self.collection
      });

      if (Sockets.isOnline()) {
        console.log('RandomController.show() - isOnline call');

        // --------------------------------------------------------
        // Get the initial fortune fast so that something is shown.
        // --------------------------------------------------------
        getOne(this, options);

        // --------------------------------------------------------
        // Instruct the server to send fortunes are regular intervals.
        // --------------------------------------------------------
        options.interval = fortuneInterval;
        setIntervals(this, options);
      } else {
        // --------------------------------------------------------
        // When we come online, we want to get the fortunes that we need.
        // --------------------------------------------------------
        Chaplin.mediator.subscribe('online', function() {
          options.interval = fortuneInterval;
          setIntervals(self, options);
        });
      }
    }
  });

  return RandomController;
});

