// models
import {
  Staff,
  AuthenticationCode,
  GenManage,
  FundGen,
  OrderDetail,
  GenGoods,
} from "../models";
// DTO
import { staffDTO } from "../DTO";
// library
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { emailSender } from "../library";
import ejs from "ejs";
import sequelize from "sequelize";
import nanoid from "nanoid";

/**
 *  @회원가입
 *  @route Post /api/v1/staff/signup
 *  @body email, password
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 가입한 이메일
 */

const POSTsignupService = async (data: staffDTO.POSTsignupReqDTO) => {
  const { email, password, name, phone, university } = data;

  // 1. 요청 바디 부족
  if (!email || !password) {
    return -1;
  }
  // 2. 이미 가입한 email - isDeleted:false
  const emailStaff = await Staff.findOne({
    where: { email, isDeleted: false },
  });
  if (emailStaff) {
    return -2;
  }

  // password 암호화
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newStaff = await Staff.create({
    email,
    name,
    password: hashPassword,
    phone,
    university,
  });

  // Return jsonwebtoken
  const payload = {
    staff: {
      id: newStaff.id,
    },
  };

  // access 토큰 발급
  // 유효기간 14일
  let token = jwt.sign(payload, config.jwtSecret, { expiresIn: "14d" });

  return { token };
};

/**
 *  @로그인
 *  @route Post /api/v1/staff/siginin
 *  @body email,password
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디가 존재하지 않음
 *      3. 패스워드가 올바르지 않음
 */

async function POSTsigninService(reqData: staffDTO.POSTsigninReqDTO) {
  const { email, password } = reqData;

  // 1. 요청 바디 부족
  if (!email || !password) {
    return -1;
  }

  // 2. email이 DB에 존재하지 않음
  const staff = await Staff.findOne({
    where: { email, isDeleted: false },
  });
  if (!staff) {
    return -2;
  }

  // 3. password가 올바르지 않음
  const isMatch = await bcrypt.compare(password, staff.password);

  if (!isMatch) {
    return -3;
  }

  await staff.save();

  const payload = {
    staff: {
      id: staff.id,
    },
  };

  // access 토큰 발급
  // 유효기간 14일
  let token = jwt.sign(payload, config.jwtSecret, { expiresIn: "14d" });

  const resData: staffDTO.POSTsigninResDTO = {
    staffID: staff.id,
    university: staff.university,
  };

  return { resData, token };
}

/**
 *  @수행_완료_인증사진_첨부
 *  @route Post /api/v1/staff/:fundGenID
 *  @body file(form-data-file)
 *  @error
 *      1. 요청 바디 부족
 *      2. staff id 잘못됨
 *      3, fundGenID가 잘못됨
 *      4. 해당 staff에게 권한이 없을 때
 */

const POSTphotoService = async (
  staffID: number,
  fundGenID: number,
  url: any
) => {
  // 1. 요청 바디 부족
  if (!url) return -1;
  const staff = await Staff.findOne({
    where: { id: staffID, isDeleted: false },
  });

  // 2. staff id 잘못됨
  if (!staff) return -2;

  const fundGen = await FundGen.findOne({
    where: { id: fundGenID, isDeleted: false },
  });

  // 3. fundGenID가 잘못됨
  if (!fundGen) return -3;

  // 4. 해당 staff에게 권한이 없을 때
  const genManage = await GenManage.findOne({
    where: { staffID, fundGenID, isDeleted: false },
  });
  if (!genManage) return -3;

  await GenManage.update(
    { photo: url.imgThumbnail },
    { where: { id: genManage.id } }
  );
  staff.save();

  const genGoods = await GenGoods.findAll({
    where: {
      fundGenID: genManage.fundGenID,
      isConfirmed: true,
      isDeleted: false,
    },
  });

  const genGoodsIDs = genGoods.map((gengoods) => {
    return gengoods.id;
  });

  await OrderDetail.update(
    { state: 3 },
    { where: { genGoodsID: { [sequelize.Op.in]: genGoodsIDs } } }
  );

  return undefined;
};

const staffService = {
  POSTsignupService,
  POSTsigninService,
  POSTphotoService,
};

export default staffService;
