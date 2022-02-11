import { Router } from "express";
import AuthController from "../controller/AuthController";
import { authenticateToken } from "../classes/Permission";

const router = Router();

//Avaiable for all users
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/external-acc", [], AuthController.loginExternalAccount);
router.post("/change-password", [authenticateToken], AuthController.changePassword);

export default router;