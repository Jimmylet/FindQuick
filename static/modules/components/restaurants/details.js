import Vue from "vue";
import reqwest from "reqwest";
import getLocation from "../../utils/location-manager.js";

let oRestaurantDetail = Vue.component( "restaurant-details", {
    "data": function() {
        return {
            "loaded": false,
            "terminal": {},
            "error": null,
        };
    },
    "template": `
        <div class="restaurant-details">
            <router-link to="/">&lsaquo; retour</router-link>
            <div class="loading" v-if="!loaded">
                <p>loading…</p>
            </div>
            <div class="error" v-if="loaded && error">
                <p>
                    <strong>Error:</strong> {{ error }}
                </p>
            </div>
            <div v-if="loaded">
                <h2>{{ restaurant.name }}</h2>
                <address>{{ restaurant.address }}</address>
                <p>{{ restaurant.distance }}m</p>
            </div>
        </div>
    `,
    mounted() {
        this.fetchInfos( this.$route.params.id )
    },
    "methods": {
        fetchInfos( sRestaurantId ) {
            return getLocation()
                .then( ( { coords } ) => {
                    return reqwest( {
                        "url": `/restaurants/${ sRestaurantId }`,
                        "method": "get",
                        "data": {
                            "latitude": coords.latitude,
                            "longitude": coords.longitude,
                        },
                    } );
                } )
                .then( ( oResponse ) => {
                    let oRestaurant = oResponse.data;

                    this.loaded = true;
                    this.restaurant = oRestaurant;

                } )
                .catch( this.showError );
        },
        showError( { message } ) {
            this.loaded = true;
            this.error = message;
        },
    },
} );

export default oRestaurantDetail;
