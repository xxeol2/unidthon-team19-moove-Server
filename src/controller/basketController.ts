import { Request, Response } from "express";
import { validationResult } from "express-validator";
// libraries
import { response, returnCode } from "../library";
// services
import { basketService } from "../service";
//DTO
import { userDTO } from "../DTO";
import { flatMap } from "rxjs";

/**
 *  @장바구니_정보_불러오기
 *  @route GET /api/v1/basket
 *  @error
 *      1. 요청 바디 부족
 *      2. 식료품 펀딩 기간이 아님
 *    3. 현재 주문중인 상품이 없음
 */
const GETbasketController = async (req: Request, res: Response) => {
  try {
    const resData = await basketService.GETbasketService(
      req.body.userID.userID
    );

    // 1. 요청 바디 부족
    if (resData === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "요청 값이 올바르지 않습니다"
      );
    }
    // 2. 식료품 펀딩 기간이 아님
    else if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "식료품 펀딩 기간이 아닙니다"
      );
    }
    // 3. 빈 장바구니
    else if (resData === -3) {
      response.basicResponse(
        res,
        returnCode.OK,
        true,
        "장바구니에 물건이 없습니다"
      );
    } else {
      response.dataResponse(
        res,
        returnCode.OK,
        true,
        "장바구니 조회 성공",
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
 *  @장바구니_결제하기
 *  @route POST /api/v1/basket
 *  @error
 *      1. 요청 바디 부족
 *      2. 식료품 펀딩 기간이 아님
 *      3. 현재 주문중인 상품이 없음
 */
const POSTbasketController = async (req: Request, res: Response) => {
  try {
    const resData: undefined | -1 | -2 | -3 =
      await basketService.POSTbasketService(req.body.userID.userID);

    // 1. 요청 바디 부족
    if (resData === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "요청 값이 올바르지 않습니다"
      );
    }
    // 2. 식료품 펀딩 기간이 아님
    else if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "식료품 펀딩 기간이 아닙니다"
      );
    }
    // 3. 현재 주문중인 상품이 없음
    else if (resData === -3) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "장바구니에 물건이 없습니다"
      );
    } else {
      response.dataResponse(
        res,
        returnCode.OK,
        true,
        "장바구니 결제 성공",
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
const basketController = {
  GETbasketController,
  POSTbasketController,
};

export default basketController;
