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
 *  @굿즈_리스트_불러오기
 *  @route GET /api/v1/goods
 *  @error
 *      1. 요청 바디 부족
 *      2. 현재 진행중인 굿즈 펀딩이 없음
 */
const GETgoodsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resData = yield service_1.goodsService.GETgoodsService(req.body.userID.userID);
        // 1. 요청 바디 부족
        if (resData === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        // 2. 현재 진행중인 굿즈 펀딩이 없음
        else if (resData === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "현재 진행중인 식료품 펀딩이 없습니다");
        }
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, true, "굿즈 리스트 불러오기 성공", resData);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
/**
 *  @굿즈_Detail_불러오기
 *  @route GET /api/v1/goods/:genGoodsID
 *  @error
 *      1. 요청 바디 부족
 *      2. 잘못된 genGoodsID
 *      3. 권한 없음 (유저 학교의 펀딩글이 아님)
 */
const GETgoodsDetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resData = yield service_1.goodsService.GETgoodsDetailService(req.body.userID.userID, Number(req.params.genGoodsID));
        // 1. 요청 바디 부족
        if (resData === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        else if (resData === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "잘못된 id값입니다");
        }
        // 3. 권한 없음 (유저 학교의 펀딩글이 아님)
        else if (resData === -3) {
            library_1.response.basicResponse(res, library_1.returnCode.FORBIDDEN, false, "해당 펀딩 글을 볼 권한이 없습니다");
        }
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, true, "굿즈 Detail 불러오기 성공", resData);
        }
    }
    catch (err) {
        console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
/**
 *  @장바구니_담기
 *  @route POST /api/v1/goods/:genGoodsID/:orderingNum
 *  @error
 *      1. 요청 바디 부족
 *      2. 잘못된 genGoodsID
 *      3. 마감된 펀딩
 *      4. 현재 펀딩 기간이 아님
 *      5. 남은 수량 < 주문 수량
 */
const POSTgoodsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resData = yield service_1.goodsService.POSTgoodsService(Number(req.params.genGoodsID), Number(req.params.orderingNum), req.body.userID.userID);
        // 1. 요청 바디 부족
        if (resData === -1) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "요청 값이 올바르지 않습니다");
        }
        else if (resData === -2) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "잘못된 id값입니다");
        }
        // 3. 마감된 펀딩
        else if (resData === -3) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "마감된 펀딩입니다. open된 다음 차수를 이용해주세요");
        }
        // 4. 현재 펀딩 기간이 아님
        else if (resData === -4) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "현재 펀딩 기간이 아닙니다");
        }
        // 5. 남은 수량 < 주문 수량
        else if (resData === -5) {
            library_1.response.basicResponse(res, library_1.returnCode.BAD_REQUEST, false, "주문 불가능한 수량입니다");
        }
        else {
            library_1.response.dataResponse(res, library_1.returnCode.OK, true, "장바구니 담기 성공", resData);
        }
    }
    catch (err) {
        console.log(err);
        // console.error(err.message);
        library_1.response.basicResponse(res, library_1.returnCode.INTERNAL_SERVER_ERROR, false, "서버 오류");
    }
});
const goodsController = {
    GETgoodsController,
    GETgoodsDetailController,
    POSTgoodsController,
};
exports.default = goodsController;
//# sourceMappingURL=goodsController.js.map