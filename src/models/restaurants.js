import { db } from "../core/mongodb";

let oRestaurants = db.collection( "restaurants" );

export default oRestaurants;
