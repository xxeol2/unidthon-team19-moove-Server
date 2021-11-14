import { Router } from "express";
// controller
import { basketController } from "../controller";
// middleware
import { authMiddleware, publicAuthMiddleware } from "../middleware";

const router = Router();

router.get("", publicAuthMiddleware, basketController.GETbasketController);
router.post("", publicAuthMiddleware, basketController.POSTbasketController);
export default router;
