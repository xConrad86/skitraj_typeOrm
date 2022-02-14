import { Router } from "express";
import Auth from "./Auth";
import User from "./User";
import Docs from "./Docs";

const Routes = Router();

Routes.use("/auth", Auth);
Routes.use("/user", User);
Routes.use("/docs", Docs);

export default Routes;
