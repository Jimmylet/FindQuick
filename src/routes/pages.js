import { Router } from "express";

import homepageController from "../controllers/pages/home";

let oRouter = new Router();
oRouter.get( "/", homepageController );

export default oRouter;
