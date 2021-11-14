// models
import { User, AuthenticationCode } from "../models";
// DTO
import { authDTO } from "../DTO";
// library
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { emailSender } from "../library";
import ejs from "ejs";
import sequelize from "sequelize";
import nanoid from "nanoid";

/**
 *  @이메일_인증번호_전송
 *  @route Post /api/v1/auth/email
 *  @body email
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 가입한 email
 *      3. 이메일 전송 실패
 */
const POSTemailService = async (body: authDTO.POSTemailReqDTO) => {
  const { email } = body;

  // 1. 요청 바디 부족
  if (!email) {
    return -1;
  }

  // 2. 이미 가입한 email
  const emailUser = await User.findOne({ where: { email, isDeleted: false } });
  if (emailUser) {
    return -2;
  }

  // 인증번호를 user에 저장 -> 제한 시간 설정하기!
  const code = nanoid.nanoid(6);

  let emailTemplate: string;
  ejs.renderFile(
    "src/library/emailTemplate.ejs",
    { AuthenticationCode: code },
    (err, data) => {
      if (err) {
        console.log(err);
      }
      emailTemplate = data;
    }
  );

  const mailOptions = {
    front: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Moov:E 이메일 인증코드 입니다.",
    text: "Moov:E 이메일 인증코드 입니다.",
    html: emailTemplate,
  };

  emailSender.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return -3;
    } else {
      console.log("success");
    }
    emailSender.close();
  });

  const codeEmail = await AuthenticationCode.findOne({
    where: { email, isDeleted: false },
  });

  // 이미 code 존재한다면, 기존의 code isDeleted=true로 만들어 비활성화
  if (codeEmail) {
    await AuthenticationCode.update(
      { isDeleted: true },
      { where: { id: codeEmail.id } }
    );
  }

  await AuthenticationCode.create({ email, code });

  const resData: authDTO.POSTemailResDTO = { code };
  return resData;
};

/**
 *  @인증번호_인증
 *  @route Post /api/v1/auth/code
 *  @body email, code
 *  @error
 *      1. 요청 바디 부족
 *      2. 인증 시도 하지 않은 이메일
 *      3. 인증번호 인증 실패
 */

export async function POSTcodeService(body: authDTO.POSTcodeReqDTO) {
  const { email, code } = body;

  // 1. 요청 바디 부족
  if (!email || !code) {
    return -1;
  }

  const emailCode = await AuthenticationCode.findOne({
    where: { email, isDeleted: false },
  });

  // 2. 인증 시도 하지 않은 이메일
  if (!emailCode) {
    return -2;
  }

  // 3. 인증번호 인증 실패
  else if (code !== emailCode.code) {
    return -3;
  }

  // 4. 이미 가입한 email
  const emailUser = await User.findOne({ where: { email, isDeleted: false } });
  if (emailUser) {
    return -4;
  }

  // 인증번호 일치
  return undefined;
}

/**
 *  @회원가입
 *  @route Post /api/v1/auth/signup
 *  @body university, major, email, name, nickname, phone, password
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 가입한 이메일
 */

const POSTsignupService = async (data: authDTO.POSTsignupReqDTO) => {
  const { university, major, email, name, nickname, phone, password } = data;

  // 1. 요청 바디 부족
  if (
    !university ||
    !major ||
    !email ||
    !name ||
    !nickname ||
    !phone ||
    !password
  ) {
    return -1;
  }
  // 2. 이미 가입한 email - isDeleted:false
  const emailUser = await User.findOne({ where: { email, isDeleted: false } });
  if (emailUser) {
    return -2;
  }

  // password 암호화
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    name,
    password: hashPassword,
    nickname,
    university,
    major,
    phone,
  });

  await AuthenticationCode.update({ isDeleted: true }, { where: { email } });
  // Return jsonwebtoken
  const payload = {
    user: {
      userID: user.id,
    },
  };

  // access 토큰 발급
  // 유효기간 14일
  let token = jwt.sign(payload, config.jwtSecret, { expiresIn: "14d" });

  return { token };
};

/**
 *  @로그인
 *  @route Post /api/v1/auth/siginin
 *  @body email,password
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디가 존재하지 않음
 *      3. 패스워드가 올바르지 않음
 */

async function POSTsigninService(reqData: authDTO.POSTsigninReqDTO) {
  const { email, password } = reqData;

  // 1. 요청 바디 부족
  if (!email || !password) {
    return -1;
  }
  console.log(email);
  // 2. email이 DB에 존재하지 않음
  const user = await User.findOne({
    where: { email, isDeleted: false },
  });
  if (!user) {
    return -2;
  }

  // 3. password가 올바르지 않음
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return -3;
  }

  await user.save();

  const payload = {
    user: {
      userID: user.id,
    },
  };

  // access 토큰 발급
  // 유효기간 14일
  let token = jwt.sign(payload, config.jwtSecret, { expiresIn: "14d" });

  const resData: authDTO.POSTsigninResDTO = {
    userID: user.id,
    nickname: user.nickname,
    university: user.university,
  };

  return { resData, token };
}

/**
 *  @닉네임_중복_검사
 *  @route POST /api/v1/auth/nickname
 *  @body nickname
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 존재하는 email
 */

export async function POSTnicknameService(body: authDTO.POSTnicknameReqDTO) {
  const { nickname } = body;

  // 1. 요청 바디 부족
  if (!nickname) {
    return -1;
  }

  // 2. 이미 존재하는 닉네임
  const nicknameUser = await User.findOne({
    where: { nickname, isDeleted: false },
  });
  if (nicknameUser) {
    return -2;
  }

  // 닉네임 사용가능
  return undefined;
}

const authService = {
  POSTemailService,
  POSTcodeService,
  POSTsignupService,
  POSTnicknameService,
  POSTsigninService,
};

export default authService;
