import { Request, Response } from "express";
import { validationResult } from "express-validator";
// libraries
import { response, returnCode } from "../library";
// services
import { staffService } from "../service";
//DTO
import { staffDTO } from "../DTO";

/**
 *  @회원가입
 *  @route Post /api/v1/staff/signup
 *  @body email,password, name, phone, university
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
    const reqData: staffDTO.POSTsignupReqDTO = req.body;
    const data = await staffService.POSTsignupService(reqData);

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
        "staff 회원가입 성공",
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
 *  @로그인
 *  @route Post /api/v1/staff/siginin
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
    const reqData: staffDTO.POSTsigninReqDTO = req.body;
    const data = await staffService.POSTsigninService(reqData);

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
        "staff 로그인 성공",
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
const POSTphotoController = async (req: Request, res: Response) => {
  try {
    const url = {
      photo: (req as any).files.photo
        ? (req as any).files.photo[0].location
        : null,
    };

    const data = await staffService.POSTphotoService(
      req.body.staff.id,
      Number(req.params.fundGenID),
      url
    );

    // 1. 요청 바디 부족
    if (data === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "요청 값이 올바르지 않습니다"
      );
    }
    // 2. staff id 잘못됨
    else if (data === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "staff 아이디가 존재하지 않습니다"
      );
    }
    //3. fundGenID가 잘못됨
    else if (data === -3) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "fundGenID가 존재하지 않습니다"
      );
    }
    //4. 해당 staff에게 권한이 없음
    else if (data === -4) {
      response.basicResponse(
        res,
        returnCode.UNAUTHORIZED,
        false,
        "권한이 없는 staff입니다"
      );
    } else {
      response.dataResponse(
        res,
        returnCode.OK,
        true,
        "수행 인증이 완료되었습니다",
        data
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
  POSTsignupController,
  POSTsigninController,
  POSTphotoController,
};

export default authController;
