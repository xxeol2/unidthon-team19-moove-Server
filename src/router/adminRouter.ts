import express from "express";
import { adminController } from "../controller";
import { typeCheckMiddleware, adminAuthMiddleware } from "../middleware";

const router = express.Router();

router.post("/token", adminController.POSTadminTokenController);
router.post(
  "/:staffID/:fundGenID",
  adminAuthMiddleware,
  adminController.POSTadminController
);

export default router;
