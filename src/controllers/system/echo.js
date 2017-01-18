export default function( oRequest, oResponse ) {
    let sEcho = oRequest.query.echo || "hello, world!";

    oResponse.send( {
        "url": oRequest.url,
        "timestamp": Date.now(),
        "data": sEcho,
        "error": false,
    } );
}
