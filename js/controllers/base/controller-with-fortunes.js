define([
  'chaplin',
  'views/site-view',
  'models/random',
  'views/randomList-view',
  'models/randomList',
  'lib/sockets'
], function(Chaplin, SiteView, Random, RandomListView, RandomList, Sockets) {
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

  var Controller = Chaplin.Controller.extend({

    initialize: function() {
      Controller.__super__.initialize.apply(this, arguments);
    },

    // Place your application-specific controller features here.
    beforeAction: function() {
      var self = this
        , options = {}
        ;
      options.isShort = shortFortunes;

      // --------------------------------------------------------
      // The overall site layout with a placeholder for the push
      // of fortunes from the server, which is loaded below.
      // --------------------------------------------------------
      this.compose('site-view', SiteView);

      // --------------------------------------------------------
      // Render the fortunes pushed from the server across all
      // routes that use controllers which use this controller
      // as a base.
      // --------------------------------------------------------
      this.collection = Chaplin.mediator.randomList;
      this.compose('random-list', RandomListView, {collection: this.collection});

      if (Sockets.isOnline()) {
        // --------------------------------------------------------
        // Get the initial fortune fast so that something is shown.
        // --------------------------------------------------------
        getOne(this, options);

        // --------------------------------------------------------
        // Instruct the server to send fortunes are regular intervals.
        // Name the request so that the server can discern if the job
        // is already running when/if the browser refreshes.
        // --------------------------------------------------------
        options.interval = fortuneInterval;
        options.name = 'Controller';
        setIntervals(this, options);
      } else {
        // --------------------------------------------------------
        // When we come online, we want to get the fortunes that we need.
        // --------------------------------------------------------
        Chaplin.mediator.subscribe('online', function() {
          options.interval = fortuneInterval;
          options.name = 'Controller';
          setIntervals(self, options);
        });
      }
    }
  });

  return Controller;
});
