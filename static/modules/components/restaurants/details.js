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
            <router-link to="/">&lsaquo; Retour</router-link>
            <div class="loading" v-if="!loaded">
                <p>loading…</p>
            </div>
            <div class="error" v-if="loaded && error">
                <p>
                    <strong>Error:</strong> {{ error }}
                </p>
            </div>
            <div v-if="loaded" class="wrap-details">
                <h2>{{ restaurant.name }}</h2>
                <strong  class="closed" v-if="!restaurant.open">Fermé</strong>
                <strong class="open" v-if="restaurant.open">Ouvert</strong>
                <address>{{ restaurant.address }}</address>
                <span class="distance">Se trouve à <span class="numero">{{ restaurant.distance }}m</span> de vous !</span>
                <div class="hours">
                    <table>
                      <tr>
                        <td class="jour">
                          Lundi&nbsp;:
                        </td>
                        <td>
                          <time>{{ restaurant.hours[0][0] }}h - {{ restaurant.hours[0][1] }}h</time>
                        </td>
                      </tr>
                      <tr>
                        <td class="jour">
                          Mardi&nbsp;:
                        </td>
                        <td>
                          <time>{{ restaurant.hours[1][0] }}h - {{ restaurant.hours[1][1] }}h</time>
                        </td>
                      </tr>
                      <tr>
                        <td class="jour">
                          Mercredi&nbsp;:
                        </td>
                        <td>
                          <time>{{ restaurant.hours[2][0] }}h - {{ restaurant.hours[2][1] }}h</time>
                        </td>
                      </tr>
                      <tr>
                        <td class="jour">
                          Jeudi&nbsp;:
                        </td>
                        <td>
                          <time>{{ restaurant.hours[3][0] }}h - {{ restaurant.hours[3][1] }}h</time>
                        </td>
                      </tr>
                      <tr>
                        <td class="jour">
                          Vendredi&nbsp;:
                        </td>
                        <td>
                          <time>{{ restaurant.hours[4][0] }}h - {{ restaurant.hours[4][1] }}h</time>
                        </td>
                      </tr>
                      <tr>
                        <td class="jour">
                          Samedi&nbsp;:
                        </td>
                        <td>
                          <time>{{ restaurant.hours[5][0] }}h - {{ restaurant.hours[5][1] }}h</time>
                        </td>
                      </tr>
                      <tr>
                        <td class="jour">
                          Dimanche&nbsp;:
                        </td>
                        <td>
                          <time>{{ restaurant.hours[6][0] }}h - {{ restaurant.hours[6][1] }}h</time>
                        </td>
                      </tr>
                    </table>
                    
                    
                </div>
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
