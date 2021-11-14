import { Router } from "express";
// controller
import { userController } from "../controller";
// middleware
import { authMiddleware, publicAuthMiddleware } from "../middleware";
const upload = require("../modules/upload");
const router = Router();

router.get("", publicAuthMiddleware, userController.GETuserController);

router.post(
  "/photo/:orderID",
  upload.fields([{ name: "photo", maxCount: 1 }]),
  publicAuthMiddleware,
  userController.POSTphotoController
);

export default router;
