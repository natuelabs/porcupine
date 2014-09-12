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
    }
  },

  trello : {

    card : {
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
      updated : 'trello__card__updated'
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
    }
  },

  jenkins : {
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