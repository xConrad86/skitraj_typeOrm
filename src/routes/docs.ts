import { Router } from "express";
import DocsController from "../controller/UserController";

const router = Router();

router.get("/", DocsController.apiReference);

export default router;
