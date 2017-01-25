import { ObjectID } from "mongodb";

import getRestaurants from "../../models/restaurants";
import { send, error } from "../../core/utils/api";
import checkPosition from "../../core/utils/position";

export default function( oRequest, oResponse ) {

    const POST = oRequest.body;

    let iLatitude = +POST.latitude,
        iLongitude = +POST.longitude,
        sAddress = ( POST.address || "" ).trim(),
        sName = ( POST.name || "" ).trim(),
        sSlug = sName.replace( /\s+/g, '-' ).toLowerCase(),
        aHours = ( POST.hours || "" ),
        oPosition = checkPosition( iLatitude, iLongitude ),
        oRestaurant;

    if ( !oPosition ) {
        return error( oRequest, oResponse, "Invalid position", 400 );
    }


    oRestaurant = {
        "latitude": oPosition.latitude,
        "longitude": oPosition.longitude,
        "created_at": new Date(),
        "updated_at": new Date(),
    };

    sAddress && ( oRestaurant.address = sAddress );
    sName && ( oRestaurant.name = sName );
    sSlug && ( oRestaurant.slug = sSlug );
    aHours && ( oRestaurant.hours = aHours );

    getRestaurants()
        .insertOne( oRestaurant )
        .then( () => {
            send( oRequest, oResponse, {
                "id": oRestaurant._id,
                "slug": oRestaurant.slug || null,
                "name": oRestaurant.name || null,
                "address": oRestaurant.address || null,
                "hours": oRestaurant.hours,
                "latitude": oRestaurant.latitude,
                "longitude": oRestaurant.longitude,
            }, 201 );
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}
