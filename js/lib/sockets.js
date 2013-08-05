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
    , isSubSearch = false
    , isSubRandom = false
    , isSubRandomInt = false
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
    if (! isOnline()) {
      return callback('Cannot search because we are currently offline.');
    }
    server.emit('search', options, function(data) {
      callback(null, data);
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
    var isInInitialize = true;

    // --------------------------------------------------------
    // Announce for debugging when we are ready or not.
    // --------------------------------------------------------
    Chaplin.mediator.subscribe('online', function() {
      Utils.debug('Online');
    });
    Chaplin.mediator.subscribe('offline', function() {
      Utils.debug('Offline');
    });

    // --------------------------------------------------------
    // We listen on a specific channel.
    // --------------------------------------------------------
    server = io.connect('/fortunes');

    // --------------------------------------------------------
    // Activate event handling.
    // --------------------------------------------------------
    server.on('connect', function() {
      isConnected = true;

      Utils.debug('Connect');

      // --------------------------------------------------------
      // Precache the answer.
      // --------------------------------------------------------
      sockets.whoami(function(err, username) {

        if (! isSubSearch) {
          Chaplin.mediator.subscribe('search', search);
          isSubSearch = true;
        }

        if (! isSubRandom) {
          Chaplin.mediator.subscribe('random', random);
          isSubRandom = true;
        }

        if (! isSubRandomInt) {
          Chaplin.mediator.subscribe('randomInterval', randomInterval);
          isSubRandomInt = true;
        }

        Chaplin.mediator.publish('online');

        // --------------------------------------------------------
        // Only call the initialize callback once, not everytime
        // the connection is re-established.
        // --------------------------------------------------------
        if (isInInitialize) {
          isInInitialize = false;
          callback();
        }

      }, isInInitialize);   // force whoami() to contact the server on initialize() only
    });

    // --------------------------------------------------------
    // Deactivate event handling.
    // --------------------------------------------------------
    server.on('disconnect', function() {
      isConnected = false;

      Utils.debug('Disconnect');

      Chaplin.mediator.publish('offline');
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
  var isOnline = sockets.isOnline = function() {
    return isConnected;
  };

  return sockets;
});

