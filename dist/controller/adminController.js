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
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// libraries
const library_1 = require("../library");
// services
const service_1 = require("../service");
/**
 *  @staff_FundingGeneration_배정
 *  @route POST /api/v1/admin/:staffID/:fundGenID
 *  @error
 *      1. 요청 바디 부족
 *      2. 잘못된 adminkey
 *      3. 잘못된 fundGenID
 *      4. 잘못된 staffID
 */
const POSTadminController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 이메일 형식이 잘못된 경우
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
    }
    try {
        const reqData = req.body;
        const data = yield service_1.adminService.POSTadminService(Number(req.params.staffID), Number(req.params.fundGenID), req.body.admin.key);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        else if (data === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "adminkey 불일치");
        }
        else if (data === -3) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "fundGenID가 올바르지 않습니다");
        }
        else if (data === -4) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "staffID가 올바르지 않습니다");
        }
        else {
            library_1.response.dataResponse(res, library_1.returnCode.CREATED, true, "staff FundingGeneration 배정완료", data);
        }
    }
    catch (err) {
        // console.log(err);
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
/**
 *  @admin_token_발급
 *  @route POST /api/v1/admin/token
 *  @error
 *      1. 요청 바디 부족
 *      1. 잘못된 admin key
 */
const POSTadminTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 이메일 형식이 잘못된 경우
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
    }
    try {
        const reqData = req.body;
        const data = yield service_1.adminService.POSTadminTokenService(req.body.adminkey);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        else if (data === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "adminkey 불일치");
        }
        // 회원가입 성공
        else {
            const { token } = data;
            library_1.response.tokenResponse(res, library_1.returnCode.CREATED, true, "admin token 발급 성공", token);
        }
    }
    catch (err) {
        // console.log(err);
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
const adminController = {
    POSTadminTokenController,
    POSTadminController,
};
exports.default = adminController;
//# sourceMappingURL=adminController.js.map