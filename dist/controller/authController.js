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
 *  @이메일_인증번호_전송
 *  @route Post /api/v1/auth/email
 *  @desc post email code for certification
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 가입한 email
 *      3. 이메일 전송 실패
 */
const POSTemailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 이메일 형식이 잘못된 경우
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다.");
    }
    try {
        const reqData = req.body;
        const resData = yield service_1.authService.POSTemailService(reqData);
        // 요청 바디가 부족할 경우
        if (resData === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다.");
        }
        // 2. 이미 가입한 email
        else if (resData === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "이미 가입된 이메일 입니다");
        }
        //이메일 전송이 실패한 경우
        else if (resData === -3) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "이메일 전송을 실패했습니다");
        }
        //성공
        else {
            library_1.response.dataResponse(res, library_1.returnCode.CREATED, true, "인증번호 전송 성공", resData);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
/**
 *  @인증번호_인증
 *  @route Post /api/v1/auth/code
 *  @body email, code
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 *      2. 인증 시도 하지 않은 이메일
 *      3. 인증번호 인증 실패
 */
const POSTcodeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 이메일 형식이 잘못된 경우
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다.");
    }
    try {
        const reqData = req.body;
        const resData = yield service_1.authService.POSTcodeService(reqData);
        // 1. 요청 바디가 부족할 경우
        if (resData === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        // 2. email이 DB에 없을 경우
        else if (resData === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "인증 시도 하지 않은 이메일입니다");
        }
        // 인증번호가 올바르지 않은 경우
        else if (resData === -3) {
            library_1.response.dataResponse(res, library_1.returnCode.OK, false, "인증번호 인증 실패", {
                isOkay: false,
            });
        }
        else if (resData === -4) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "이미 가입된 이메일입니다");
        }
        // 인증번호 인증 성공
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, "인증번호 인증 성공", true, {
                isOkay: true,
            });
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
/**
 *  @회원가입
 *  @route Post /api/v1/auth/signup
 *  @body email,password, nickname, university
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
        const data = yield service_1.authService.POSTsignupService(reqData);
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
            library_1.response.tokenResponse(res, library_1.returnCode.CREATED, true, "회원가입 성공", token);
        }
    }
    catch (err) {
        // console.log(err);
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
/**
 *  @닉네임_중복_검사
 *  @route POST /api/v1/auth/nickname
 *  @body email, code
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 존재하는 email
 */
const POSTnicknameController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다.");
    }
    try {
        const reqData = req.body;
        const resData = yield service_1.authService.POSTnicknameService(reqData);
        // 1. 요청 바디가 부족할 경우
        if (resData === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        // 2. 이미 존재하는 email
        else if (resData === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "이미 존재하는 닉네임입니다");
        }
        // 닉네임 사용 가능
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, true, "닉네임 사용 가능", {
                isOkay: true,
            });
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
/**
 *  @로그인
 *  @route Post /api/v1/auth/siginin
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
        const data = yield service_1.authService.POSTsigninService(reqData);
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
            library_1.response.dataTokenResponse(res, library_1.returnCode.OK, true, "로그인 성공", resData, token);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
const authController = {
    POSTemailController,
    POSTcodeController,
    POSTsignupController,
    POSTnicknameController,
    POSTsigninController,
};
exports.default = authController;
//# sourceMappingURL=authController.js.map