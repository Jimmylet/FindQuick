import { error } from "../../core/utils/api";

export default function( oRequest, oResponse ) {
    error( oRequest, oResponse, { "message": "There's an error!" } );
}
