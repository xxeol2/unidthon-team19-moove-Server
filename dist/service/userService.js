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
// models
const models_1 = require("../models");
const sequelize_1 = __importDefault(require("sequelize"));
/**
 *  @유저_프로필_조회
 *  @route GET /api/v1/user
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 정보 없음
 */
const GETuserService = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userID)
        return -1;
    const user = yield models_1.User.findOne({ where: { id: userID, isDeleted: false } });
    if (!user)
        return -2;
    const resData = { nickname: user.nickname };
    return resData;
});
/**
 *  @유저_배송_조회
 *  @route GET /api/v1/user/shop
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 정보 없음
 */
const GETshopService = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userID)
        return -1;
    const user = yield models_1.User.findOne({ where: { id: userID, isDeleted: false } });
    if (!user)
        return -2;
    yield models_1.Order.findAll({
        where: { id: userID },
        include: [
            {
                model: models_1.OrderDetail,
                required: true,
                where: { isDeleted: false, state: { [sequelize_1.default.Op.ne]: 4 } },
                attributes: ["state"],
                include: [
                    {
                        model: models_1.GenGoods,
                    },
                ],
            },
        ],
    });
    const pickUp = yield models_1.PickUp.findAll({ where: { userID } });
    const resData = { nickname: user.nickname };
    return resData;
});
/**
 *  @유저_수령_인증사진_첨부
 *  @route POST /user/photo/:orderID
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 정보 없음
 *      3. 주문 정보 없음
 */
const POSTphotoService = (userID, orderID, url) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 요청 바디 부족
    if (!userID || !url || !orderID)
        return -1;
    const user = yield models_1.User.findOne({ where: { id: userID, isDeleted: false } });
    //2. 유저 정보 없음
    if (!user)
        return -2;
    const order = yield models_1.Order.findOne({
        where: { id: orderID, isDeleted: false },
    });
    //3. 주문 정보 없음
    if (!order)
        return -3;
    yield models_1.Order.update({ photo: url.photo }, { where: { id: order.id } });
    yield models_1.OrderDetail.update({ state: 4 }, { where: { orderID } });
    const resData = url;
    return resData;
});
const userService = {
    GETuserService,
    POSTphotoService,
};
exports.default = userService;
//# sourceMappingURL=userService.js.map