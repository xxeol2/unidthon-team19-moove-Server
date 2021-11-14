"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controller
const controller_1 = require("../controller");
// middleware
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.get("", middleware_1.publicAuthMiddleware, controller_1.goodsController.GETgoodsController);
router.get("/:genGoodsID", middleware_1.publicAuthMiddleware, controller_1.goodsController.GETgoodsDetailController);
router.post("/:genGoodsID/:orderingNum", middleware_1.publicAuthMiddleware, controller_1.goodsController.POSTgoodsController);
exports.default = router;
//# sourceMappingURL=goodsRouter.js.map