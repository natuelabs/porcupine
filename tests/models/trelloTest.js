'use strict';

var Trello = require( '../../models/trello' );
var eventEmitter = require( '../../models/eventEmitter' );
var consoleLog;

exports.testModelTrello = {

  /**
   * Set up the test
   *
   * @param done
   */
  setUp : function ( done ) {
    consoleLog = console.log;
    console.log = function () {
    };

    done();
  },

  /**
   * Tear down the test
   *
   * @param callback
   */
  tearDown : function ( callback ) {
    console.log = consoleLog;
    eventEmitter.removeAllListeners();

    callback();
  },

  /**
   * Events listeners
   *
   * @param test
   */
  events : function ( test ) {
    test.expect( 2 );

    var handleCardUpdate = Trello.prototype.handleCardUpdate;
    var handleCardCommentCreate = Trello.prototype.handleCardCommentCreate;

    Trello.prototype.handleCardUpdate = function ( data ) {
      test.strictEqual( data.type, 'card.create' );
    };
    Trello.prototype.handleCardCommentCreate = function ( data ) {
      test.strictEqual( data.type, 'cardComment.create' );
    };

    var trello = new Trello( { } );

    trello.eventEmitter.emit(
      trello.events.trello.card.update,
      { type : 'card.create' }
    );

    trello.eventEmitter.emit(
      trello.events.trello.cardComment.create,
      { type : 'cardComment.create' }
    );

    test.done();

    Trello.prototype.handleCardUpdate = handleCardUpdate;
    Trello.prototype.handleCardCommentCreate = handleCardCommentCreate;
  },

  /**
   * callApi method
   */
  callApi : {

    /**
     * callApi success
     *
     * @param test
     */
    success : function ( test ) {
      test.expect( 2 );

      var trello = new Trello( { } );

      trello.request = function ( options, callback ) {
        callback(
          null,
          { statusCode : 200 },
          '{"success":true}'
        );
      };

      trello.callApi(
        'test',
        'post',
        { },
        function ( error, response ) {
          test.strictEqual( error, null );
          test.strictEqual( response.success, true );
        }
      );

      test.done();
    },

    /**
     * callApi failure
     */
    failure : {

      /**
       * callApi failure error
       *
       * @param test
       */
      error : function ( test ) {
        test.expect( 2 );

        var trello = new Trello( { } );

        trello.request = function ( options, callback ) {
          callback(
            true,
            { statusCode : 200 },
            '{"success":false}'
          );
        };

        trello.callApi(
          'test',
          'post',
          { },
          function ( error, response ) {
            test.strictEqual( error, true );
            test.strictEqual( response, '{"success":false}' );
          }
        );

        test.done();
      },

      /**
       * callApi failure statusCode
       *
       * @param test
       */
      statusCode : function ( test ) {
        test.expect( 2 );

        var trello = new Trello( { } );

        trello.request = function ( options, callback ) {
          callback(
            null,
            { statusCode : 500 },
            '{"success":false}'
          );
        };

        trello.callApi(
          'test',
          'post',
          { },
          function ( error, response ) {
            test.strictEqual( error, true );
            test.strictEqual( response, '{"success":false}' );
          }
        );

        test.done();
      },
    },

    /**
     * callApi options
     *
     * @param test
     */
    options : function ( test ) {
      test.expect( 5 );

      var config = {
        token : 'tokenTest',
        key : 'keyTest'
      };

      var trello = new Trello( config );

      trello.request = function ( options ) {
        test.strictEqual( options.url, trello.apiUrl + 'test?key=' + config.key );
        test.strictEqual( options.method, 'post' );
        test.strictEqual( options.headers['Content-Type'], 'application/json' );
        test.strictEqual( options.headers['User-Agent'], trello.userAgent );
        test.strictEqual( options.body, '{"test":true,"token":"tokenTest","key":"keyTest"}' );
      };

      trello.callApi(
        'test',
        'post',
        { test : true },
        function () {
        }
      );

      test.done();
    },
  },

  /**
   * process method
   */
  process : {

    /**
     * process createCard
     *
     * @param test
     */
    createCard : function ( test ) {
      test.expect( 1 );

      var trello = new Trello( { } );
      var req = {
        body : {
          action : {
            type : 'createCard'
          }
        },
        test : true
      };

      trello.processCreatedCard = function ( req ) {
        test.strictEqual( req.test, true );
      };

      trello.process( req );

      test.done();
    },

    /**
     * process updateCard
     *
     * @param test
     */
    updateCard : function ( test ) {
      test.expect( 1 );

      var trello = new Trello( { } );
      var req = {
        body : {
          action : {
            type : 'updateCard'
          }
        },
        test : true
      };

      trello.processUpdatedCard = function ( req ) {
        test.strictEqual( req.test, true );
      };

      trello.process( req );

      test.done();
    },

    /**
     * process commentCard
     *
     * @param test
     */
    commentCard : function ( test ) {
      test.expect( 1 );

      var trello = new Trello( { } );
      var req = {
        body : {
          action : {
            type : 'commentCard'
          }
        },
        test : true
      };

      trello.processCommentCard = function ( req ) {
        test.strictEqual( req.test, true );
      };

      trello.process( req );

      test.done();
    },

    /**
     * process addAttachmentToCard
     *
     * @param test
     */
    addAttachmentToCard : function ( test ) {
      test.expect( 1 );

      var trello = new Trello( { } );
      var req = {
        body : {
          action : {
            type : 'addAttachmentToCard'
          }
        },
        test : true
      };

      trello.processAttachmentCard = function ( req ) {
        test.strictEqual( req.test, true );
      };

      trello.process( req );

      test.done();
    },
  },

  /**
   * processCreatedCard method
   *
   * @param test
   */
  processCreatedCard : function ( test ) {
    test.expect( 10 );

    var req = {
      body : {
        action : {
          data : {
            card : {
              id : 'cardIdTest',
              name : 'cardNameTest'
            },
            board : {
              id : 'boardIdTest',
              name : 'boardNameTest'
            },
            list : {
              id : 'listIdTest',
              name : 'listNameTest'
            }
          },
          memberCreator : {
            fullName : 'fullNameTest',
            username : 'usernameTest',
            avatarHash : 'avatarHashTest'
          }
        }
      }
    };

    var trello = new Trello( { } );

    trello.eventEmitter = {
      emit : function ( eventName, data ) {
        test.strictEqual( eventName, trello.events.trello.card.created );
        test.strictEqual( data.id, req.body.action.data.card.id );
        test.strictEqual( data.title, req.body.action.data.card.name );
        test.strictEqual( data.user.name, req.body.action.memberCreator.fullName );
        test.strictEqual( data.user.username, req.body.action.memberCreator.username );
        test.strictEqual( data.user.avatarHash, req.body.action.memberCreator.avatarHash );
        test.strictEqual( data.board.id, req.body.action.data.board.id );
        test.strictEqual( data.board.name, req.body.action.data.board.name );
        test.strictEqual( data.list.id, req.body.action.data.list.id );
        test.strictEqual( data.list.name, req.body.action.data.list.name );
      }
    };

    trello.processCreatedCard( req );

    test.done();
  },

  /**
   * processUpdatedCard method
   *
   * @param test
   */
  processUpdatedCard : function ( test ) {
    test.expect( 10 );

    var req = {
      body : {
        action : {
          data : {
            card : {
              id : 'cardIdTest',
              name : 'cardNameTest',
              desc : 'cardDescTest',
              closed : false
            },
            board : {
              id : 'boardIdTest',
              name : 'boardNameTest'
            }
          },
          memberCreator : {
            fullName : 'fullNameTest',
            username : 'usernameTest',
            avatarHash : 'avatarHashTest'
          }
        }
      }
    };

    var trello = new Trello( { } );

    trello.eventEmitter = {
      emit : function ( eventName, data ) {
        test.strictEqual( eventName, trello.events.trello.card.updated );
        test.strictEqual( data.id, req.body.action.data.card.id );
        test.strictEqual( data.title, req.body.action.data.card.name );
        test.strictEqual( data.body, req.body.action.data.card.desc );
        test.strictEqual( data.closed, req.body.action.data.card.closed );
        test.strictEqual( data.user.name, req.body.action.memberCreator.fullName );
        test.strictEqual( data.user.username, req.body.action.memberCreator.username );
        test.strictEqual( data.user.avatarHash, req.body.action.memberCreator.avatarHash );
        test.strictEqual( data.board.id, req.body.action.data.board.id );
        test.strictEqual( data.board.name, req.body.action.data.board.name );
      }
    };

    trello.processUpdatedCard( req );

    test.done();
  },

  /**
   * processCommentCard method
   *
   * @param test
   */
  processCommentCard : function ( test ) {
    test.expect( 9 );

    var req = {
      body : {
        action : {
          data : {
            text : 'textTest',
            card : {
              id : 'cardIdTest',
              name : 'cardNameTest'
            },
            board : {
              id : 'boardIdTest',
              name : 'boardNameTest'
            }
          },
          memberCreator : {
            fullName : 'fullNameTest',
            username : 'usernameTest',
            avatarHash : 'avatarHashTest'
          }
        }
      }
    };

    var trello = new Trello( { } );

    trello.eventEmitter = {
      emit : function ( eventName, data ) {
        test.strictEqual( eventName, trello.events.trello.cardComment.created );
        test.strictEqual( data.text, req.body.action.data.text );
        test.strictEqual( data.card.id, req.body.action.data.card.id );
        test.strictEqual( data.card.title, req.body.action.data.card.name );
        test.strictEqual( data.user.name, req.body.action.memberCreator.fullName );
        test.strictEqual( data.user.username, req.body.action.memberCreator.username );
        test.strictEqual( data.user.avatarHash, req.body.action.memberCreator.avatarHash );
        test.strictEqual( data.board.id, req.body.action.data.board.id );
        test.strictEqual( data.board.name, req.body.action.data.board.name );
      }
    };

    trello.processCommentCard( req );

    test.done();
  },

  /**
   * processAttachmentCard method
   *
   * @param test
   */
  processAttachmentCard : function ( test ) {
    test.expect( 10 );

    var req = {
      body : {
        action : {
          data : {
            attachment : {
              url : 'urlTest',
              name : 'nameTest'
            },
            card : {
              id : 'cardIdTest',
              name : 'cardNameTest'
            },
            board : {
              id : 'boardIdTest',
              name : 'boardNameTest'
            }
          },
          memberCreator : {
            fullName : 'fullNameTest',
            username : 'usernameTest',
            avatarHash : 'avatarHashTest'
          }
        }
      }
    };

    var trello = new Trello( { } );

    trello.eventEmitter = {
      emit : function ( eventName, data ) {
        test.strictEqual( eventName, trello.events.trello.cardAttachment.created );
        test.strictEqual( data.url, req.body.action.data.attachment.url );
        test.strictEqual( data.name, req.body.action.data.attachment.name );
        test.strictEqual( data.card.id, req.body.action.data.card.id );
        test.strictEqual( data.card.title, req.body.action.data.card.name );
        test.strictEqual( data.user.name, req.body.action.memberCreator.fullName );
        test.strictEqual( data.user.username, req.body.action.memberCreator.username );
        test.strictEqual( data.user.avatarHash, req.body.action.memberCreator.avatarHash );
        test.strictEqual( data.board.id, req.body.action.data.board.id );
        test.strictEqual( data.board.name, req.body.action.data.board.name );
      }
    };

    trello.processAttachmentCard( req );

    test.done();
  },

  /**
   * handleCardUpdate method
   */
  handleCardUpdate : {

    /**
     * handleCardUpdate callApi
     *
     * @param test
     */
    callApi : function ( test ) {
      test.expect( 6 );

      var trello = new Trello( { } );
      var dataTest = {
        id : 'idTest',
        title : 'titleTest',
        desc : 'descTitle',
        closed : 'closedTest',
        board : { id : 'boardIdTest' },
        list : { id : 'listIdTest' }
      };

      trello.callApi = function ( apiPath, method, data ) {
        test.strictEqual( apiPath, '/cards/' + dataTest.id );
        test.strictEqual( method, 'PUT' );
        test.strictEqual( data.name, dataTest.title );
        test.strictEqual( data.body, dataTest.desc );
        test.strictEqual( data.idBoard, dataTest.board.id );
        test.strictEqual( data.idList, dataTest.list.id );
      };

      trello.handleCardUpdate( dataTest, function () {
      } );

      test.done();
    },

    /**
     * handleIssueCreate callbackSuccess
     *
     * @param test
     */
    callbackSuccess : function ( test ) {
      test.expect( 7 );

      var trello = new Trello( { } );
      var responseData = {
        id : 'idTest',
        name : 'nameTest',
        desc : 'descTest',
        closed : 'closedTest',
        idBoard : 'idBoardTest',
        idList : 'idListTest'
      };

      trello.callApi = function ( apiPath, method, data, callback ) {
        callback( false, responseData );
      };

      trello.handleCardUpdate(
        { },
        function ( error, response ) {
          test.strictEqual( error, false );
          test.strictEqual( response.id, responseData.id );
          test.strictEqual( response.title, responseData.name );
          test.strictEqual( response.body, responseData.desc );
          test.strictEqual( response.closed, responseData.closed );
          test.strictEqual( response.board.id, responseData.idBoard );
          test.strictEqual( response.list.id, responseData.idList );
        }
      );

      test.done();
    },

    /**
     * handleIssueCreate callbackError
     *
     * @param test
     */
    callbackError : function ( test ) {
      test.expect( 2 );

      var trello = new Trello( { } );

      trello.callApi = function ( apiPath, method, data, callback ) {
        callback( true, { test : true } );
      };

      trello.handleCardUpdate(
        { },
        function ( error, response ) {
          test.strictEqual( error, true );
          test.strictEqual( response.test, true );
        }
      );

      test.done();
    },
  },

  /**
   * handleCardCommentCreate method
   */
  handleCardCommentCreate : {

    /**
     * handleCardCommentCreate callApi
     *
     * @param test
     */
    callApi : function ( test ) {
      test.expect( 3 );

      var trello = new Trello( { } );
      var dataTest = {
        id : 'idTest',
        text : 'textTest'
      };

      trello.callApi = function ( apiPath, method, data ) {
        test.strictEqual( apiPath, '/cards/' + dataTest.id + '/actions/comments' );
        test.strictEqual( method, 'POST' );
        test.strictEqual( data.text, dataTest.text );
      };

      trello.handleCardCommentCreate( dataTest, function () {
      } );

      test.done();
    },

    /**
     * handleCardCommentCreate callbackSuccess
     *
     * @param test
     */
    callbackSuccess : function ( test ) {
      test.expect( 7 );

      var trello = new Trello( { } );
      var responseData = {
        data : {
          text : 'textTest',
          card : {
            id : 'cardIdTest',
            name : 'cardNameTest'
          }
        },
        memberCreator : {
          fullName : 'fullNameTest',
          username : 'usernameTest',
          avatarHash : 'avatarHashtest'
        }
      };

      trello.callApi = function ( apiPath, method, data, callback ) {
        callback( false, responseData );
      };

      trello.handleCardCommentCreate(
        { },
        function ( error, response ) {
          test.strictEqual( error, false );
          test.strictEqual( response.text, responseData.data.text );
          test.strictEqual( response.user.name, responseData.memberCreator.fullName );
          test.strictEqual( response.user.username, responseData.memberCreator.username );
          test.strictEqual( response.user.avatarHash, responseData.memberCreator.avatarHash );
          test.strictEqual( response.card.id, responseData.data.card.id );
          test.strictEqual( response.card.title, responseData.data.card.name );
        }
      );

      test.done();
    },

    /**
     * handleCardCommentCreate callbackError
     *
     * @param test
     */
    callbackError : function ( test ) {
      test.expect( 2 );

      var trello = new Trello( { } );

      trello.callApi = function ( apiPath, method, data, callback ) {
        callback( true, { test : true } );
      };

      trello.handleCardCommentCreate(
        { },
        function ( error, response ) {
          test.strictEqual( error, true );
          test.strictEqual( response.test, true );
        }
      );

      test.done();
    },
  },
};