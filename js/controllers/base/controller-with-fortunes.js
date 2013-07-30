define([
  'chaplin',
  'lib/utils',
  'lib/sockets',
  'views/site-view',
  'views/randomList-view',
  'views/historyList-view',
  'models/random',
  'models/randomList',
  'bootstrap'       // Force Bootstrap JS to load
], function(Chaplin, Utils, Sockets, SiteView, RandomListView, HistoryListView, Random, RandomList) {
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
   * param       options
   * return      undefined
   * -------------------------------------------------------- */
  var getOne = function(options) {
    Chaplin.mediator.publish('random', options, function(fortune) {
      var model = new Random({msg: fortune});
      Chaplin.mediator.randomList.add(model);
    });
  };

  /* --------------------------------------------------------
   * setIntervals()
   *
   * Instructs the server to send a fortune at a regular
   * interval.
   *
   * param       options
   * return      undefined
   * -------------------------------------------------------- */
  var setIntervals = function(options) {
    Chaplin.mediator.publish('randomInterval', options, function(fortune) {
      var model = new Random({msg: fortune});
      Chaplin.mediator.randomList.add(model, {at: 0});
    });
  };

  var ControllerWithFortunes = Chaplin.Controller.extend({

    initialize: function() {
      ControllerWithFortunes.__super__.initialize.apply(this, arguments);
    },

    // Place your application-specific controller features here.
    beforeAction: function() {
      var self = this
        , options = {}
        , rList = Chaplin.mediator.randomList
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
      this.compose('random-section', RandomListView, {collection: rList});

      if (rList.length == 0) {
        if (Sockets.isOnline()) {
          // --------------------------------------------------------
          // Get the initial fortune fast so that something is shown.
          // --------------------------------------------------------
          getOne(options);

          // --------------------------------------------------------
          // Instruct the server to send fortunes are regular intervals.
          // Name the request so that the server can discern if the job
          // is already running when/if the browser refreshes.
          // --------------------------------------------------------
          options.interval = fortuneInterval;
          options.name = 'ControllerWithFortunes';
          setIntervals(options);
        } else {
          // --------------------------------------------------------
          // When we come online, we want to get the fortunes that we need.
          // --------------------------------------------------------
          Chaplin.mediator.subscribe('online', function() {
            options.interval = fortuneInterval;
            options.name = 'ControllerWithFortunes';
            setIntervals(options);
          });
        }
      }

      // --------------------------------------------------------
      // The history section which shows all of the prior searches.
      // --------------------------------------------------------
      this.compose('history-section', HistoryListView, {collection: Chaplin.mediator.searchList});

    }

  });

  return ControllerWithFortunes;
});
