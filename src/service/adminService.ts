// models
import { User, Staff, FundGen, GenManage } from "../models";
import dotenv from "dotenv";
// DTO
import { adminDTO } from "../DTO";
// library
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { emailSender } from "../library";
import ejs from "ejs";
import sequelize from "sequelize";
import nanoid from "nanoid";

/**
 *  @staff_FundingGeneration_배정
 *  @route POST /api/v1/admin/:staffID/:fundGenID
 *  @error
 *      1. 요청 바디 부족
 *      2. 잘못된 adminkey
 *      3. 잘못된 fundGenID
 *      4. 잘못된 staffID
 */

export const POSTadminService = async (
  staffID: number,
  fundGenID: number,
  adminkey: string
) => {
  // 1. 요청 바디 부족
  if (!staffID || !fundGenID || !adminkey) return -1;

  if (adminkey !== process.env.ADMIN_KEY) {
    return -2;
  }
  //   return -2;
  const fundGen = await FundGen.findOne({
    where: { id: fundGenID, isDeleted: false },
    attributes: ["university", "id"],
  });

  // 3. 잘못된 fundGenID
  if (!fundGen) return -3;

  // 4. 잘못된 staffID
  const staff = await Staff.findOne({
    where: { id: staffID, isDeleted: false },
  });
  if (!staff) return -4;

  const key = String(Math.floor(100000 + Math.random() * 900000));
  await GenManage.create({
    staffID,
    fundGenID,
    key,
    isDone: false,
  });

  const resData: adminDTO.POSTadminResDTO = {
    key,
  };

  return resData;
};

/**
 *  @admin_token_발급
 *  @route POST /api/v1/admin/token
 *  @error
 *      1. 요청 바디 부족
 *      1. 잘못된 admin key
 */
export const POSTadminTokenService = async (adminkey: string) => {
  // 1. 요청 바디 부족
  if (!adminkey) return -1;

  if (adminkey !== process.env.ADMIN_KEY) return -2;

  // Return jsonwebtoken
  const payload = {
    admin: {
      key: adminkey,
    },
  };

  // access 토큰 발급
  // 유효기간 14일
  let token = jwt.sign(payload, config.jwtSecret, { expiresIn: "14d" });
  return { token };
};

const adminService = {
  POSTadminService,
  POSTadminTokenService,
};

export default adminService;
