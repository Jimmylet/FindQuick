import Promise from "bluebird";

const DEFAULT_OPTIONS = { "enableHighAccuracy": true },
    TTL = 60 * 1000; // 1 min

let oLastPosition;

export default function( oOptions = {} ) {
    if ( oLastPosition && Date.now() - oLastPosition.timestamp < TTL ) {
        return Promise.resolve( oLastPosition );
    }

    return new Promise( function( fResolve, fReject ) { // eslint-disable-line prefer-arrow-callback
        navigator.geolocation.getCurrentPosition( ( oPosition ) => fResolve( oLastPosition = oPosition ), fReject, Object.assign( {}, DEFAULT_OPTIONS, oOptions ) );
    } );
}
