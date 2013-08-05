define([
  'chaplin',
  'lib/utils',
  'lib/sockets',
  'routes',
  'models/searchList',
  'models/randomList'
], function(Chaplin, Utils, Sockets, routes, SearchList, RandomList) {
  'use strict';

  // The application object
  // Choose a meaningful name for your application
  var Application = Chaplin.Application.extend({

    // Set your application name here so the document title is set to
    // “Controller title – Site title” (see Layout#adjustTitle)
    title: 'Chaplin Example Application',

    initialize: function() {
      var self = this;

      // --------------------------------------------------------
      // Whether debugging is turned on or not.
      // --------------------------------------------------------
      Chaplin.mediator.debugging = true;

      // Call the parent constructor.
      Chaplin.Application.prototype.initialize.apply(this, arguments);

      // Initialize core components.
      // ---------------------------

      // Register all routes and start routing.
      // You might pass Router/History options as the second parameter.
      // Chaplin enables pushState per default and Backbone uses / as
      // the root per default. You might change that in the options
      // if necessary:
      // this.initRouter(routes, {pushState: false, root: '/subdir/'});
      this.initRouter(routes);

      // Dispatcher listens for routing events and initialises controllers.
      this.initDispatcher({controllerSuffix: '-controller'});

      // Layout listens for click events & delegates internal links to router.
      this.initLayout();

      // Composer grants the ability for views and stuff to be persisted.
      this.initComposer();

      // Establish the Socket.io connection and don't start the rest until the
      // Socket.io connection is established.
      Sockets.initialize(function() {
        // Mediator is a global message broker which implements pub-sub pattern.
        self.initMediator(function() {
          // Actually start routing.
          Utils.debug('Starting routing');
          self.startRouting();

          // Freeze the application instance to prevent further changes.
          if (Object.freeze) Object.freeze(self);
        });
      });
    },

    // Create additional mediator properties
    // Note: Socket.initialize() creates some too.
    // -------------------------------------
    initMediator: function(callback) {

      // Add additional application-specific properties and methods
      // e.g. mediator.prop = null
      // Create a user property
      // Add additional application-specific properties and methods
      // Seal the mediator

      // --------------------------------------------------------
      // Function to report whether we have a connection to the
      // server at the moment.
      // --------------------------------------------------------
      Chaplin.mediator.isOnline = function() {
        return Sockets.isOnline();
      };

      // --------------------------------------------------------
      // Report who the server says that we are, i.e. the username.
      // --------------------------------------------------------
      Chaplin.mediator.whoami = function(cb, checkServer) {
        Sockets.whoami(cb, checkServer);
      };

      // --------------------------------------------------------
      // Our history of searches and their respective search
      // results that are globally available outside of the domain
      // of any one controller.
      // --------------------------------------------------------
      Chaplin.mediator.searchList = new SearchList();

      // --------------------------------------------------------
      // Collection to hold the fortunes that the server pushes.
      // --------------------------------------------------------
      Chaplin.mediator.randomList = new RandomList();

      Chaplin.mediator.seal();

      _.isFunction(callback) && callback();
    }
  });

  return Application;
});
