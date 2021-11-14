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
 *  @장바구니_정보_불러오기
 *  @route GET /api/v1/basket
 *  @error
 *      1. 요청 바디 부족
 *      2. 식료품 펀딩 기간이 아님
 *      3. 현재 주문중인 상품이 없음
 */
const GETbasketService = async (userID: number) => {
  // 1. 요청 바디 부족
  if (!userID) return -1;
  const user = await User.findOne({ where: { id: userID, isDeleted: false } });

  //현재 진행중인 generation
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
  // 2. 식료품 펀딩 기간이 아님
  if (!currentGeneration) return -2;

  const order = await Order.findOne({
    where: { fundGenID: currentGeneration.id, userID, isDeleted: false },
    include: [
      {
        model: OrderDetail,
        where: { state: 0 },
        include: [
          {
            model: GenGoods,
            include: [
              {
                model: Goods,
              },
            ],
          },
        ],
      },
    ],
  });
  //3. 현재 주문중인 상품이 없음
  if (!order) {
    return -3;
  }
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
};

/**
 *  @장바구니_결제하기
 *  @route POST /api/v1/basket
 *  @error
 *      1. 요청 바디 부족
 *      2. 식료품 펀딩 기간이 아님
 *      3. 현재 주문중인 상품이 없음
 */
const POSTbasketService = async (userID: number) => {
  // 1. 요청 바디 부족
  if (!userID) return -1;
  const user = await User.findOne({ where: { id: userID, isDeleted: false } });

  //현재 진행중인 generation
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

  // 2. 식료품 펀딩 기간이 아님
  if (!currentGeneration) return -2;

  const order = await Order.findOne({
    where: { fundGenID: currentGeneration.id, userID, isDeleted: false },
    include: [
      {
        model: OrderDetail,
        where: { state: 0 },
      },
    ],
  });
  let orderDetailIDs = [];
  order.orderDetails.map((orderDetail) => {
    orderDetailIDs.push(orderDetail.id);
  });
  await OrderDetail.update(
    { state: 1 },
    { where: { id: { [sequelize.Op.in]: orderDetailIDs } } }
  );

  return undefined;
};
const basketService = {
  GETbasketService,
  POSTbasketService,
};

export default basketService;
