import express from "express";
import { staffController } from "../controller";
import {
  typeCheckMiddleware,
  authMiddleware,
  staffAuthMiddleware,
} from "../middleware";

const upload = require("../modules/upload");
const router = express.Router();

router.post(
  "/signup",
  typeCheckMiddleware,
  staffController.POSTsignupController
);

router.post(
  "/signin",
  typeCheckMiddleware,
  staffController.POSTsigninController
);

router.post(
  "/:fundGenID",
  upload.fields([{ name: "photo", maxCount: 1 }]),
  staffAuthMiddleware,
  staffController.POSTphotoController
);
export default router;
