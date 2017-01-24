import Vue from "vue";
import VueRouter from "vue-router";

import RestaurantsList from "./components/restaurants/list";
import RestaurantsDetails from "./components/restaurants/details";

Vue.use( VueRouter );

let oRouter = new VueRouter( {
    "routes": [
        { "path": "/", "component": RestaurantsList },
        { "path": "/:id", "component": RestaurantsDetails },
    ],
} );

let oApp = new Vue( {
    "template": `
        <div class="wrapper">
            <header>
                <h1>Trouves ton Quick !</h1>
            </header>
            <router-view></router-view>
            <footer>
                <a href="https://github.com/hepl-ria/kach">hepl-ria/kach</a>
            </footer>
        </div>
    `,
    "router": oRouter,
} );

oApp.$mount( "#app" );
