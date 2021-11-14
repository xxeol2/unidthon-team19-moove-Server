import { Router } from "express";
// controller
import { goodsController } from "../controller";
// middleware
import { authMiddleware, publicAuthMiddleware } from "../middleware";

const router = Router();

router.get("", publicAuthMiddleware, goodsController.GETgoodsController);
router.get(
  "/:genGoodsID",
  publicAuthMiddleware,
  goodsController.GETgoodsDetailController
);
router.post(
  "/:genGoodsID/:orderingNum",
  publicAuthMiddleware,
  goodsController.POSTgoodsController
);

export default router;
