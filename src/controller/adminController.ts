import { Request, Response } from "express";
import { validationResult } from "express-validator";
// libraries
import { response, returnCode } from "../library";
// services
import { adminService } from "../service";
//DTO
import { adminDTO } from "../DTO";
import { flatMap } from "rxjs";

/**
 *  @staff_FundingGeneration_배정
 *  @route POST /api/v1/admin/:staffID/:fundGenID
 *  @error
 *      1. 요청 바디 부족
 *      2. 잘못된 adminkey
 *      3. 잘못된 fundGenID
 *      4. 잘못된 staffID
 */

const POSTadminController = async (req: Request, res: Response) => {
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
    const reqData: adminDTO.POSTadminReqDTO = req.body;
    const data: adminDTO.POSTadminResDTO | -1 | -2 | -3 | -4 =
      await adminService.POSTadminService(
        Number(req.params.staffID),
        Number(req.params.fundGenID),
        req.body.admin.key
      );

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
        "adminkey 불일치"
      );
    } else if (data === -3) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "fundGenID가 올바르지 않습니다"
      );
    } else if (data === -4) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "staffID가 올바르지 않습니다"
      );
    } else {
      response.dataResponse(
        res,
        returnCode.CREATED,
        true,
        "staff FundingGeneration 배정완료",
        data
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
 *  @admin_token_발급
 *  @route POST /api/v1/admin/token
 *  @error
 *      1. 요청 바디 부족
 *      1. 잘못된 admin key
 */

const POSTadminTokenController = async (req: Request, res: Response) => {
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
    const reqData: adminDTO.POSTadminTokenReqDTO = req.body;
    const data = await adminService.POSTadminTokenService(req.body.adminkey);

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
        "adminkey 불일치"
      );
    }

    // 회원가입 성공
    else {
      const { token } = data;
      response.tokenResponse(
        res,
        returnCode.CREATED,
        true,
        "admin token 발급 성공",
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

const adminController = {
  POSTadminTokenController,
  POSTadminController,
};

export default adminController;
