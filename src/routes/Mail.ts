import { Router } from "express";
import MailController from "../controller/MailController";
import { authenticateToken } from "../classes/Permission";

const router = Router();

//Avaiable for all users
router.post("/mail", MailController.sendTestEmail);

export default router;
