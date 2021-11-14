import { Request, Response } from "express";
import { validationResult } from "express-validator";
// libraries
import { response, returnCode } from "../library";
// services
import { userService } from "../service";
//DTO
import { userDTO } from "../DTO";
import { flatMap } from "rxjs";

/**
 *  @유저_프로필_조회
 *  @route GET /api/v1/user
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 정보 없음
 */

const GETuserController = async (req: Request, res: Response) => {
  try {
    const resData: userDTO.GETuserResDTO | -1 | -2 =
      await userService.GETuserService(req.body.userID.userID);

    // 1. 요청 바디 부족
    if (resData === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "요청 값이 올바르지 않습니다"
      );
    }
    // 2. 유저 정보 없음
    else if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "없는 유저입니다"
      );
    } else {
      response.dataResponse(
        res,
        returnCode.OK,
        true,
        "유저 프로필 조회 성공",
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
 *  @유저_수령_인증사진_첨부
 *  @route POST /user/photo/:orderID
 *  @error
 *      1. 요청 바디 부족
 *      2. 유저 정보 없음
 *      3. 주문 정보 없음
 */
const POSTphotoController = async (req: Request, res: Response) => {
  try {
    const url = {
      photo: (req as any).files.photo
        ? (req as any).files.photo[0].location
        : null,
    };

    const data: userDTO.POSTphotoResDTO | -1 | -2 | -3 =
      await userService.POSTphotoService(
        req.body.userID.userID,
        Number(req.params.orderID),
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
    // 2. 유저 정보 없음
    else if (data === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "없는 유저입니다"
      );
    }
    // 3. 주문 정보 없음
    else if (data === -3) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "없는 주문입니다"
      );
    } else {
      response.dataResponse(
        res,
        returnCode.OK,
        true,
        "유저 수령 인증 성공",
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
const userController = {
  GETuserController,
  POSTphotoController,
};

export default userController;
