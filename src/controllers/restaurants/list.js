import getRestaurants from "../../models/restaurants";
import { send, error } from "../../core/utils/api";
import distance from "jeyo-distans";
import checkPosition from "../../core/utils/position";

const ARC_KILOMETER = 0.009259, // 1 décimale de lat/lng vaut X km.
    DEFAULT_RADIUS = 15,
    MAX_RADIUS = 100;

export default function( oRequest, oResponse ) {

    let oCurrentPosition = checkPosition( +oRequest.query.latitude, +oRequest.query.longitude ),
        iSearchRadius = +oRequest.query.radius;

    if ( !oCurrentPosition ) {
        return error( oRequest, oResponse, "Invalid position!", 400 );
    }

    // check & cap radius
    ( isNaN( iSearchRadius ) ) && ( iSearchRadius = DEFAULT_RADIUS );
    ( iSearchRadius < DEFAULT_RADIUS ) && ( iSearchRadius = DEFAULT_RADIUS );
    ( iSearchRadius > MAX_RADIUS ) && ( iSearchRadius = MAX_RADIUS );

    iSearchRadius *= ARC_KILOMETER; // convert radius from kilometer to arc

    getRestaurants()
        .find( {
            "latitude": {
                "$gt": oCurrentPosition.latitude - iSearchRadius,
                "$lt": oCurrentPosition.latitude + iSearchRadius,
            },
            "longitude": {
                "$gt": oCurrentPosition.longitude - iSearchRadius,
                "$lt": oCurrentPosition.longitude + iSearchRadius,
            },
            "deleted_at": null,
        } )
        .toArray()
        .then( ( aRestaurants = [] ) => {
            let aDataRestaurants;

            // clean useless properties AND compute distance
            aDataRestaurants = aRestaurants.map( ( { _id, name, latitude, longitude, address, hours } ) => ( {
                "id": _id,
                "distance": distance( oCurrentPosition, { latitude, longitude } ) * 1000,
                name, latitude, longitude, address, hours
            } ) );

            aDataRestaurants.sort( ( oTerminalOne, oTerminalTwo ) => oTerminalOne.distance - oTerminalTwo.distance );

            send( oRequest, oResponse, aDataRestaurants );

        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}


