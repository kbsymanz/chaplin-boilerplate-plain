define([
  'chaplin',
  'socketio'
], function(Chaplin, io) {
  'use strict';

  var sockets = {}
    , client
    ;

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
    client.emit('search', options, function(data) {
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
    client.emit('random', options, function(data) {
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
    client.emit('random', options, function(msgKey) {
      client.on(msgKey, callback);
    });
  };

  /* --------------------------------------------------------
   * initialize()
   *
   * Public: initialize communications with the server and
   * listen for client-side events.
   *
   * param       undefined
   * return      undefined
   * -------------------------------------------------------- */
  sockets.initialize = function() {
    client = io.connect('/fortunes');

    // --------------------------------------------------------
    // Activate event handling.
    // --------------------------------------------------------
    client.on('connect', function() {
      console.log('Connected');

      Chaplin.mediator.subscribe('search', search);
      console.log('Subscribed to search');

      Chaplin.mediator.subscribe('random', random);
      console.log('Subscribed to random');

      Chaplin.mediator.subscribe('randomInterval', randomInterval);
      console.log('Subscribed to randomInterval');

      Chaplin.mediator.publish('online');
    });

    // --------------------------------------------------------
    // Deactivate event handling.
    // --------------------------------------------------------
    client.on('disconnect', function() {
      console.log('Disconnect');
      Chaplin.mediator.publish('offline');

      Chaplin.mediator.unsubscribe('search', search);
      console.log('Unsubscribed from search');

      Chaplin.mediator.unsubscribe('random', search);
      console.log('Unsubscribed from random');

      Chaplin.mediator.unsubscribe('randomInterval', search);
      console.log('Unsubscribed from randomInterval');
    });
  };

  return sockets;
});

