import { ObjectID } from "mongodb";

import getRestaurants from "../../models/restaurants";
import { send, error } from "../../core/utils/api";
import distance from "jeyo-distans";
import checkPosition from "../../core/utils/position";
import { checkRestaurant } from "../../models/restaurants";

const MAX_MOVE_DISTANCE = 0.1; // in km

export default function( oRequest, oResponse ) {

    // 1. get values

    const POST = oRequest.body;

    let sRestaurantID,
        sAddress = ( POST.address || "" ).trim(),
        iLatitude = POST.latitude,
        iLongitude = POST.longitude,
        sName = ( POST.name || "" ).trim(),
        aHours = ( POST.hours || "" ),
        aModifications = [],
        oPosition;

    try {
        sRestaurantID = new ObjectID( oRequest.params.id );
    } catch ( oError ) {
        return error( oRequest, oResponse, new Error( "Invalid ID!" ), 400 );
    }

    // 2. check if terminal exists

    getRestaurants()
        .findOne( {
            "_id": sRestaurantID,
        } )
        .then( ( oRestaurant ) => {
            if ( !oRestaurant ) {
                return error( oRequest, oResponse, new Error( "Unknown Restaurant" ), 404 );
            }


            // 3. check values

            // 3a. check position
            if ( iLatitude != null && iLongitude != null ) {
                oPosition = checkPosition( +iLatitude, +iLongitude );
                if ( !oPosition ) {
                    return error( oRequest, oResponse, new Error( "Invalid position" ), 400 );
                }

                // if position ≠ old position, check move distance
                if ( oRestaurant.latitude !== oPosition.latitude || oRestaurant.longitude !== oPosition.longitude ) {
                    if ( distance( oPosition, oRestaurant ) > MAX_MOVE_DISTANCE ) {
                        return error( oRequest, oResponse, new Error( "Movement is too big" ), 400 );
                    }
                    oRestaurant.latitude = oPosition.latitude;
                    oRestaurant.longitude = oPosition.longitude;
                    aModifications.push( "latitude", "longitude" );
                }
            }

            // 3b. check values
            if ( sAddress ) {
                oRestaurant.address = sAddress;
                aModifications.push( "address" );
            }

            if ( sName ) {
                oRestaurant.name = sName;
                oRestaurant.slug = sName.replace( /\s+/g, '-' ).toLowerCase();
                aModifications.push( "name", "slug" );
            }

            if ( aHours ) {
                oRestaurant.hours = aHours;
                aModifications.push( "hours" );
            }

            // 3c. checkRestaurant and push
            return checkRestaurant( sRestaurantID ).then( ( ) => {
                let oModificationsToApply = {};

                if ( aModifications.length === 0 ) {
                    return error( oRequest, oResponse, new Error( "No changes" ), 400 );
                }

                aModifications.forEach( ( sPropertyName ) => {
                    oModificationsToApply[ sPropertyName ] = oRestaurant[ sPropertyName ];
                } );

                oModificationsToApply.updated_at = new Date();

                return getRestaurants()
                    .updateOne( {
                        "_id": oRestaurant._id,
                    }, {
                        "$set": oModificationsToApply,
                    } )
                    .then( ( { matchedCount, modifiedCount } ) => {
                        if ( matchedCount !== 1 || modifiedCount !== 1 ) {
                            return error( oRequest, oResponse, new Error( "Unknown save error" ), 500 );
                        }

                        return send( oRequest, oResponse, null, 204 );
                    } );
            } );
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}
