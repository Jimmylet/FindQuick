import { db } from "../core/mongodb";
import Promise from "bluebird";
import { ObjectID } from "mongodb";

let fCheckRestaurant;


fCheckRestaurant = function( sRestaurantID ) {
    let oRestaurantID;

    if ( !sRestaurantID ) {
        return Promise.resolve( false );
    }

    try {
        oRestaurantID = new ObjectID( sRestaurantID );
    } catch ( oError ) {
        return Promise.reject( new Error( "Invalid Bank ID!" ) );
    }

    return db.collection( "restaurants" )
        .findOne( {
            "_id": oRestaurantID,
        } )
        .then( ( oRestaurant ) => {
            if ( oRestaurant ) {
                return Promise.resolve( true );
            }

            return Promise.reject( new Error( "Unknown Restaurant!" ) );
        } );
};

export default function() {
    return db.collection( "restaurants" );
}

export {
    fCheckRestaurant as checkRestaurant,
};
