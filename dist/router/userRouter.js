"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controller
const controller_1 = require("../controller");
// middleware
const middleware_1 = require("../middleware");
const upload = require("../modules/upload");
const router = (0, express_1.Router)();
router.get("", middleware_1.publicAuthMiddleware, controller_1.userController.GETuserController);
router.post("/photo/:orderID", upload.fields([{ name: "photo", maxCount: 1 }]), middleware_1.publicAuthMiddleware, controller_1.userController.POSTphotoController);
exports.default = router;
//# sourceMappingURL=userRouter.js.map