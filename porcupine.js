var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var server = express();

function Porcupine () {
  'use strict';
}

/**
 * Init Porcupine
 *
 * @param config
 * @param port
 */
Porcupine.prototype.init = function ( config, port ) {
  if ( ! config ) {
    throw new Error( 'Missing the config' );
  }

  server.use( bodyParser.json() );

  var serverModels = {};

  server.get( '/', function ( req, res ) {
    var model = { success : false };
    res.send( model );
  } );

  var fs = require( 'fs' );
  var routes = fs.readdirSync( __dirname + '/routes' );

  routes.forEach( function ( route ) {
    var cleanRoute = route.replace( '.js', '' );

    if ( config.hasOwnProperty( cleanRoute ) ) {
      var configRoute = require( './routes/' + cleanRoute );
      var model = new ( require( './models/' + cleanRoute ) )( config[cleanRoute] );
      serverModels[cleanRoute] = model;

      for ( var key in configRoute ) {
        if ( configRoute.hasOwnProperty( key ) ) {
          server[key]( '/' + cleanRoute, configRoute[key] );
        }
      }
    } else {
      console.log( cleanRoute + ' is not enabled' );
    }
  } );

  server.set( 'models', serverModels );

  if ( ! port ) {
    port = 3000;
  }

  server.listen( port );
};

/**
 * Get EventEmitter singleton
 *
 * @return EventEmitter
 */
Porcupine.prototype.getEventEmitter = function () {
  return require( './models/eventEmitter' );
};

/**
 * Get events model
 *
 * @return object
 */
Porcupine.prototype.getEvents = function () {
  return require( './models/events' );
};

module.exports = new Porcupine();