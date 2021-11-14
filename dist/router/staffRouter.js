"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
const upload = require("../modules/upload");
const router = express_1.default.Router();
router.post("/signup", middleware_1.typeCheckMiddleware, controller_1.staffController.POSTsignupController);
router.post("/signin", middleware_1.typeCheckMiddleware, controller_1.staffController.POSTsigninController);
router.post("/:fundGenID", upload.fields([{ name: "photo", maxCount: 1 }]), middleware_1.staffAuthMiddleware, controller_1.staffController.POSTphotoController);
exports.default = router;
//# sourceMappingURL=staffRouter.js.map