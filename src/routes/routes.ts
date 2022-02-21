import { Router } from "express";
import Auth from "./Auth";
import User from "./User";
import Docs from "./Docs";
import Mail from "./Mail"
import { swaggerDocs } from "../utils/swagger";

const swaggerUI = require('swagger-ui-express'); 
const Routes = Router();

Routes.use("/auth", Auth);
Routes.use("/user", User);
Routes.use("/docs", Docs);
Routes.use("/test", Mail);
Routes.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs))


export default Routes;
