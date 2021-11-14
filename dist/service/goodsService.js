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
exports.POSTgoodsService = void 0;
// models
const models_1 = require("../models");
const sequelize_1 = __importDefault(require("sequelize"));
/**
 *  @굿즈_리스트_불러오기
 *  @route GET /api/v1/goods
 *  @error
 *      1. 요청 바디 부족
 *      2. 현재 진행중인 굿즈 펀딩이 없음
 */
const GETgoodsService = (userID) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userID)
        return -1;
    const user = yield models_1.User.findOne({ where: { id: userID, isDeleted: false } });
    const university = user.university;
    const dateNow = new Date();
    const currentGeneration = yield models_1.FundGen.findOne({
        where: {
            university,
            isDeleted: false,
            [sequelize_1.default.Op.and]: {
                startTime: { [sequelize_1.default.Op.lte]: dateNow },
                endTime: { [sequelize_1.default.Op.gte]: dateNow },
            },
        },
    });
    // 2. 현재 진행중인 굿즈 펀딩이 없음
    if (!currentGeneration)
        return -2;
    const genGoods = yield models_1.GenGoods.findAll({
        where: {
            fundGenID: currentGeneration.id,
            isDeleted: false,
            isConfirmed: false,
        },
        include: [
            {
                model: models_1.Goods,
                attributes: [
                    "name",
                    "min",
                    "price",
                    "unit",
                    "completeNum",
                    "desc",
                    "photo",
                ],
                where: { isDeleted: false },
            },
        ],
        attributes: ["count", "degree", "id"],
    });
    const goods = genGoods.map((goods) => {
        return {
            genGoodsID: goods.id,
            name: goods.goods.name,
            price: goods.goods.price,
            min: goods.goods.min,
            unit: goods.goods.unit,
            count: goods.count,
            desc: goods.goods.desc,
            photo: goods.goods.photo,
            completeNum: goods.goods.completeNum,
            degree: goods.degree,
        };
    });
    const resData = { goods };
    return resData;
});
/**
 *  @굿즈_Detail_불러오기
 *  @route GET /api/v1/goods/:genGoodsID
 *  @error
 *      1. 요청 바디 부족
 *      2. 잘못된 genGoodsID
 *      3. 권한 없음 (유저 학교의 펀딩글이 아님)
 */
const GETgoodsDetailService = (userID, genGoodsID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 요청 바디 부족
    if (!userID || !genGoodsID)
        return -1;
    const user = yield models_1.User.findOne({ where: { id: userID, isDeleted: false } });
    const university = user.university;
    const goods = yield models_1.GenGoods.findOne({
        where: {
            id: genGoodsID,
            isDeleted: false,
            isConfirmed: false,
        },
        include: [
            {
                model: models_1.Goods,
                attributes: [
                    "name",
                    "min",
                    "price",
                    "unit",
                    "completeNum",
                    "desc",
                    "photo",
                ],
                where: { isDeleted: false },
            },
            {
                model: models_1.FundGen,
                where: { isDeleted: false },
                attributes: ["university"],
            },
        ],
        attributes: ["count", "degree", "id"],
    });
    // 2. 잘못된 genGoodsID
    if (!goods)
        return -2;
    // 3. 권한 없음 (유저 학교의 펀딩글이 아님)
    if (goods.fundGen.university !== user.university)
        return -3;
    const resData = {
        genGoodsID,
        name: goods.goods.name,
        price: goods.goods.price,
        min: goods.goods.min,
        unit: goods.goods.unit,
        count: goods.count,
        desc: goods.goods.desc,
        photo: goods.goods.photo,
        completeNum: goods.goods.completeNum,
        degree: goods.degree,
    };
    return resData;
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
const POSTgoodsService = (genGoodsID, orderingNum, userID) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 요청 바디 부족
    if (!genGoodsID || !orderingNum || !userID)
        return -1;
    const user = yield models_1.User.findOne({ where: { id: userID, isDeleted: false } });
    if (!user)
        return -1;
    const genGoods = yield models_1.GenGoods.findOne({
        where: { id: genGoodsID, isDeleted: false },
        include: [
            {
                model: models_1.Goods,
                attributes: ["completeNum", "id"],
            },
        ],
    });
    // 2. 잘못된 genGoodsID
    if (!genGoods)
        return -2;
    // 3. 마감된 펀딩
    if (genGoods.isConfirmed)
        return -3;
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
    // 4. 현재 펀딩 기간이 아님
    if (currentGeneration.id !== genGoods.fundGenID)
        return -5;
    const remaining = genGoods.goods.completeNum - genGoods.count;
    // 5. 남은 수량 < 주문 수량
    if (remaining < orderingNum) {
        return -4;
    }
    const currentCount = genGoods.count + orderingNum;
    if (currentCount === genGoods.goods.completeNum) {
        yield models_1.GenGoods.update({ count: currentCount, isConfirmed: true }, { where: { id: genGoodsID } });
        yield models_1.GenGoods.create({
            id: genGoodsID,
            fundGenID: genGoods.fundGenID,
            goodsID: genGoods.goods.id,
            degree: genGoods.degree + 1,
            count: 0,
        });
    }
    else {
        yield models_1.GenGoods.update({ count: currentCount }, { where: { id: genGoodsID } });
    }
    let userOrder = yield models_1.Order.findOne({
        where: { userID, fundGenID: genGoods.fundGenID, isDeleted: false },
    });
    if (!userOrder) {
        userOrder = yield models_1.Order.create({ userID, fundGenID: genGoods.fundGenID });
    }
    let userOrderDetail = yield models_1.OrderDetail.findOne({
        where: {
            orderID: userOrder.id,
            genGoodsID: genGoods.id,
        },
    });
    if (!userOrderDetail) {
        yield models_1.OrderDetail.create({
            orderID: userOrder.id,
            genGoodsID: genGoods.id,
            count: orderingNum,
            degree: genGoods.degree,
            state: 0,
        });
        userOrder.save();
    }
    else {
        userOrderDetail.update({ count: orderingNum + userOrderDetail.count }, { where: { id: userOrderDetail.id } });
        userOrder.save();
    }
    return undefined;
});
exports.POSTgoodsService = POSTgoodsService;
const goodsService = {
    GETgoodsService,
    GETgoodsDetailService,
    POSTgoodsService: exports.POSTgoodsService,
};
exports.default = goodsService;
//# sourceMappingURL=goodsService.js.map