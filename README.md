# Porcupine

[![Build Status](https://travis-ci.org/natuelabs/porcupine.svg?branch=master)](https://travis-ci.org/natuelabs/porcupine) [![bnpm version](http://img.shields.io/npm/v/porcupine.svg?style=flat)](https://www.npmjs.org/package/porcupine) [![npm downloads](http://img.shields.io/npm/dm/porcupine.svg?style=flat)](https://www.npmjs.org/package/porcupine) [![Dependency Status](http://img.shields.io/gemnasium/natuelabs/porcupine.svg?style=flat)](https://gemnasium.com/natuelabs/porcupine) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)


> A NodeJS package to integrate development tools.

# Getting Started

Porcupine will help you to integrate development tools using NodeJS in an easy and fast way. Porcupine is currently supporting:

## Github

- Hooks
    - Issue created
    - Issue comment created
    - Repository push
    - Release published
- Calls
    - Create issue
    - Update issue
    - Create issue comment
    - Assign issue user
    - Set commit status

## Trello

- Hooks
    - Card created
    - Card updated
    - Card comment created
    - Card attachment created
    - Card user assigned
- Calls
    - Update card
    - Attach URL to card

## Jenkins

- Hooks
    - Commit built
- Calls
    - Build job

## Slack

- Hooks
    - Command called
- Calls
    - Send message

# How to use it

The interaction with Porcupine will happen all via events, both to receive hooks or to make calls. All events with params and returns are listed on [models/events.js](https://github.com/natuelabs/porcupine/blob/master/models/events.js).

To use it, just require Porcupine, init the configs, port to run and play with the events:

```js
var porcupine = require( 'porcupine' );
var eventEmitter = porcupine.getEventEmitter();
var events = porcupine.getEvents();

var config = {
  github : {
    oauthToken : 'your-token',
    secret : 'your-secret'
  },
  trello : {
    key : 'your-key',
    token : 'your-token',
    secret : 'your-secret',
    callBackUrl : 'https://your-porcupine-url/trello'
  }
};

// By default Porcupine will run over the port 3000
porcupine.init( config, 3000 );

function handleTrelloCardCreated ( data ) {
  // Create issue on GitHub
  eventEmitter.emit(
    events.github.issue.create,
    {
      owner : 'your_repo_owner',
      repo : 'your_repo_name',
      title : data.title
    },
    function ( err, response ) {
      if ( err ) {
        console.log( response );
      }
    }
  );
}

// Card created on Trello
eventEmitter.on(
  events.trello.card.created,
  handleTrelloCardCreated
);
```

# Config

To use Porcupine the first action is to send the config object and optionally the port to run (if not sent, Porcupine will listen to the port 3000):

```js
porcupine.init( config, 3000 );
```

The configs will also enable each one of the integrations so, if not setted, the integration is not enabled:

## GitHub

```js
var config = {
  github : {
    oauthToken : 'your-token',
    secret : 'create-your-own-secret'
  }
};
```

## Trello

```js
var config = {
  trello : {
    key : 'your-key',
    token : 'your-token'
    secret : 'your-secret',
    callBackUrl : 'https://your-porcupine-url/trello'
  }
};
```

## Jenkins

```js
var config = {
  jenkins : {
    baseUrl : 'https://your-jenkins-url.com',
    user : 'jenkins-user',
    pass : 'jenkins-pass',
    secret : 'create-your-own-secret'
  }
};
```

## Slack

```js
var config = {
  slack : {
    incomingHookUrl : 'https://slack-incoming-hook-url.com'
    token : 'your-token'
  }
};
```

# Hooks

To use hooks you have to create them for Trello and GitHub. The easiest way is to create a dedicated user at those services and create the hooks with this user. A helpful tool to make the API calls is [DHCS](https://www.sprintapi.com/dhcs.html). To receive the hooks your installation have to be avaiable in the internet, an easy way to develop locally is by using [Ngrok](https://ngrok.com/).

## GitHub hooks

You can find more information about GitHub hooks [here](http://developer.github.com/v3/repos/hooks/).

- [Create a token](https://github.com/settings/applications) *(grant access to `repo` and `admin:repo_hook`)*

- [Create a hook](http://developer.github.com/v3/repos/hooks/#create-a-hook):

```
Method: POST
URL: https://api.github.com/repos/:owner:/:repo:/hooks
Header: "Authorization: token :token:"
```

Body:

```json
{
  "name": "web",
  "active": true,
  "events": [
    "push",
    "issues",
    "issue_comment",
    "commit_comment",
    "pull_request",
    "pull_request_review_comment",
    "release"
  ],
  "config": {
    "url": "https://:your_installation_url:/github",
    "content_type": "json",
    "insecure_ssl": "1",
    "secret": "your-secret"
  }
}
```

### List hooks

```
Method: GET
URL: https://api.github.com/repos/:owner:/:repo:/hooks
Header: "Authorization: token :token:"
```

### Delete hook

```
Method: DELETE
URL: https://api.github.com/repos/:owner:/:repo:/hooks/:hook_id:
Header: "Authorization: token :token:"
```

### Observations

- Accepts self-signed certificates if you send the "insecure_ssl" config;
- It's possible to use a different port than 443 for HTTPS on hooks;

## Trello hooks

You can find more information about Trello hooks [here](https://trello.com/docs/gettingstarted/webhooks.html).

- [Generate your key](https://trello.com/1/appKey/generate)
- [Generate your token](https://trello.com/docs/gettingstarted/authorize.html):

```
Method: GET
URL: https://trello.com/1/connect?key=:key:&name=Porcupine&response_type=token&scope=read,write&expiration=never
```

- Get the board ID. The hash in the URL of the board is the short ID:

```
Method: GET
URL: https://trello.com/1/board/:short_id:
```

- [Create a hook](https://trello.com/docs/gettingstarted/webhooks.html#creating-a-webhook):

```
Method: POST
URL: https://trello.com/1/tokens/:token:/webhooks/?key=:key:
```

*There is a Trello bug with this API call that forces you to send some headers:*

```
Accept: application/json
Content-Type: application/json
```

Body:

```json
{
  "description": "Porcupine",
  "callbackURL": "https://:your_installation_url:/trello",
  "idModel": ":model_id:"
}
```

### List hooks

```
Method: GET
URL: https://trello.com/1/tokens/:token:/webhooks/?key=:key:
```

### Delete hook

```
Method: DELETE
URL: https://trello.com/1/tokens/:token:/webhooks/:hook_id:/?key=:key:
```

### Observations

- Accepts self-signed certificates;
- It's not possible to use a different port than 443 for HTTPS on hooks;

## Jenkins hooks

Jenkins hooks have to be called inside your job script.

Porcupine is expecting two headers:

 - `x-jenkins-signature`: A sha1 hmac hash of the content using the configured secret on config.secret
 - `x-jenkins-event`: A string that defines the hook event

### Events

The supported events are:

- `commit`: This event is used for continuous integration and should contain the commit hash, the status of the build, job name and the build URL, for example:

```json
{
    "commit" : "574607f5e8a49a2c82475737484f193856d4b430",
    "status" : true,
    "job" : "job-name",
    "buildUrl" : "https://jenkins-url/job/job-name/1"
}
```

Possible statuses are: `pending`, `success`, `error` and `failure`

### How to do it

Here goes an example using bash:

```bash
SECRET="your-secret"

LOAD="{\"commit\":\"${COMMIT}\",\"status\":\"pending\",\"job\":\"${JOB_NAME}\",\"buildUrl\":\"${BUILD_URL}\"}"
SECURITY=`echo -n $LOAD | openssl sha1 -hmac $SECRET | sed 's/^.* //'`
curl -d $LOAD -H "Content-Type: application/json" -H "x-jenkins-signature: ${SECURITY}" -H "x-jenkins-event: commit" https://your-porcupine-url/jenkins

ant build

if [ $? -eq 0 ]
then
    STATUS="success"
else
    STATUS="failure"
fi

LOAD="{\"commit\":\"${COMMIT}\",\"status\":\"${STATUS}\",\"job\":\"${JOB_NAME}\",\"buildUrl\":\"${BUILD_URL}\"}"
SECURITY=`echo -n $LOAD | openssl sha1 -hmac $SECRET | sed 's/^.* //'`
curl -d $LOAD -H "Content-Type: application/json" -H "x-jenkins-signature: ${SECURITY}" -H "x-jenkins-event: commit" https://your-porcupine-url/jenkins
```

## Slack hooks

You can configure slack commands to call Porcupine and for that you just have to configure the token and add the URL to Slack:

`https://:your_installation_url:/slack?porcupine-event=command`

**IMPORTANT**: The hook from Slack can receive an answer so the callback registered to this hook will receive a `response` on the `data` and the response have to be done:
 
 ```js
 data.response.send();
 ```

You can also setup an Incoming WebHooks on Slack and use Porcupine to send messages, just add the hook URL to the configuration.

# Example

To see how we use Porcupine just check our implementation at [natuelabs/our-porcupine](https://github.com/natuelabs/our-porcupine).
