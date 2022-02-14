import { Router } from "express";
import DocsController from "../controller/DocsController";

const router = Router();

router.get("/docs", DocsController.apiReference);

export default router;
