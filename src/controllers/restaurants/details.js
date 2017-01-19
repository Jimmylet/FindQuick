import getRestaurants from "../../models/restaurants";
import { send, error } from "../../core/utils/api";
import { ObjectID } from "mongodb";

export default function ( oRequest, oResponse ) {

    let sRestaurantID = ( oRequest.params.id || "" ).trim();

    if ( !sRestaurantID ) {
        error( oRequest, oResponse, "Invalid ID!", 400 );
    }

    getRestaurants()
        .findOne( {
            "_id": new ObjectID( sRestaurantID ),
            "deleted_at": null,
        } )
        .then( ( { _id, name, latitude, longitude, address, hours } ) => {

            let oRestaurantData;

            if ( !_id ){
                return error ( oRequest, oResponse, "Unknown Restaurant", 404);
            }

            oRestaurantData = {
                "id": _id,
                name, latitude, longitude, address, hours
            }

            send ( oRequest, oResponse, oRestaurantData );
        })
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );
}
