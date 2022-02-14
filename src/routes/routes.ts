import { Router } from "express";
import Auth from "./Auth";
import User from "./User";

const Routes = Router();

Routes.use("/auth", Auth);
Routes.use("/user", User);

export default Routes;
