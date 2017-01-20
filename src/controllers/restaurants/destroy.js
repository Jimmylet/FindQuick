import { ObjectID } from "mongodb";
import { send, error } from "../../core/utils/api";
import getRestaurants from "../../models/restaurants";

export default function( oRequest, oResponse ) {

    let oRestaurantID;

    try {
        oRestaurantID = new ObjectID( oRequest.params.id );
    } catch ( oError ) {
        return error( oRequest, oResponse, new Error( "Invalid ID!" ), 400 );
    }

    getRestaurants()
        .deleteOne( {
            "_id": oRestaurantID,
        } )
        .then( ( { deletedCount } ) => {
            if ( deletedCount === 1 ) {
                return send( oRequest, oResponse, null, 204 );
            }

            return error( oRequest, oResponse, "Unknown deletion error", 500 );
        } )
        .catch( ( oError ) => error( oRequest, oResponse, oError ) );

}

