"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.post("/token", controller_1.adminController.POSTadminTokenController);
router.post("/:staffID/:fundGenID", middleware_1.adminAuthMiddleware, controller_1.adminController.POSTadminController);
exports.default = router;
//# sourceMappingURL=adminRouter.js.map