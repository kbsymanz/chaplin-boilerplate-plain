define([
  'chaplin',
  'underscore',
  'socketio',
  'lib/utils'
], function(Chaplin, _, io, Utils) {
  'use strict';

  var sockets = {}
    , server
    , isConnected = false
    ;

  /* --------------------------------------------------------
   * whoami()
   *
   * Who does the server say that I am? Returns the username
   * to the caller. Caches the result so that a server call
   * is not needed everytime.
   *
   * param       callback
   * param       checkServer - don't trust cache; check the server again
   * return      undefined
   * -------------------------------------------------------- */
  var whoami = null;
  sockets.whoami = function(cb, checkServer) {
    if (! _.isFunction(cb)) {
      Utils.debug('Error: Sockets.whoami() called without a callback.');
      return;
    }
    if (! checkServer && whoami) return cb(null, whoami);
    server.emit('whoami', function(err, username) {
      if (err) {
        Utils.debug(err);
        return cb(err);
      }
      whoami = username;
      return cb(null, username);
    });
  };

  /* --------------------------------------------------------
   * search()
   *
   * Private: send the search request to the server and handle the
   * response.
   *
   * param       options  (optional)
   * param       callback
   * return      undefined
   * -------------------------------------------------------- */
  var search = function(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    server.emit('search', options, function(data) {
      callback(data);
    });
  };

  /* --------------------------------------------------------
   * random()
   *
   * Private: send the request for a random fortune to the server
   * and handle the response.
   *
   * param       options  (optional)
   * param       callback
   * return      undefined
   * -------------------------------------------------------- */
  var random = function(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    server.emit('random', options, function(data) {
      callback(data);
    });
  };

  /* --------------------------------------------------------
   * randomInterval()
   *
   * Private: instruct the server to emit fortunes at specific
   * intervals. Server responds with the message key to listen
   * for.
   *
   * param       options
   * param       callback
   * return      undefined
   * -------------------------------------------------------- */
  var randomInterval = function(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options || (options = {});
    if (! options.interval) {
      options.interval = 60;    // default seconds between fortunes
    }
    server.emit('random', options, function(msgKey) {
      server.on(msgKey, callback);
    });
  };

  /* --------------------------------------------------------
   * sessionExpired()
   *
   * Simplistic implementation to handle session expiration.
   *
   * param       location - the url of the login page possibly
   * return      undefined
   * -------------------------------------------------------- */
  var sessionExpired = function(location) {
    alert('Session has expired. Please login again.');
    console.dir(location);
    if (location) {
      window.location = location[0];
    }
  };

  /* --------------------------------------------------------
   * initialize()
   *
   * Public: initialize communications with the server and
   * listen for client-side events.
   *
   * param       callback   callback when done
   * return      undefined
   * -------------------------------------------------------- */
  sockets.initialize = function(callback) {
    server = io.connect('/fortunes');

    // --------------------------------------------------------
    // Activate event handling.
    // --------------------------------------------------------
    server.on('connect', function() {

      Utils.debug('Connected');

      // --------------------------------------------------------
      // Precache the answer.
      // --------------------------------------------------------
      sockets.whoami(function(err, username) {

        Chaplin.mediator.subscribe('search', search);
        //Utils.debug('Subscribed to search');

        Chaplin.mediator.subscribe('random', random);
        //Utils.debug('Subscribed to random');

        Chaplin.mediator.subscribe('randomInterval', randomInterval);
        //Utils.debug('Subscribed to randomInterval');

        Chaplin.mediator.publish('online');
        Utils.debug('Online');

        isConnected = true;

        callback();

      }, true);
    });

    // --------------------------------------------------------
    // Deactivate event handling.
    // --------------------------------------------------------
    server.on('disconnect', function() {
      isConnected = false;

      Utils.debug('Disconnect');

      Chaplin.mediator.publish('offline');
      Utils.debug('Offline');

      Chaplin.mediator.unsubscribe('search', search);
      //Utils.debug('Unsubscribed from search');

      Chaplin.mediator.unsubscribe('random', random);
      //Utils.debug('Unsubscribed from random');

      Chaplin.mediator.unsubscribe('randomInterval', randomInterval);
      //Utils.debug('Unsubscribed from randomInterval');
    });

    server.on('sessionExpired', sessionExpired);

    server.on('reconnect', function() {
      Utils.debug('reconnect');
    });
    server.on('reconnecting', function() {
      Utils.debug('reconnecting');
    });
    server.on('connecting', function() {
      Utils.debug('connecting');
    });
    server.on('connect_failed', function() {
      Utils.debug('connect_failed');
    });
    server.on('reconnect_failed', function() {
      Utils.debug('reconnect_failed');
    });
    server.on('close', function() {
      Utils.debug('close');
    });

  };

  /* --------------------------------------------------------
   * isOnline()
   *
   * Is the socket connected to the server now?
   *
   * param       undefined
   * return      boolean
   * -------------------------------------------------------- */
  sockets.isOnline = function() {
    return isConnected;
  };

  return sockets;
});

