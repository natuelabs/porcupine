module.exports = {
  post : function ( req, res ) {
    req.app.get( 'models' ).github.process( req );

    res.json();
  }
};