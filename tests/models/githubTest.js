'use strict';

var Github = require( '../../models/github' );
var eventEmitter = require( '../../models/eventEmitter' );
var consoleLog;

exports.testModelGithub = {

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
    test.expect( 3 );

    var handleIssueCreate = Github.prototype.handleIssueCreate;
    var handleIssueUpdate = Github.prototype.handleIssueUpdate;
    var handleIssueCommentCreate = Github.prototype.handleIssueCommentCreate;

    Github.prototype.handleIssueCreate = function ( data ) {
      test.strictEqual( data.type, 'issue.create' );
    };
    Github.prototype.handleIssueUpdate = function ( data ) {
      test.strictEqual( data.type, 'issue.update' );
    };
    Github.prototype.handleIssueCommentCreate = function ( data ) {
      test.strictEqual( data.type, 'issueComment.create' );
    };

    var github = new Github( { } );

    github.eventEmitter.emit(
      github.events.github.issue.create,
      { type : 'issue.create' }
    );

    github.eventEmitter.emit(
      github.events.github.issue.update,
      { type : 'issue.update' }
    );

    github.eventEmitter.emit(
      github.events.github.issueComment.create,
      { type : 'issueComment.create' }
    );

    test.done();

    Github.prototype.handleIssueCreate = handleIssueCreate;
    Github.prototype.handleIssueUpdate = handleIssueUpdate;
    Github.prototype.handleIssueCommentCreate = handleIssueCommentCreate;
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

      var github = new Github( { } );

      github.request = function ( options, callback ) {
        callback(
          null,
          { statusCode : 200 },
          '{"success":true}'
        );
      };

      github.callApi(
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

        var github = new Github( { } );

        github.request = function ( options, callback ) {
          callback(
            true,
            { statusCode : 200 },
            '{"success":false}'
          );
        };

        github.callApi(
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

        var github = new Github( { } );

        github.request = function ( options, callback ) {
          callback(
            null,
            { statusCode : 500 },
            '{"success":false}'
          );
        };

        github.callApi(
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
      test.expect( 7 );

      var config = {
        oauthToken : 'oauthTokenTest',
        userAgent : 'userAgentTest'
      };

      var github = new Github( config );

      github.request = function ( options ) {
        test.strictEqual( options.url, github.apiUrl + 'test' );
        test.strictEqual( options.method, 'post' );
        test.strictEqual( options.headers.Authorization, 'token ' + config.oauthToken );
        test.strictEqual( options.headers.Accept, 'application/vnd.github.v3+json' );
        test.strictEqual( options.headers['Content-Type'], 'application/json' );
        test.strictEqual( options.headers['User-Agent'], github.userAgent );
        test.strictEqual( options.body, '{"test":true}' );
      };

      github.callApi(
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
     * process issue
     *
     * @param test
     */
    issue : function ( test ) {
      test.expect( 1 );

      var github = new Github( { } );
      var req = {
        'get' : function () {
          return 'issue';
        },
        test : true,
      };

      github.processIssue = function ( req ) {
        test.strictEqual( req.test, true );
      };

      github.process( req );

      test.done();
    },

    /**
     * process issue_comment
     *
     * @param test
     */
    issueComment : function ( test ) {
      test.expect( 1 );

      var github = new Github( { } );
      var req = {
        'get' : function () {
          return 'issue_comment';
        },
        test : true,
      };

      github.processIssueComment = function ( req ) {
        test.strictEqual( req.test, true );
      };

      github.process( req );

      test.done();
    },

    /**
     * process push
     *
     * @param test
     */
    push : function ( test ) {
      test.expect( 1 );

      var github = new Github( { } );
      var req = {
        'get' : function () {
          return 'push';
        },
        test : true,
      };

      github.processPush = function ( req ) {
        test.strictEqual( req.test, true );
      };

      github.process( req );

      test.done();
    },

    /**
     * process release
     *
     * @param test
     */
    release : function ( test ) {
      test.expect( 1 );

      var github = new Github( { } );
      var req = {
        'get' : function () {
          return 'release';
        },
        test : true,
      };

      github.processRelease = function ( req ) {
        test.strictEqual( req.test, true );
      };

      github.process( req );

      test.done();
    },
  },

  /**
   * processIssue method
   *
   * @param test
   */
  processIssue : function ( test ) {
    test.expect( 7 );

    var req = {
      body : {
        action : 'opened',
        issue : {
          number : 123,
          title : 'Test title',
          body : 'Test body',
          user : { login : 'Test login' },
        },
        repository : {
          name : 'Test name',
          owner : { login : 'Test login' },
        },
      },
    };

    var github = new Github( { } );

    github.eventEmitter = {
      emit : function ( eventName, data ) {
        test.strictEqual( eventName, github.events.github.issue.created );
        test.strictEqual( data.id, req.body.issue.number );
        test.strictEqual( data.title, req.body.issue.title );
        test.strictEqual( data.body, req.body.issue.body );
        test.strictEqual( data.user, req.body.issue.user.login );
        test.strictEqual( data.repository.name, req.body.repository.name );
        test.strictEqual( data.repository.owner, req.body.repository.owner.login );
      }
    };

    github.processIssue( req );

    test.done();
  },

  /**
   * processIssueComment method
   *
   * @param test
   */
  processIssueComment : function ( test ) {
    test.expect( 9 );

    var req = {
      body : {
        action : 'created',
        comment : {
          id : 123,
          body : 'Test body',
          user : { login : 'Test login' },
        },
        issue : {
          number : 123,
          title : 'Test title',
          user : { login : 'Test login' },
        },
        repository : {
          name : 'Test name',
          owner : { login : 'Test login' },
        },
      },
    };

    var github = new Github( { } );

    github.eventEmitter = {
      emit : function ( eventName, data ) {
        test.strictEqual( eventName, github.events.github.issueComment.created );
        test.strictEqual( data.id, req.body.comment.id );
        test.strictEqual( data.body, req.body.comment.body );
        test.strictEqual( data.user, req.body.comment.user.login );
        test.strictEqual( data.issue.id, req.body.issue.number );
        test.strictEqual( data.issue.title, req.body.issue.title );
        test.strictEqual( data.issue.user, req.body.issue.user.login );
        test.strictEqual( data.repository.name, req.body.repository.name );
        test.strictEqual( data.repository.owner, req.body.repository.owner.login );
      }
    };

    github.processIssueComment( req );

    test.done();
  },

  /**
   * processPush method
   *
   * @param test
   */
  processPush : function ( test ) {
    test.expect( 7 );

    var req = {
      body : {
        ref : 'test_ref',
        head_commit : {
          id : 123,
          message : 'Test message',
          author : { username : 'Test user' },
        },
        repository : {
          name : 'Test name',
          owner : { name : 'Test login' },
        },
      },
    };

    var github = new Github( { } );

    github.eventEmitter = {
      emit : function ( eventName, data ) {
        test.strictEqual( eventName, github.events.github.push.created );
        test.strictEqual( data.ref, req.body.ref );
        test.strictEqual( data.id, req.body.head_commit.id );
        test.strictEqual( data.message, req.body.head_commit.message );
        test.strictEqual( data.user, req.body.head_commit.author.username );
        test.strictEqual( data.repository.name, req.body.repository.name );
        test.strictEqual( data.repository.owner, req.body.repository.owner.name );
      }
    };

    github.processPush( req );

    test.done();
  },

  /**
   * processRelease method
   *
   * @param test
   */
  processRelease : function ( test ) {
    test.expect( 8 );

    var req = {
      body : {
        action : 'published',
        release : {
          tag_name : 'Test tag',
          prerelease : 'Test prerelease',
          name : 'Test name',
          body : 'Test body',
          author : { login : 'Test user' },
        },
        repository : {
          name : 'Test name',
          owner : { login : 'Test login' },
        },
      },
    };

    var github = new Github( { } );

    github.eventEmitter = {
      emit : function ( eventName, data ) {
        test.strictEqual( eventName, github.events.github.release.created );
        test.strictEqual( data.tag, req.body.release.tag_name );
        test.strictEqual( data.prerelease, req.body.release.prerelease );
        test.strictEqual( data.name, req.body.release.name );
        test.strictEqual( data.body, req.body.release.body );
        test.strictEqual( data.user, req.body.release.author.login );
        test.strictEqual( data.repository.name, req.body.repository.name );
        test.strictEqual( data.repository.owner, req.body.repository.owner.login );
      }
    };

    github.processRelease( req );

    test.done();
  },

  /**
   * handleIssueCreate method
   */
  handleIssueCreate : {

    /**
     * handleIssueCreate callApi
     *
     * @param test
     */
    callApi : function ( test ) {
      test.expect( 4 );

      var github = new Github( { } );
      var dataTest = {
        owner : 'test_owner',
        repo : 'test_repo',
        title : 'test_title',
        body : 'test_body',
      };

      github.callApi = function ( apiPath, method, data ) {
        test.strictEqual( apiPath, '/repos/' + dataTest.owner + '/' + dataTest.repo + '/issues' );
        test.strictEqual( method, 'POST' );
        test.strictEqual( data.title, dataTest.title );
        test.strictEqual( data.body, dataTest.body );
      };

      github.handleIssueCreate( dataTest, function () {
      } );

      test.done();
    },

    /**
     * handleIssueCreate callbackSuccess
     *
     * @param test
     */
    callbackSuccess : function ( test ) {
      test.expect( 6 );

      var github = new Github( { } );
      var responseData = {
        number : 'test_number',
        title : 'test_title',
        body : 'test_body',
        html_url : 'test_html_url',
        user : {
          login : 'test_login'
        }
      };

      github.callApi = function ( apiPath, method, data, callback ) {
        callback( false, responseData );
      };

      github.handleIssueCreate(
        { },
        function ( error, response ) {
          test.strictEqual( error, false );
          test.strictEqual( response.id, responseData.number );
          test.strictEqual( response.title, responseData.title );
          test.strictEqual( response.body, responseData.body );
          test.strictEqual( response.url, responseData.html_url );
          test.strictEqual( response.user, responseData.user.login );
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

      var github = new Github( { } );

      github.callApi = function ( apiPath, method, data, callback ) {
        callback( true, { test : true } );
      };

      github.handleIssueCreate(
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
   * handleIssueUpdate method
   */
  handleIssueUpdate : {

    /**
     * handleIssueCreate callApi
     *
     * @param test
     */
    callApi : function ( test ) {
      test.expect( 5 );

      var github = new Github( { } );
      var dataTest = {
        owner : 'test_owner',
        repo : 'test_repo',
        id : 'test_id',
        title : 'test_title',
        body : 'test_body',
        state : 'test_state',
      };

      github.callApi = function ( apiPath, method, data ) {
        test.strictEqual( apiPath, '/repos/' + dataTest.owner + '/' + dataTest.repo + '/issues/' + dataTest.id );
        test.strictEqual( method, 'PATCH' );
        test.strictEqual( data.title, dataTest.title );
        test.strictEqual( data.body, dataTest.body );
        test.strictEqual( data.state, dataTest.state );
      };

      github.handleIssueUpdate( dataTest, function () {
      } );

      test.done();
    },

    /**
     * handleIssueUpdate callbackSuccess
     *
     * @param test
     */
    callbackSuccess : function ( test ) {
      test.expect( 6 );

      var github = new Github( { } );
      var responseData = {
        number : 'test_number',
        title : 'test_title',
        body : 'test_body',
        html_url : 'test_html_url',
        user : {
          login : 'test_login'
        }
      };

      github.callApi = function ( apiPath, method, data, callback ) {
        callback( false, responseData );
      };

      github.handleIssueUpdate(
        { },
        function ( error, response ) {
          test.strictEqual( error, false );
          test.strictEqual( response.id, responseData.number );
          test.strictEqual( response.title, responseData.title );
          test.strictEqual( response.body, responseData.body );
          test.strictEqual( response.url, responseData.html_url );
          test.strictEqual( response.user, responseData.user.login );
        }
      );

      test.done();
    },

    /**
     * handleIssueUpdate callbackError
     *
     * @param test
     */
    callbackError : function ( test ) {
      test.expect( 2 );

      var github = new Github( { } );

      github.callApi = function ( apiPath, method, data, callback ) {
        callback( true, { test : true } );
      };

      github.handleIssueUpdate(
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
   * handleIssueCommentCreate method
   */
  handleIssueCommentCreate : {

    /**
     * handleIssueCommentCreate callApi
     *
     * @param test
     */
    callApi : function ( test ) {
      test.expect( 3 );

      var github = new Github( { } );
      var dataTest = {
        owner : 'test_owner',
        repo : 'test_repo',
        body : 'test_body',
        card : {
          id : 'test_id'
        }
      };

      github.callApi = function ( apiPath, method, data ) {
        test.strictEqual( apiPath, '/repos/' + dataTest.owner + '/' + dataTest.repo + '/issues/' + dataTest.card.id + '/comments' );
        test.strictEqual( method, 'POST' );
        test.strictEqual( data.body, dataTest.body );
      };

      github.handleIssueCommentCreate( dataTest, function () {
      } );

      test.done();
    },

    /**
     * handleIssueCommentCreate callbackSuccess
     *
     * @param test
     */
    callbackSuccess : function ( test ) {
      test.expect( 4 );

      var github = new Github( { } );
      var responseData = {
        id : 'test_id',
        body : 'test_body',
        user : {
          login : 'test_login'
        }
      };

      github.callApi = function ( apiPath, method, data, callback ) {
        callback( false, responseData );
      };

      github.handleIssueCommentCreate(
        { card : { } },
        function ( error, response ) {
          test.strictEqual( error, false );
          test.strictEqual( response.id, responseData.id );
          test.strictEqual( response.body, responseData.body );
          test.strictEqual( response.user, responseData.user.login );
        }
      );

      test.done();
    },

    /**s
     * handleIssueCommentCreate callbackError
     *
     * @param test
     */
    callbackError : function ( test ) {
      test.expect( 2 );

      var github = new Github( { } );

      github.callApi = function ( apiPath, method, data, callback ) {
        callback( true, { test : true } );
      };

      github.handleIssueCommentCreate(
        { card : { } },
        function ( error, response ) {
          test.strictEqual( error, true );
          test.strictEqual( response.test, true );
        }
      );

      test.done();
    },
  },
};