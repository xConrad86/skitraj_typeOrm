import { Router } from "express";
import AuthController from "../controller/AuthController";
import { authenticateToken } from "../classes/Permission";

const router = Router();

//Avaiable for all users
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/reset-password", AuthController.resetPassword);
router.patch("/reset-password/:token", [authenticateToken], AuthController.resetPasswordToken);
router.post("/change-password", [authenticateToken], AuthController.changePassword);
router.get("/:authProvider", AuthController.externalAuthRequest);
router.get("/:authProvider/callback", AuthController.externalAuthCallback);
router.get("/:authProvider/login", AuthController.externalLogin);
export default router;
