var events = {
  github : {

    issue : {
      /**
       * data = {
       *  owner,
       *  repo,
       *  title,
       *  body
       * }
       *
       * @param data
       * @param callback
       *
       * response = {
       *   id,
       *   title,
       *   body,
       *   user,
       *   url
       * }
       *
       * @return response
       */
      create : 'github__issue__create',

      /**
       * response = {
       *   id,
       *   title,
       *   body,
       *   user,
       *   repository : {
       *     name,
       *     owner
       *   }
       * }
       *
       * @return response
       */
      created : 'github__issue__created',

      /**
       * data = {
       *  owner,
       *  repo,
       *  title,
       *  body'
       * }
       *
       * @param data
       * @param callback
       *
       * response = {
       *   id,
       *   title,
       *   body,
       *   user,
       *   url
       * }
       *
       * @return response
       */
      update : 'github__issue__update'
    },

    issueComment : {
      /**
       * data = {
       *  owner,
       *  repo,
       *  card = {
       *    id
       *  },
       *  body
       * }
       *
       * @param data
       * @param callback
       *
       * response = {
       *  id,
       *  body,
       *  user
       * }
       *
       * @return response
       */
      create : 'github__issueComment__create',

      /**
       * response = {
       *  id,
       *  body,
       *  user,
       *  repository : {
       *    name,
       *    owner
       *  }
       * }
       *
       * @return response
       */
      created : 'github__issueComment__created'
    },

    issueMember : {
      /**
       * data = {
       *  owner,
       *  repo,
       *  card = {
       *    id
       *  },
       *  username
       * }
       *
       * @param data
       * @param callback
       *
       * response = { }
       *
       * @return response
       */
      create : 'github__issueMember__create'
    },

    push : {
      /**
       * response = {
       *  ref,
       *  id,
       *  message,
       *  user,
       *  repository : {
       *    name,
       *    owner
       *  }
       * }
       *
       * @return response
       */
      created : 'github__push__created'
    },

    release : {
      /**
       * response = {
       *  tag,
       *  prerelease,
       *  name,
       *  body,
       *  user,
       *  repository : {
       *    name,
       *    owner
       *  }
       * }
       *
       * @return response
       */
      created : 'github__release__created'
    },

    commit : {
      /**
       * response = {
       *  commit,
       *  status,
       *  buildUrl
       *  owner
       *  repo
       * }
       *
       * @return response
       */
      status : 'github__commit__status'
    }
  },

  trello : {

    card : {
      /**
       * data = {
       *  id,
       *  board : {
       *    id
       *  }
       * }
       *
       * @param data
       * @param callback
       *
       * response = {
       *  id,
       *  title,
       *  body,
       *  closed,
       *  board : {
       *    id
       *  },
       *  list : {
       *    id
       *  }
       * }
       *
       * @return response
       */
      read : 'trello__card__read',

      /**
       * response = {
       *  id,
       *  title,
       *  user : {
       *    name,
       *    username,
       *    avatarHash
       *  }
       *  board : {
       *    id,
       *    name
       *  },
       *  list : {
       *    id,
       *    name
       *  }
       * }
       *
       * @return response
       */
      created : 'trello__card__created',

      /**
       * data = {
       *  id,
       *  title,
       *  body,
       *  closed,
       *  board : {
       *    id
       *  },
       *  list : {
       *    id
       *  }
       * }
       *
       * @param data
       * @param callback
       *
       * response = {
       *  id,
       *  title,
       *  body,
       *  closed,
       *  board : {
       *    id
       *  },
       *  list : {
       *    id
       *  }
       * }
       *
       * @return response
       */
      update : 'trello__card__update',

      /**
       * response = {
       *  id,
       *  title,
       *  body,
       *  user : {
       *    name,
       *    username,
       *    avatarHash
       *  }
       *  board : {
       *    id,
       *    name
       *  }
       * }
       *
       * @return response
       */
      updated : 'trello__card__updated',

      /**
       * response = {
       *  id,
       *  title,
       *  body,
       *  closed,
       *  user : {
       *    name,
       *    username,
       *    avatarHash
       *  }
       *  board : {
       *    id
       *  },
       *  list : {
       *    id
       *  }
       * }
       *
       * @return response
       */
      boardMoved : 'trello__card__boardMove'
    },

    cardComment : {
      /**
       * data = {
       *  id,
       *  text
       * }
       *
       * @param data
       * @param callback
       *
       * response = {
       *  text,
       *  user : {
       *    name,
       *    username,
       *    avatarHash
       *  }
       *  card : {
       *    id,
       *    name
       *  }
       * }
       *
       * @return response
       */
      create : 'trello__cardComment__create',

      /**
       * response = {
       *  text,
       *  user : {
       *    name,
       *    username,
       *    avatarHash
       *  }
       *  card : {
       *    id,
       *    name
       *  }
       *  board : {
       *    id,
       *    name
       *  }
       * }
       *
       * @return response
       */
      created : 'trello__cardComment__created'
    },

    cardAttachment : {
      /**
       * data = {
       *  id,
       *  url,
       *  name
       * }
       *
       * @param data
       * @param callback
       *
       * response = {
       *  card : {
       *    id
       *  }
       * }
       *
       * @return response
       */
      create : 'trello__cardAttachment__create',

      /**
       * response = {
       *  url,
       *  name,
       *  user : {
       *    name,
       *    username,
       *    avatarHash
       *  }
       *  card : {
       *    id,
       *    name
       *  }
       *  board : {
       *    id,
       *    name
       *  }
       * }
       *
       * @return response
       */
      created : 'trello__cardAttachment__created'
    },

    cardMember : {
      /**
       * response = {
       *  name,
       *  username,
       *  user : {
       *    name,
       *    username,
       *    avatarHash
       *  }
       *  card : {
       *    id,
       *    name
       *  }
       *  board : {
       *    id,
       *    name
       *  }
       * }
       *
       * @return response
       */
      created : 'trello__cardMember__created'
    }
  },

  jenkins : {
    commit : {
      /**
       * response = {
       *  commit,
       *  status,
       *  job,
       *  buildUrl
       * }
       *
       * @return response
       */
      built : 'jenkins__commit__built'
    },

    job : {
      /**
       * data = {
       *  job,
       *  params
       * }
       *
       * @param data
       * @param callback
       */
      build : 'jenkins__job__build'
    }
  }
};

module.exports = events;