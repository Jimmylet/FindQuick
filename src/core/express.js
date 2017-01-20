import express from "express";
import bodyParser from "body-parser";
import responseTime from "response-time";
import mitanEko from "mitan-eko";
import zouti from "zouti";

import systemRoutes from "../routes/system";
import restaurantsRoutes from "../routes/restaurants";
import pagesRoutes from "../routes/pages";


const APP_PORT = 12345;

let oApp,
    fInit;

fInit = function( iAppPort = APP_PORT ) {
    if ( oApp ) {
        return oApp;
    }

    oApp = express();

    // configure middlewares
    oApp.use( mitanEko( "findquick" ) );
    oApp.use( responseTime() );
    oApp.use( bodyParser.json() );
    oApp.use( bodyParser.urlencoded( {
        "extended": true,
    } ) );

    // routes
    oApp.use( systemRoutes );
    oApp.use( restaurantsRoutes );
    oApp.use( pagesRoutes );


    // listening
    oApp.listen( iAppPort, () => {
        zouti.success( `Server is listening on ${ iAppPort }.`, "findquick" );
    } );
};

export {
    fInit as init,
};
