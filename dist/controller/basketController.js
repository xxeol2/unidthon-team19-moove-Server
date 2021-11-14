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
 *  @장바구니_정보_불러오기
 *  @route GET /api/v1/basket
 *  @error
 *      1. 요청 바디 부족
 *      2. 식료품 펀딩 기간이 아님
 */
const GETbasketController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resData = yield service_1.basketService.GETbasketService(req.body.userID.userID);
        // 1. 요청 바디 부족
        if (resData === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        // 2. 식료품 펀딩 기간이 아님
        else if (resData === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "식료품 펀딩 기간이 아닙니다");
        }
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, true, "장바구니 조회 성공", resData);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
/**
 *  @장바구니_결제하기
 *  @route POST /api/v1/basket
 *  @error
 *      1. 요청 바디 부족
 *      2. 식료품 펀딩 기간이 아님
 *      3. 현재 주문중인 상품이 없음
 */
const POSTbasketController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resData = yield service_1.basketService.POSTbasketService(req.body.userID.userID);
        // 1. 요청 바디 부족
        if (resData === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        // 2. 식료품 펀딩 기간이 아님
        else if (resData === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "식료품 펀딩 기간이 아닙니다");
        }
        // 3. 현재 주문중인 상품이 없음
        else if (resData === -3) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "장바구니에 물건이 없습니다");
        }
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, true, "장바구니 결제 성공", resData);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
const basketController = {
    GETbasketController,
    POSTbasketController,
};
exports.default = basketController;
//# sourceMappingURL=basketController.js.map