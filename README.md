# Chaplin Front-end for the Fortunes Server

This is a proof of concept to illustrate the use of [Chaplin.js](http://chaplinjs.org) as a front-end framework for the [Fortunes Server](https://github.com/kbsymanz/fortunes-chaplin). The purpose of this project is to help our team decide on a client-side framework to use internally. If others find this useful, all the better.

In a manner similar to [ToDoMVC](http://todomvc.com/), the goal is to explore [Backbone](http://backbonejs.org/) based front-end client frameworks against a common backend. In this case, the [Fortunes Server](https://github.com/kbsymanz/fortunes-server) is our backend which provides a number of services to the client over [Socket.io](http://socket.io/). We are not interested per se in "fortunes" - the fortunes are data and the server offers services against the data. The server could have been implemented with any other dataset.

These front-ends are on the list to be implemented.

- [Chaplin.js](http://chaplinjs.org): (you are looking at it)
- [Marionette](http://marionettejs.com/): to be implemented
- [Aura](http://aurajs.com/): to be implemented

## Primary technologies being explored/integrated

- Various Backbone based frameworks (see above)
- [Socket.io](http://socket.io/)
- [Bootstrap](http://twitter.github.io/bootstrap/)
- [Requirejs](http://requirejs.org/)
- [Handlebars](http://handlebarsjs.com/)
- [HTML5 LocalStorage](http://en.wikipedia.org/wiki/Web_storage)

## Installation of the server

See the README on the [fortunes-server](https://github.com/kbsymanz/fortunes-server) project. This has to be done first because the clients are not meant to be run stand-alone.

## Installation of the clients

You installed the server, right? If so, clone each client project that you want into it's own directory.

    git clone https://github.com/kbsymanz/fortunes-chaplin.git

## Running the server and clients

See the README on the [fortunes-server](https://github.com/kbsymanz/fortunes-server) project on how to start the server, including with various options. Then navigate to __127.0.0.1:9000__ (default unless you changed it with one of those options outlined on the server project).


