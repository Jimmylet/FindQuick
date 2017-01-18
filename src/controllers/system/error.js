export default function( oRequest, oResponse ) {
    oResponse.status( 500 ).json( {
        "url": oRequest.url,
        "timestamp": Date.now(),
        "data": false,
        "error": {
            "message": "There's an error!",
        },
    } );
}
