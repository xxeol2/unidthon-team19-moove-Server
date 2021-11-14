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
 *  @회원가입
 *  @route Post /api/v1/staff/signup
 *  @body email,password, name, phone, university
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 */
const POSTsignupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 이메일 형식이 잘못된 경우
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
    }
    try {
        const reqData = req.body;
        const data = yield service_1.staffService.POSTsignupService(reqData);
        // 요청 바디가 부족할 경우
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        else if (data === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "이미 가입된 이메일입니다.");
        }
        // 회원가입 성공
        else {
            const { token } = data;
            library_1.response.tokenResponse(res, library_1.returnCode.CREATED, true, "staff 회원가입 성공", token);
        }
    }
    catch (err) {
        // console.log(err);
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
/**
 *  @로그인
 *  @route Post /api/v1/staff/siginin
 *  @body email,password
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디가 존재하지 않음
 *      3. 패스워드가 올바르지 않음
 */
const POSTsigninController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 이메일 형식이 잘못된 경우
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
    }
    try {
        const reqData = req.body;
        const data = yield service_1.staffService.POSTsigninService(reqData);
        // 1. 요청 바디 부족
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        // 2. 아이디가 존재하지 않음
        else if (data === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "아이디가 존재하지 않습니다");
        }
        // 3. 패스워드가 올바르지 않음
        else if (data === -3) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "비밀번호가 틀렸습니다");
        }
        // 로그인 성공
        else {
            const { resData, token } = data;
            library_1.response.dataTokenResponse(res, library_1.returnCode.OK, true, "staff 로그인 성공", resData, token);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
/**
 *  @수행_완료_인증사진_첨부
 *  @route Post /api/v1/staff/:fundGenID
 *  @body file(form-data-file)
 *  @error
 *      1. 요청 바디 부족
 *      2. staff id 잘못됨
 *      3, fundGenID가 잘못됨
 *      4. 해당 staff에게 권한이 없을 때
 */
const POSTphotoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = {
            photo: req.files.photo
                ? req.files.photo[0].location
                : null,
        };
        const data = yield service_1.staffService.POSTphotoService(req.body.staff.id, Number(req.params.fundGenID), url);
        // 1. 요청 바디 부족
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        // 2. staff id 잘못됨
        else if (data === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "staff 아이디가 존재하지 않습니다");
        }
        //3. fundGenID가 잘못됨
        else if (data === -3) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "fundGenID가 존재하지 않습니다");
        }
        //4. 해당 staff에게 권한이 없음
        else if (data === -4) {
            library_1.response.basicResponse(res, library_1.returnCode.UNAUTHORIZED, false, "권한이 없는 staff입니다");
        }
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, true, "수행 인증이 완료되었습니다", data);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
const authController = {
    POSTsignupController,
    POSTsigninController,
    POSTphotoController,
};
exports.default = authController;
//# sourceMappingURL=staffController.js.map