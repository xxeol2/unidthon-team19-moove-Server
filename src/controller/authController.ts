import { Request, Response } from "express";
import { validationResult } from "express-validator";
// libraries
import { response, returnCode } from "../library";
// services
import { authService } from "../service";
//DTO
import { authDTO } from "../DTO";

/**
 *  @이메일_인증번호_전송
 *  @route Post /api/v1/auth/email
 *  @desc post email code for certification
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 가입한 email
 *      3. 이메일 전송 실패
 */

const POSTemailController = async (req: Request, res: Response) => {
  // 이메일 형식이 잘못된 경우
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.basicResponse(
      res,
      returnCode.BAD_REQUEST,
      false,
      "요청 값이 올바르지 않습니다."
    );
  }

  try {
    const reqData: authDTO.POSTemailReqDTO = req.body;
    const resData: authDTO.POSTemailResDTO | number =
      await authService.POSTemailService(reqData);

    // 요청 바디가 부족할 경우
    if (resData === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "요청 값이 올바르지 않습니다."
      );
    }
    // 2. 이미 가입한 email
    else if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "이미 가입된 이메일 입니다"
      );
    }
    //이메일 전송이 실패한 경우
    else if (resData === -3) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "이메일 전송을 실패했습니다"
      );
    }
    //성공
    else {
      response.dataResponse(
        res,
        returnCode.CREATED,
        true,
        "인증번호 전송 성공",
        resData
      );
    }
  } catch (err) {
    console.error(err.message);
    response.basicResponse(
      res,
      returnCode.INTERNAL_SERVER_ERROR,
      false,
      "서버 오류"
    );
  }
};

/**
 *  @인증번호_인증
 *  @route Post /api/v1/auth/code
 *  @body email, code
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 *      2. 인증 시도 하지 않은 이메일
 *      3. 인증번호 인증 실패
 */

const POSTcodeController = async (req: Request, res: Response) => {
  // 이메일 형식이 잘못된 경우
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.basicResponse(
      res,
      returnCode.BAD_REQUEST,
      false,
      "요청 값이 올바르지 않습니다."
    );
  }

  try {
    const reqData: authDTO.POSTcodeReqDTO = req.body;
    const resData: undefined | -1 | -2 | -3 | -4 =
      await authService.POSTcodeService(reqData);

    // 1. 요청 바디가 부족할 경우
    if (resData === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "요청 값이 올바르지 않습니다"
      );
    }
    // 2. email이 DB에 없을 경우
    else if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "인증 시도 하지 않은 이메일입니다"
      );
    }
    // 인증번호가 올바르지 않은 경우
    else if (resData === -3) {
      response.dataResponse(res, returnCode.OK, false, "인증번호 인증 실패", {
        isOkay: false,
      });
    } else if (resData === -4) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "이미 가입된 이메일입니다"
      );
    }
    // 인증번호 인증 성공
    else {
      response.dataResponse(res, returnCode.OK, "인증번호 인증 성공", true, {
        isOkay: true,
      });
    }
  } catch (err) {
    console.error(err.message);
    response.basicResponse(
      res,
      returnCode.INTERNAL_SERVER_ERROR,
      false,
      "서버 오류"
    );
  }
};

/**
 *  @회원가입
 *  @route Post /api/v1/auth/signup
 *  @body email,password, nickname, university
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 */

const POSTsignupController = async (req: Request, res: Response) => {
  // 이메일 형식이 잘못된 경우
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.basicResponse(
      res,
      returnCode.BAD_REQUEST,
      false,
      "요청 값이 올바르지 않습니다"
    );
  }

  try {
    const reqData: authDTO.POSTsignupReqDTO = req.body;
    const data = await authService.POSTsignupService(reqData);

    // 요청 바디가 부족할 경우
    if (data === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "요청 값이 올바르지 않습니다"
      );
    } else if (data === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "이미 가입된 이메일입니다."
      );
    }

    // 회원가입 성공
    else {
      const { token } = data;
      response.tokenResponse(
        res,
        returnCode.CREATED,
        true,
        "회원가입 성공",
        token
      );
    }
  } catch (err) {
    // console.log(err);
    console.error(err.message);
    response.basicResponse(
      res,
      returnCode.INTERNAL_SERVER_ERROR,
      false,
      "서버 오류"
    );
  }
};

/**
 *  @닉네임_중복_검사
 *  @route POST /api/v1/auth/nickname
 *  @body email, code
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 존재하는 email
 */

const POSTnicknameController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.basicResponse(
      res,
      returnCode.BAD_REQUEST,
      false,
      "요청 값이 올바르지 않습니다."
    );
  }

  try {
    const reqData: authDTO.POSTnicknameReqDTO = req.body;
    const resData: undefined | -1 | -2 = await authService.POSTnicknameService(
      reqData
    );

    // 1. 요청 바디가 부족할 경우
    if (resData === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "요청 값이 올바르지 않습니다"
      );
    }
    // 2. 이미 존재하는 email
    else if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "이미 존재하는 닉네임입니다"
      );
    }
    // 닉네임 사용 가능
    else {
      response.dataResponse(res, returnCode.OK, true, "닉네임 사용 가능", {
        isOkay: true,
      });
    }
  } catch (err) {
    console.error(err.message);
    response.basicResponse(
      res,
      returnCode.INTERNAL_SERVER_ERROR,
      false,
      "서버 오류"
    );
  }
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
const POSTsigninController = async (req: Request, res: Response) => {
  // 이메일 형식이 잘못된 경우
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.basicResponse(
      res,
      returnCode.BAD_REQUEST,
      false,
      "요청 값이 올바르지 않습니다"
    );
  }

  try {
    const reqData: authDTO.POSTsigninReqDTO = req.body;
    const data = await authService.POSTsigninService(reqData);

    // 1. 요청 바디 부족
    if (data === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "요청 값이 올바르지 않습니다"
      );
    }
    // 2. 아이디가 존재하지 않음
    else if (data === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "아이디가 존재하지 않습니다"
      );
    }
    // 3. 패스워드가 올바르지 않음
    else if (data === -3) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "비밀번호가 틀렸습니다"
      );
    }
    // 로그인 성공
    else {
      const { resData, token } = data;
      response.dataTokenResponse(
        res,
        returnCode.OK,
        true,
        "로그인 성공",
        resData,
        token
      );
    }
  } catch (err) {
    console.error(err.message);
    response.basicResponse(
      res,
      returnCode.INTERNAL_SERVER_ERROR,
      false,
      "서버 오류"
    );
  }
};

const authController = {
  POSTemailController,
  POSTcodeController,
  POSTsignupController,
  POSTnicknameController,
  POSTsigninController,
};

export default authController;
