/**
 * Github integration
 *
 * @constructor
 */
function Github ( config ) {
  'use strict';

  this.config = config;
  this.request = require( 'request' );
  this.events = require( './events' );
  this.eventEmitter = require( './eventEmitter' );
  this.apiUrl = 'https://api.github.com';
  this.userAgent = 'Porcupine';

  this.initEvents();
}

/**
 * Init events
 */
Github.prototype.initEvents = function () {
  this.eventEmitter.on(
    this.events.github.issue.create,
    this.handleIssueCreate.bind( this )
  );

  this.eventEmitter.on(
    this.events.github.issue.update,
    this.handleIssueUpdate.bind( this )
  );

  this.eventEmitter.on(
    this.events.github.issueComment.create,
      this.handleIssueCommentCreate.bind( this )
  );
};

/**
 * Call github API
 *
 * @param apiPath
 * @param method
 * @param data
 * @param callback
 */
Github.prototype.callApi = function ( apiPath, method, data, callback ) {
  console.log( '[-->] GitHub API ' + apiPath );

  var options = {
    url : this.apiUrl + apiPath,
    method : method,
    headers : {
      Authorization : 'token ' + this.config.oauthToken,
      Accept : 'application/vnd.github.v3+json',
      'Content-Type' : 'application/json',
      'User-Agent' : this.userAgent
    },
    body : JSON.stringify( data )
  };

  this.request( options, function ( error, response, body ) {
    var parsedResponse;

    if ( ! error && response.statusCode >= 200 && response.statusCode < 300 ) {
      try {
        parsedResponse = JSON.parse( body );
      } catch ( e ) {
        callback( e );

        return;
      }
      callback( null, parsedResponse );
    } else {
      callback( true, body );
    }
  } );
};

/**
 * Process github hooks
 *
 * http://developer.github.com/v3/repos/hooks/
 *
 * @param req
 */
Github.prototype.process = function ( req ) {
  var type = req.get( 'X-Github-Event' );

  switch ( type ) {
    case 'issue':
      this.processIssue( req );
      break;
    case 'issue_comment':
      this.processIssueComment( req );
      break;
    case 'push':
      this.processPush( req );
      break;
    case 'release':
      this.processRelease( req );
      break;
  }
};

/**
 * Process issue hooks
 *
 * @param req
 */
Github.prototype.processIssue = function ( req ) {
  var eventName = null;
  var data = {};

  switch ( req.body.action ) {
    case 'opened':
      eventName = this.events.github.issue.created;

      /** @see events documentation */
      data = {
        id : req.body.issue.number,
        title : req.body.issue.title,
        body : req.body.issue.body,
        user : req.body.issue.user.login,
        repository : {
          name : req.body.repository.name,
          owner : req.body.repository.owner.login
        }
      };
      break;
  }

  if ( ! eventName ) {
    return;
  }

  this.eventEmitter.emit( eventName, data );
};

/**
 * Process issue hooks
 *
 * @param req
 */
Github.prototype.processIssueComment = function ( req ) {
  var eventName = null;
  var data = {};

  switch ( req.body.action ) {
    case 'created':
      eventName = this.events.github.issueComment.created;

      /** @see events documentation */
      data = {
        id : req.body.comment.id,
        body : req.body.comment.body,
        user : req.body.comment.user.login,
        issue : {
          id : req.body.issue.number,
          title : req.body.issue.title,
          user : req.body.issue.user.login
        },
        repository : {
          name : req.body.repository.name,
          owner : req.body.repository.owner.login
        }
      };
      break;
  }

  if ( ! eventName ) {
    return;
  }

  this.eventEmitter.emit( eventName, data );
};

/**
 * Process push hooks
 *
 * @param req
 */
Github.prototype.processPush = function ( req ) {
  var eventName = null;
  var data = {};

  eventName = this.events.github.push.created;

  /** @see events documentation */
  data = {
    ref : req.body.ref,
    id : (req.body.head_commit ? req.body.head_commit.id : null),
    message : (req.body.head_commit ? req.body.head_commit.message : null),
    user : (req.body.head_commit ? req.body.head_commit.author.username : null),
    repository : {
      name : req.body.repository.name,
      owner : req.body.repository.owner.name
    }
  };

  if ( ! eventName ) {
    return;
  }

  this.eventEmitter.emit( eventName, data );
};

/**
 * Process release hooks
 *
 * @param req
 */
Github.prototype.processRelease = function ( req ) {
  var eventName = null;
  var data = {};

  switch ( req.body.action ) {
    case 'published':
      eventName = this.events.github.release.created;

      /** @see events documentation */
      data = {
        tag : req.body.release.tag_name,
        prerelease : req.body.release.prerelease,
        name : req.body.release.name,
        body : req.body.release.body,
        user : req.body.release.author.login,
        repository : {
          name : req.body.repository.name,
          owner : req.body.repository.owner.login
        }
      };
      break;
  }

  if ( ! eventName ) {
    return;
  }

  this.eventEmitter.emit( eventName, data );
};

/**
 * @see events documentation
 *
 * @param data
 * @param callback
 */
Github.prototype.handleIssueCreate = function ( data, callback ) {
  var processData = function ( error, response ) {
    if ( error ) {
      callback( error, response );

      return;
    }
    /** @see events documentation */
    var responseData = {
      id : response.number,
      title : response.title,
      body : response.body,
      user : response.user.login,
      url : response.html_url
    };

    callback( error, responseData );
  };

  this.callApi(
    '/repos/' + data.owner + '/' + data.repo + '/issues',
    'POST',
    {
      title : data.title,
      body : data.body
    },
    processData
  );
};

/**
 * @see events documentation
 *
 * @param data
 * @param callback
 */
Github.prototype.handleIssueUpdate = function ( data, callback ) {
  var processData = function ( error, response ) {
    if ( error ) {
      callback( error, response );

      return;
    }
    /** @see events documentation */
    var responseData = {
      id : response.number,
      title : response.title,
      body : response.body,
      user : response.user.login,
      url : response.html_url
    };

    callback( error, responseData );
  };

  this.callApi(
    '/repos/' + data.owner + '/' + data.repo + '/issues/' + data.id,
    'PATCH',
    {
      title : data.title,
      body : data.body,
      state : data.state
    },
    processData
  );
};

/**
 * @see events documentation
 *
 * @param data
 * @param callback
 */
Github.prototype.handleIssueCommentCreate = function ( data, callback ) {
  var processData = function ( error, response ) {
    if ( error ) {
      callback( error, response );

      return;
    }

    /** @see events documentation */
    var responseData = {
      id : response.id,
      body : response.body,
      user : response.user.login
    };

    callback( error, responseData );
  };

  this.callApi(
    '/repos/' + data.owner + '/' + data.repo + '/issues/' + data.card.id + '/comments',
    'POST',
    {
      body : data.body
    },
    processData
  );
};

module.exports = Github;