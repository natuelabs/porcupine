module.exports = {
  post : function ( req, res ) {
    req.app.get( 'models' ).jenkins.process( req );

    res.json();
  }
};