"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controller
const controller_1 = require("../controller");
// middleware
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.get("", middleware_1.publicAuthMiddleware, controller_1.basketController.GETbasketController);
router.post("", middleware_1.publicAuthMiddleware, controller_1.basketController.POSTbasketController);
exports.default = router;
//# sourceMappingURL=basketRouter.js.map