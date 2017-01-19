import { Router } from "express";

// import list from "../controllers/restaurants/list";
import details from "../controllers/restaurants/details";
// import create from "../controllers/restaurants/create";
// import update from "../controllers/restaurants/update";
// import destroy from "../controllers/restaurants/destroy";

let oRouter = new Router();

// oRouter.get( "/restaurants", list );
oRouter.get( "/restaurants/:id", details );
// oRouter.post( "/restaurants", create );
// oRouter.patch( "/restaurants", update );
// oRouter.delete( "/restaurants", destroy );

export default oRouter;
