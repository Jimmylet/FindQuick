import { db } from "../core/mongodb";

export default function() {
    return db.collection( "restaurants" );
}
