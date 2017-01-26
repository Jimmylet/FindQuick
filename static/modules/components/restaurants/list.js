import Vue from "vue";
import reqwest from "reqwest";

import getLocation from "../../utils/location-manager.js";

let oRestaurantsList = Vue.component( "restaurants-list", {
    "data": function() {
        return {
            "loaded": false,
            "restaurants": [],
            "error": null,
        };
    },
    "template": `
        <div class="restaurants-list">
            <div class="loading" v-if="!loaded">
                <p>loading…</p>
            </div>
            <div class="error" v-if="loaded && error">
                <p>
                    <strong>Error:</strong> {{ error }}
                </p>
            </div>
            <ul v-if="loaded">
                <li v-for="elt in restaurants">
                    <router-link :to="'/' + elt.id">
                        <strong>{{ elt.name }}</strong>
                        <p  class="is-open closed" v-if="!elt.open">Fermé</p>
                        <p class="is-open open" v-if="elt.open">Ouvert</p>
                        <address>{{ elt.address }}</address>
                         <span class="distance">Se trouve à <span class="numero">{{ elt.distance }}m</span> de vous !</span>
                    </router-link>
                </li>
            </ul>
        </div>
    `,
    mounted() {
         this.updatePosition();
    },
    "methods": {
        updatePosition() {
            // 1. get user's position
            return getLocation()
                .then( ( { coords } ) => {
                    // 2. get terminals at position
                    return reqwest( {
                        "url": "/restaurants",
                        "method": "get",
                        "data": {
                            "latitude": coords.latitude,
                            "longitude": coords.longitude,
                        },
                    } );
                } )
                .then( ( oResponse ) => {

                    this.restaurants = oResponse.data.map( ( oRestaurant ) => {
                        oRestaurant.open = false;
                        reqwest( {
                            "url": "/restaurants/" + oRestaurant.id,
                            "method": "get",
                            "data": {},
                        } )
                            .then( ( oResponse ) => {
                                oRestaurant.open = oResponse.data.open;
                            } )
                            .catch( this.showError );

                        return oRestaurant;
                    } );
                    this.loaded = true;
                } )
                .catch( this.showError );
        },
        showError( { message } ) {
            this.loaded = true;
            this.error = message;
        },
    },
} );

export default oRestaurantsList;
