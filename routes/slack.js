module.exports = {
  post : function ( req, res ) {
    req.app.get( 'models' ).slack.process( req, res );
  }
};
