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
// libraries
const library_1 = require("../library");
// services
const service_1 = require("../service");
/**
 *  @유저_프로필_조회
 *  @route GET /api/v1/user
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 정보 없음
 */
const GETuserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resData = yield service_1.userService.GETuserService(req.body.userID.userID);
        // 1. 요청 바디 부족
        if (resData === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        // 2. 유저 정보 없음
        else if (resData === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "없는 유저입니다");
        }
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, true, "유저 프로필 조회 성공", resData);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
/**
 *  @유저_수령_인증사진_첨부
 *  @route POST /user/photo/:orderID
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 정보 없음
 *      3. 주문 정보 없음
 */
const POSTphotoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = {
            photo: req.files.photo
                ? req.files.photo[0].location
                : null,
        };
        const data = yield service_1.userService.POSTphotoService(req.body.userID.userID, Number(req.params.orderID), url);
        // 1. 요청 바디 부족
        if (data === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        // 2. 유저 정보 없음
        else if (data === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "없는 유저입니다");
        }
        // 3. 주문 정보 없음
        else if (data === -3) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "없는 주문입니다");
        }
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, true, "유저 수령 인증 성공", data);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
const userController = {
    GETuserController,
    POSTphotoController,
};
exports.default = userController;
//# sourceMappingURL=userController.js.map