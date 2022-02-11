import { Router } from "express";
import AuthController from "../controller/AuthController";
import { authenticateToken } from "../classes/Permission";

const router = Router();

//Avaiable for all users
//Login route
router.post("/login", AuthController.login);

//Change password
router.post("/change-password", [authenticateToken], AuthController.changePassword);

export default router;