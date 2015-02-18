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
  this.crypto = require( 'crypto' );
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
 * Process jenkins hooks
 *
 * You can use bash script to send hooks from your Jenkins
 * to Porcupine.
 *
 * @param req
 */
Jenkins.prototype.process = function ( req ) {
  var type = req.get( 'x-jenkins-event' );

  if ( this.validateRequest( req ) === false ) {
    console.log( '[-->] Jenkins request is invalid' );

    return false;
  }

  switch ( type ) {
    case 'commit':
      /**
       * This event is used for continuous integration and
       * should contain the commit hash, the status of the build,
       * job name and the build URL, for example:
       *
       * <code>
       *   {
       *    "commit" : "574607f5e8a49a2c82475737484f193856d4b430",
       *    "status" : "pending"|"success"|"error"|"failure",
       *    "job" : "job-name",
       *    "buildUrl" : "https://jenkins-url/job/job-name/1"
       *   }
       * </code>
       *
       * It can be used together with GitHub commit status
       * to show the status on pull requests.
       *
       * @see README.md
       */
      this.processCommit( req );
      break;
  }
};

/**
 * Validate request
 *
 * @param req
 */
Jenkins.prototype.validateRequest = function ( req ) {
  if ( this.config.secret === undefined ) {
    console.log( '[-->] Jenkins security is not in use' );

    return true;
  }

  var hash = this.crypto.createHmac( 'sha1', this.config.secret )
    .update( JSON.stringify( req.body ) );

  var hashCalculated = hash.digest( 'hex' );
  var hashRequest = req.headers[ 'x-jenkins-signature' ];

  return hashCalculated === hashRequest;
};

/**
 * Process issue hooks
 *
 * @param req
 */
Jenkins.prototype.processCommit = function ( req ) {
  var eventName = this.events.jenkins.commit.built;
  var availableStatus = [ 'pending', 'success', 'error', 'failure' ];

  if ( availableStatus.indexOf( req.body.status ) < 0 ) {
    console.log( '[-->] Invalid status on jenkins commit hook: ' + req.body.status );

    return false;
  }

  /** @see events documentation */
  var data = {
    commit : req.body.commit,
    status : req.body.status,
    job : req.body.job,
    buildUrl : req.body.buildUrl
  };

  this.eventEmitter.emit( eventName, data );
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
