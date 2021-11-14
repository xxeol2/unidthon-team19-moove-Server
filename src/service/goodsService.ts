// models
import { FundGen, User, Goods, GenGoods, OrderDetail, Order } from "../models";
// DTO
import { goodsDTO } from "../DTO";
// library
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import sequelize from "sequelize";
import nanoid from "nanoid";

/**
 *  @굿즈_리스트_불러오기
 *  @route GET /api/v1/goods
 *  @error
 *      1. 요청 바디 부족
 *      2. 현재 진행중인 굿즈 펀딩이 없음
 */

const GETgoodsService = async (userID: number) => {
  if (!userID) return -1;

  const user = await User.findOne({ where: { id: userID, isDeleted: false } });

  const university = user.university;

  const dateNow = new Date();
  const currentGeneration = await FundGen.findOne({
    where: {
      university,
      isDeleted: false,
      [sequelize.Op.and]: {
        startTime: { [sequelize.Op.lte]: dateNow },
        endTime: { [sequelize.Op.gte]: dateNow },
      },
    },
  });

  // 2. 현재 진행중인 굿즈 펀딩이 없음
  if (!currentGeneration) return -2;

  const genGoods = await GenGoods.findAll({
    where: {
      fundGenID: currentGeneration.id,
      isDeleted: false,
      isConfirmed: false,
    },
    include: [
      {
        model: Goods,
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

  const goods: goodsDTO.goodsInfo[] = genGoods.map((goods) => {
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
  const resData: goodsDTO.GETgoodsResDTO = { goods };
  return resData;
};

/**
 *  @굿즈_Detail_불러오기
 *  @route GET /api/v1/goods/:genGoodsID
 *  @error
 *      1. 요청 바디 부족
 *      2. 잘못된 genGoodsID
 *      3. 권한 없음 (유저 학교의 펀딩글이 아님)
 */

const GETgoodsDetailService = async (userID: number, genGoodsID: number) => {
  // 1. 요청 바디 부족
  if (!userID || !genGoodsID) return -1;

  const user = await User.findOne({ where: { id: userID, isDeleted: false } });

  const university = user.university;

  const goods = await GenGoods.findOne({
    where: {
      id: genGoodsID,
      isDeleted: false,
      isConfirmed: false,
    },
    include: [
      {
        model: Goods,
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
        model: FundGen,
        where: { isDeleted: false },
        attributes: ["university"],
      },
    ],
    attributes: ["count", "degree", "id"],
  });

  // 2. 잘못된 genGoodsID
  if (!goods) return -2;

  // 3. 권한 없음 (유저 학교의 펀딩글이 아님)
  if (goods.fundGen.university !== user.university) return -3;

  const resData: goodsDTO.goodsInfo = {
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
};

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

export const POSTgoodsService = async (
  genGoodsID: number,
  orderingNum: number,
  userID: number
) => {
  // 1. 요청 바디 부족
  if (!genGoodsID || !orderingNum || !userID) return -1;

  const user = await User.findOne({ where: { id: userID, isDeleted: false } });
  if (!user) return -1;

  const genGoods = await GenGoods.findOne({
    where: { id: genGoodsID, isDeleted: false },
    include: [
      {
        model: Goods,
        attributes: ["completeNum", "id"],
      },
    ],
  });

  // 2. 잘못된 genGoodsID
  if (!genGoods) return -2;

  // 3. 마감된 펀딩
  if (genGoods.isConfirmed) return -3;

  const dateNow = new Date();
  const currentGeneration = await FundGen.findOne({
    where: {
      university: user.university,
      isDeleted: false,
      [sequelize.Op.and]: {
        startTime: { [sequelize.Op.lte]: dateNow },
        endTime: { [sequelize.Op.gte]: dateNow },
      },
    },
  });
  // 4. 현재 펀딩 기간이 아님
  if (currentGeneration.id !== genGoods.fundGenID) return -5;

  const remaining = genGoods.goods.completeNum - genGoods.count;

  // 5. 남은 수량 < 주문 수량
  if (remaining < orderingNum) {
    return -4;
  }

  const currentCount = genGoods.count + orderingNum;

  if (currentCount === genGoods.goods.completeNum) {
    await GenGoods.update(
      { count: currentCount, isConfirmed: true },
      { where: { id: genGoodsID } }
    );
    await GenGoods.create({
      id: genGoodsID,
      fundGenID: genGoods.fundGenID,
      goodsID: genGoods.goods.id,
      degree: genGoods.degree + 1,
      count: 0,
    });
  } else {
    await GenGoods.update(
      { count: currentCount },
      { where: { id: genGoodsID } }
    );
  }
  let userOrder = await Order.findOne({
    where: { userID, fundGenID: genGoods.fundGenID, isDeleted: false },
  });
  if (!userOrder) {
    userOrder = await Order.create({ userID, fundGenID: genGoods.fundGenID });
  }

  let userOrderDetail = await OrderDetail.findOne({
    where: {
      orderID: userOrder.id,
      genGoodsID: genGoods.id,
    },
  });

  if (!userOrderDetail) {
    await OrderDetail.create({
      orderID: userOrder.id,
      genGoodsID: genGoods.id,
      count: orderingNum,
      degree: genGoods.degree,
      state: 0,
    });
    userOrder.save();
  } else {
    userOrderDetail.update(
      { count: orderingNum + userOrderDetail.count },
      { where: { id: userOrderDetail.id } }
    );
    userOrder.save();
  }
  return undefined;
};

const goodsService = {
  GETgoodsService,
  GETgoodsDetailService,
  POSTgoodsService,
};

export default goodsService;
