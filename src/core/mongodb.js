import { MongoClient } from "mongodb";
import Promise from "bluebird";
import zouti from "zouti";

const MONGO_URL = "mongodb://127.0.0.1:27017/findquick";

let oDB, fInit;

fInit = function() {
    return new Promise( ( fResolve, fReject ) => {
        MongoClient.connect( MONGO_URL, ( oError, oLinkedDB ) => {
            if ( oError ) {
                return fReject( oError );
            }

            zouti.success( "Connected to DB", "findquick" );
            fResolve( oDB = oLinkedDB );
        } );
    } );
};

export {
    fInit as init,
    oDB as db,
};
