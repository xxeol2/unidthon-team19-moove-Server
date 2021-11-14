// models
import {
  FundGen,
  User,
  Goods,
  GenGoods,
  OrderDetail,
  Order,
  PickUp,
} from "../models";
// DTO
import { userDTO } from "../DTO";
// library
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import sequelize from "sequelize";
import nanoid from "nanoid";

/**
 *  @유저_프로필_조회
 *  @route GET /api/v1/user
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 정보 없음
 */

const GETuserService = async (userID: number) => {
  if (!userID) return -1;

  const user = await User.findOne({ where: { id: userID, isDeleted: false } });
  if (!user) return -2;

  const resData: userDTO.GETuserResDTO = { nickname: user.nickname };
  return resData;
};


/**
 *  @유저_배송_조회
 *  @route GET /api/v1/user/shop
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 정보 없음
 */

const GETshopService = async (userID: number) => {
  if (!userID) return -1;

  const user = await User.findOne({ where: { id: userID, isDeleted: false } });
  if (!user) return -2;

  await Order.findAll({
    where: { id: userID },
    include: [
      {
        model: OrderDetail,
        required: true,
        where: { isDeleted: false, state: { [sequelize.Op.ne]: 4 } },
        attributes: ["state"],
        include: [
          {
            model: GenGoods,
          },
        ],
      },
    ],
  });

  const pickUp = await PickUp.findAll({ where: { userID } });

  const resData: userDTO.GETuserResDTO = { nickname: user.nickname };
  return resData;
};

/**
 *  @유저_수령_인증사진_첨부
 *  @route POST /user/photo/:orderID
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 정보 없음
 *      3. 주문 정보 없음
 */

const POSTphotoService = async (userID: number, orderID: number, url: any) => {
  // 1. 요청 바디 부족
  if (!userID || !url || !orderID) return -1;

  const user = await User.findOne({ where: { id: userID, isDeleted: false } });

  //2. 유저 정보 없음
  if (!user) return -2;

  const order = await Order.findOne({
    where: { id: orderID, isDeleted: false },
  });

  //3. 주문 정보 없음
  if (!order) return -3;
  await Order.update({ photo: url.photo }, { where: { id: order.id } });
  await OrderDetail.update({ state: 4 }, { where: { orderID } });

  const resData = url;
  return resData;
};

const userService = {

  GETuserService,
  POSTphotoService,
};

export default userService;
