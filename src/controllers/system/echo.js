import { send } from "../../core/utils/api";

export default function( oRequest, oResponse ) {
    let sEcho = oRequest.query.echo || "hello, world!";

    send( oRequest, oResponse, sEcho );
}
