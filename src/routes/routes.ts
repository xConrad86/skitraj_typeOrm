import { Router } from "express";
import Auth from "./Auth";
import User from "./User";
import Docs from "./Docs";
import Mail from "./Mail"

const Routes = Router();

Routes.use("/auth", Auth);
Routes.use("/user", User);
Routes.use("/docs", Docs);
Routes.use("/test", Mail);

export default Routes;
