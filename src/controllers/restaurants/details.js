import getRestaurants from "../../models/restaurants";
import { send, error } from "../../core/utils/api";
import { ObjectID } from "mongodb";
import distance from "jeyo-distans";

import checkPosition from "../../core/utils/position";


export default function ( oRequest, oResponse ) {

    let sRestaurantID = ( oRequest.params.id || "" ).trim(),
        oCurrentPosition;

    if ( !sRestaurantID ) {
        error( oRequest, oResponse, "Invalid ID!", 400 );
    }

    oCurrentPosition = checkPosition( +oRequest.query.latitude, +oRequest.query.longitude );

    getRestaurants()
        .findOne( {
            "_id": new ObjectID( sRestaurantID ),
            "deleted_at": null,
        } )
        .then( ( { _id, slug, name, latitude, longitude, address, hours } ) => {

            let oRestaurantData,
                bOpen = false,
                iCurrentDay = new Date().getDay(),
                iCurrentHour = new Date().getHours() + ( new Date().getMinutes() / 60 );

            if ( iCurrentDay === 0 ) {
                iCurrentHour = 7;
            }

            if ( iCurrentHour >= hours[ iCurrentDay - 1 ][ 0 ] && iCurrentHour <= hours[ iCurrentDay - 1 ][ 1 ] ) {
                bOpen = true;
            }



            if ( !_id ){
                return error ( oRequest, oResponse, "Unknown Restaurant", 404);
            }

            oRestaurantData = {
                "id": _id,
                "open": bOpen,
                slug, name, latitude, longitude, address, hours
            }

            if ( oCurrentPosition ){
                oRestaurantData.distance = distance( oCurrentPosition, oRestaurantData ) * 1000;
            }

            send ( oRequest, oResponse, oRestaurantData );
        })
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}

