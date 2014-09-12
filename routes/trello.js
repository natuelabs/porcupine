module.exports = {
  head : function ( req, res ) {
    res.json();
  },
  post : function ( req, res ) {
    req.app.get( 'models' ).trello.process( req );

    res.json();
  }
};