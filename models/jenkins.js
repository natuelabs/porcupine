/**
 * Jenkins integration
 *
 * @constructor
 */
function Jenkins ( config ) {
  'use strict';

  this.config = config;
  this.request = require( 'request' );
  this.events = require( './events' );
  this.eventEmitter = require( './eventEmitter' );

  this.initEvents();
}

/**
 * Init events
 */
Jenkins.prototype.initEvents = function () {
  this.eventEmitter.on(
    this.events.jenkins.job.build,
    this.handleJobBuild.bind( this )
  );
};

/**
 * Call jenkins API
 *
 * @param apiPath
 * @param method
 * @param data
 * @param callback
 */
Jenkins.prototype.callApi = function ( apiPath, method, data, callback ) {
  console.log( '[-->] Jenkins API ' + apiPath );

  var auth = new Buffer( this.config.user + ':' + this.config.pass ).toString( 'base64' );

  var options = {
    url : this.config.baseUrl + apiPath,
    method : method,
    headers : {
      Authorization : 'Basic ' + auth
    },
    form : data
  };

  this.request( options, function ( error, response, body ) {
    if ( ! error && response.statusCode >= 200 && response.statusCode < 300 ) {
      callback( null, body );
    } else {
      callback( true, body );
    }
  } );
};

/**
 * @see events documentation
 *
 * @param data
 * @param callback
 */
Jenkins.prototype.handleJobBuild = function ( data, callback ) {
  var jobUrl = 'build';
  if ( data.params !== undefined ) {
    jobUrl = 'buildWithParameters';
  }

  this.callApi(
    '/job/' + data.job + '/' + jobUrl,
    'POST',
    data.params,
    callback
  );
};

module.exports = Jenkins;