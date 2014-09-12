/**
 * Trello integration
 *
 * @constructor
 */
function Trello ( config ) {
  'use strict';

  this.config = config;
  this.request = require( 'request' );
  this.events = require( './events' );
  this.eventEmitter = require( './eventEmitter' );
  this.apiUrl = 'https://api.trello.com/1';
  this.userAgent = 'Porcupine';

  this.initEvents();
}

/**
 * Init events
 */
Trello.prototype.initEvents = function () {
  this.eventEmitter.on(
    this.events.trello.card.update,
    this.handleCardUpdate.bind( this )
  );

  this.eventEmitter.on(
    this.events.trello.cardComment.create,
    this.handleCardCommentCreate.bind( this )
  );
};

/**
 * Call trello API
 *
 * @param apiPath
 * @param method
 * @param data
 * @param callback
 */
Trello.prototype.callApi = function ( apiPath, method, data, callback ) {
  console.log( '[-->] Trello API ' + apiPath );

  data.token = this.config.token;
  data.key = this.config.key;

  var options = {
    url : this.apiUrl + apiPath + '?key=' + this.config.key,
    method : method,
    headers : {
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
 * Process trello hooks
 *
 * https://trello.com/docs/gettingstarted/webhooks.html
 *
 * @param req
 */
Trello.prototype.process = function ( req ) {
  var type;

  if ( req.body ) {
    type = req.body.action.type;
  }

  switch ( type ) {
    case 'createCard':
      this.processCreatedCard( req );
      break;
    case 'updateCard':
      this.processUpdatedCard( req );
      break;
    case 'commentCard':
      this.processCommentCard( req );
      break;
    case 'addAttachmentToCard':
      this.processAttachmentCard( req );
      break;
  }
};

/**
 * Process create card hook
 *
 * @param req
 */
Trello.prototype.processCreatedCard = function ( req ) {
  var eventName = this.events.trello.card.created;

  /** @see this.events documentation */
  var data = {
    id : req.body.action.data.card.id,
    title : req.body.action.data.card.name,
    user : {
      name : req.body.action.memberCreator.fullName,
      username : req.body.action.memberCreator.username,
      avatarHash : req.body.action.memberCreator.avatarHash
    },
    board : {
      id : req.body.action.data.board.id,
      name : req.body.action.data.board.name
    },
    list : {
      id : req.body.action.data.list.id,
      name : req.body.action.data.list.name
    }
  };

  this.eventEmitter.emit( eventName, data );
};

/**
 * Process update card hook
 *
 * @param  {Object} req
 */
Trello.prototype.processUpdatedCard = function ( req ) {
  var eventName = this.events.trello.card.updated;

  /** @see events documentation */
  var data = {
    id : req.body.action.data.card.id,
    title : req.body.action.data.card.name,
    body : req.body.action.data.card.desc,
    closed : req.body.action.data.card.closed,
    user : {
      name : req.body.action.memberCreator.fullName,
      username : req.body.action.memberCreator.username,
      avatarHash : req.body.action.memberCreator.avatarHash
    },
    board : {
      id : req.body.action.data.board.id,
      name : req.body.action.data.board.name
    }
  };

  this.eventEmitter.emit( eventName, data );
};

/**
 * Process comment card hook
 *
 * @param  {Object} req
 */
Trello.prototype.processCommentCard = function ( req ) {
  var eventName = this.events.trello.cardComment.created;

  /** @see events documentation */
  var data = {
    text : req.body.action.data.text,
    user : {
      name : req.body.action.memberCreator.fullName,
      username : req.body.action.memberCreator.username,
      avatarHash : req.body.action.memberCreator.avatarHash
    },
    card : {
      id : req.body.action.data.card.id,
      title : req.body.action.data.card.name
    },
    board : {
      id : req.body.action.data.board.id,
      name : req.body.action.data.board.name
    }
  };

  this.eventEmitter.emit( eventName, data );
};

/**
 * Process atachment card hook
 *
 * @param  {Object} req
 */
Trello.prototype.processAttachmentCard = function ( req ) {
  var eventName = this.events.trello.cardAttachment.created;

  /** @see events documentation */
  var data = {
    url : req.body.action.data.attachment.url,
    name : req.body.action.data.attachment.name,
    user : {
      name : req.body.action.memberCreator.fullName,
      username : req.body.action.memberCreator.username,
      avatarHash : req.body.action.memberCreator.avatarHash
    },
    card : {
      id : req.body.action.data.card.id,
      title : req.body.action.data.card.name
    },
    board : {
      id : req.body.action.data.board.id,
      name : req.body.action.data.board.name
    }
  };

  this.eventEmitter.emit( eventName, data );
};

/**
 * @see events documentation
 *
 * @param data
 * @param callback
 */
Trello.prototype.handleCardUpdate = function ( data, callback ) {
  var processData = function ( error, response ) {
    if ( error ) {
      callback( error, response );

      return;
    }

    /** @see events documentation */
    var responseData = {
      id : response.id,
      title : response.name,
      body : response.desc,
      closed : response.closed,
      board : {
        id : response.idBoard
      },
      list : {
        id : response.idList
      }
    };

    callback( error, responseData );
  };

  if ( data.board === undefined ) {
    data.board = {};
  }

  if ( data.list === undefined ) {
    data.list = {};
  }

  this.callApi(
    '/cards/' + data.id,
    'PUT',
    {
      name : data.title || undefined,
      body : data.desc || undefined,
      closed : data.closed || undefined,
      idBoard : data.board.id || undefined,
      idList : data.list.id || undefined
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
Trello.prototype.handleCardCommentCreate = function ( data, callback ) {
  var processData = function ( error, response ) {
    if ( error ) {
      callback( error, response );

      return;
    }

    /** @see events documentation */
    var responseData = {
      text : response.data.text,
      user : {
        name : response.memberCreator.fullName,
        username : response.memberCreator.username,
        avatarHash : response.memberCreator.avatarHash
      },
      card : {
        id : response.data.card.id,
        title : response.data.card.name
      }
    };

    callback( error, responseData );
  };

  this.callApi(
    '/cards/' + data.id + '/actions/comments',
    'POST',
    {
      text : data.text || undefined
    },
    processData
  );
};

module.exports = Trello;