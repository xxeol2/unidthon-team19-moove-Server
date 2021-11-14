"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSTadminTokenService = exports.POSTadminService = void 0;
// models
const models_1 = require("../models");
// library
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
/**
 *  @staff_FundingGeneration_배정
 *  @route POST /api/v1/admin/:staffID/:fundGenID
 *  @error
 *      1. 요청 바디 부족
 *      2. 잘못된 adminkey
 *      3. 잘못된 fundGenID
 *      4. 잘못된 staffID
 */
const POSTadminService = (staffID, fundGenID, adminkey) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 요청 바디 부족
    if (!staffID || !fundGenID || !adminkey)
        return -1;
    if (adminkey !== process.env.ADMIN_KEY) {
        return -2;
    }
    //   return -2;
    const fundGen = yield models_1.FundGen.findOne({
        where: { id: fundGenID, isDeleted: false },
        attributes: ["university", "id"],
    });
    // 3. 잘못된 fundGenID
    if (!fundGen)
        return -3;
    // 4. 잘못된 staffID
    const staff = yield models_1.Staff.findOne({
        where: { id: staffID, isDeleted: false },
    });
    if (!staff)
        return -4;
    const key = String(Math.floor(Math.random() * 6) + 1);
    yield models_1.GenManage.create({
        staffID,
        fundGenID,
        key,
        isDone: false,
    });
    const resData = {
        key,
    };
    return resData;
});
exports.POSTadminService = POSTadminService;
/**
 *  @admin_token_발급
 *  @route POST /api/v1/admin/token
 *  @error
 *      1. 요청 바디 부족
 *      1. 잘못된 admin key
 */
const POSTadminTokenService = (adminkey) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 요청 바디 부족
    if (!adminkey)
        return -1;
    if (adminkey !== process.env.ADMIN_KEY)
        return -2;
    // Return jsonwebtoken
    const payload = {
        admin: {
            key: adminkey,
        },
    };
    // access 토큰 발급
    // 유효기간 14일
    let token = jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: "14d" });
    return { token };
});
exports.POSTadminTokenService = POSTadminTokenService;
const adminService = {
    POSTadminService: exports.POSTadminService,
    POSTadminTokenService: exports.POSTadminTokenService,
};
exports.default = adminService;
//# sourceMappingURL=adminService.js.map