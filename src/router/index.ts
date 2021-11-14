import { Route53RecoveryCluster } from "aws-sdk";
import express, { Request, Response } from "express";

import authRouter from "./authRouter";
import goodsRouter from "./goodsRouter";
import userRouter from "./userRouter";
import staffRouter from "./staffRouter";


import adminRouter from "./adminRouter";
import basketRouter from "./basketRouter";
import { response, returnCode } from "../library";

const router = express.Router();

router.get("", async (req: Request, res: Response) => {
  try {
    response.basicResponse(res, returnCode.OK, true, "Welcome to Moov:E api");
  } catch (err) {
    response.basicResponse(
      res,
      returnCode.INTERNAL_SERVER_ERROR,
      false,
      "서버 오류"
    );
  }
});

router.use("/api/v1/auth", authRouter);
router.use("/api/v1/goods", goodsRouter);
router.use("/api/v1/user", userRouter);
router.use("/api/v1/staff", staffRouter);
router.use("/api/v1/admin", adminRouter);
router.use("/api/v1/basket", basketRouter);
export default router;
