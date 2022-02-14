import { Router } from "express";
import DocsController from "../controller/DocsController";

const router = Router();

router.get("/api", DocsController.apiReference);

export default router;
