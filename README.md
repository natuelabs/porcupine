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

## Trello

- Hooks
    - Card created
    - Card updated
    - Card comment created
    - Card attachment created
- Calls
    - Update card

## Jenkins

- Calls
    - Build job


# How to use it

The interaction with Porcupine will happen all via events, both to receive hooks or to make calls. All events with params and returns are listed on [models/events.js](https://github.com/natuelabs/porcupine/blob/master/models/events.js).

To use it, just require Porcupine, init the configs, port to run and play with the events:

```js
var porcupine = require( 'porcupine' );
var eventEmitter = porcupine.getEventEmitter();
var events = porcupine.getEvents();

var config = {
  github : {
    oauthToken : 'your_token'
  },
  trello : {
    key : 'your_key',
    token : 'your_token'
  }
};

// By default Backhole will run over the port 3000
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
    oauthToken : 'your_token'
  }
};
```

## Trello

```js
var config = {
  trello : {
    key : 'your_key',
    token : 'your_token'
  }
};
```

## Jenkins

```js
var config = {
  jenkins : {
    baseUrl : 'http://your_jenkins_url.com',
    user : 'jenkins_user',
    pass : 'jenkins_pass'
  }
};
```

# Hooks

To use hooks you have to create them for Trello and GitHub. The easiest way is to create a dedicated user at those services and create the hooks with this user. A helpful tool to make the API calls is [DHCS](https://www.sprintapi.com/dhcs.html). To receive the hooks your installation have to be avaiable in the internet, an easy way to develop locally is by using [Ngrok](https://ngrok.com/).

## GitHub hooks

You can find more information about GitHub hooks [here](http://developer.github.com/v3/repos/hooks/).

- [Create a token](https://github.com/settings/applications)
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
    "insecure_ssl": "1"
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

# Example

To see how we use Porcupine just check our implementation at [natuelabs/our-porcupine](https://github.com/natuelabs/our-porcupine).
