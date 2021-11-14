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
 *  @장바구니_정보_불러오기
 *  @route GET /api/v1/basket
 *  @error
 *      1. 요청 바디 부족
 *      2. 식료품 펀딩 기간이 아님
 *      2. 현재 주문중인 상품이 없음
 */
const GETbasketService = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 요청 바디 부족
    if (!userID)
        return -1;
    const user = yield models_1.User.findOne({ where: { id: userID, isDeleted: false } });
    //현재 진행중인 generation
    const dateNow = new Date();
    const currentGeneration = yield models_1.FundGen.findOne({
        where: {
            university: user.university,
            isDeleted: false,
            [sequelize_1.default.Op.and]: {
                startTime: { [sequelize_1.default.Op.lte]: dateNow },
                endTime: { [sequelize_1.default.Op.gte]: dateNow },
            },
        },
    });
    // 2. 식료품 펀딩 기간이 아님
    if (!currentGeneration)
        return -2;
    const order = yield models_1.Order.findOne({
        where: { fundGenID: currentGeneration.id, userID, isDeleted: false },
        include: [
            {
                model: models_1.OrderDetail,
                where: { state: 0 },
                include: [
                    {
                        model: models_1.GenGoods,
                        include: [
                            {
                                model: models_1.Goods,
                            },
                        ],
                    },
                ],
            },
        ],
    });
    const goods = order.orderDetails.map((goods) => {
        return {
            genGoodsID: goods.genGoodsID,
            orderDetailID: goods.id,
            name: goods.genGoods.goods.name,
            price: goods.genGoods.goods.price,
            min: goods.genGoods.goods.min,
            unit: goods.genGoods.goods.unit,
            count: goods.count,
            desc: goods.genGoods.goods.desc,
            photo: goods.genGoods.goods.photo,
            completeNum: goods.genGoods.goods.completeNum,
            degree: goods.degree,
        };
    });
    return goods;
});
/**
 *  @장바구니_결제하기
 *  @route POST /api/v1/basket
 *  @error
 *      1. 요청 바디 부족
 *      2. 식료품 펀딩 기간이 아님
 *      3. 현재 주문중인 상품이 없음
 */
const POSTbasketService = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 요청 바디 부족
    if (!userID)
        return -1;
    const user = yield models_1.User.findOne({ where: { id: userID, isDeleted: false } });
    //현재 진행중인 generation
    const dateNow = new Date();
    const currentGeneration = yield models_1.FundGen.findOne({
        where: {
            university: user.university,
            isDeleted: false,
            [sequelize_1.default.Op.and]: {
                startTime: { [sequelize_1.default.Op.lte]: dateNow },
                endTime: { [sequelize_1.default.Op.gte]: dateNow },
            },
        },
    });
    // 2. 식료품 펀딩 기간이 아님
    if (!currentGeneration)
        return -2;
    const order = yield models_1.Order.findOne({
        where: { fundGenID: currentGeneration.id, userID, isDeleted: false },
        include: [
            {
                model: models_1.OrderDetail,
                where: { state: 0 },
            },
        ],
    });
    let orderDetailIDs = [];
    order.orderDetails.map((orderDetail) => {
        orderDetailIDs.push(orderDetail.id);
    });
    yield models_1.OrderDetail.update({ state: 1 }, { where: { id: { [sequelize_1.default.Op.in]: orderDetailIDs } } });
    return undefined;
});
const basketService = {
    GETbasketService,
    POSTbasketService,
};
exports.default = basketService;
//# sourceMappingURL=basketService.js.map