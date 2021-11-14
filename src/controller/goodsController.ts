import { Request, Response } from "express";
import { validationResult } from "express-validator";
// libraries
import { response, returnCode } from "../library";
// services
import { goodsService } from "../service";
//DTO
import { goodsDTO } from "../DTO";
import { flatMap } from "rxjs";

/**
 *  @굿즈_리스트_불러오기
 *  @route GET /api/v1/goods
 *  @error
 *      1. 요청 바디 부족
 *      2. 현재 진행중인 굿즈 펀딩이 없음
 */

const GETgoodsController = async (req: Request, res: Response) => {
  try {
    const resData: goodsDTO.GETgoodsResDTO | -1 | -2 =
      await goodsService.GETgoodsService(req.body.userID.userID);

    // 1. 요청 바디 부족
    if (resData === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "요청 값이 올바르지 않습니다"
      );
    }
    // 2. 현재 진행중인 굿즈 펀딩이 없음
    else if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "현재 진행중인 식료품 펀딩이 없습니다"
      );
    } else {
      response.dataResponse(
        res,
        returnCode.OK,
        true,
        "굿즈 리스트 불러오기 성공",
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
 *  @굿즈_Detail_불러오기
 *  @route GET /api/v1/goods/:genGoodsID
 *  @error
 *      1. 요청 바디 부족
 *      2. 잘못된 genGoodsID
 *      3. 권한 없음 (유저 학교의 펀딩글이 아님)
 */
const GETgoodsDetailController = async (req: Request, res: Response) => {
  try {
    const resData: goodsDTO.goodsInfo | -1 | -2 | -3 =
      await goodsService.GETgoodsDetailService(
        req.body.userID.userID,
        Number(req.params.genGoodsID)
      );

    // 1. 요청 바디 부족
    if (resData === -1) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "요청 값이 올바르지 않습니다"
      );
    } else if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "잘못된 id값입니다"
      );
    }
    // 3. 권한 없음 (유저 학교의 펀딩글이 아님)
    else if (resData === -3) {
      response.basicResponse(
        res,
        returnCode.FORBIDDEN,
        false,
        "해당 펀딩 글을 볼 권한이 없습니다"
      );
    } else {
      response.dataResponse(
        res,
        returnCode.OK,
        true,
        "굿즈 Detail 불러오기 성공",
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
 *  @장바구니_담기
 *  @route POST /api/v1/goods/:genGoodsID/:orderingNum
 *  @error
 *      1. 요청 바디 부족
 *      2. 잘못된 genGoodsID
 *      3. 마감된 펀딩
 *      4. 현재 펀딩 기간이 아님
 *      5. 남은 수량 < 주문 수량
 */
const POSTgoodsController = async (req: Request, res: Response) => {
  try {
    const resData: undefined | -1 | -2 | -3 | -4 | -5 =
      await goodsService.POSTgoodsService(
        Number(req.params.genGoodsID),
        Number(req.params.orderingNum),
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
    } else if (resData === -2) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "잘못된 id값입니다"
      );
    }
    // 3. 마감된 펀딩
    else if (resData === -3) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "마감된 펀딩입니다. open된 다음 차수를 이용해주세요"
      );
    }
    // 4. 현재 펀딩 기간이 아님
    else if (resData === -4) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "현재 펀딩 기간이 아닙니다"
      );
    }
    // 5. 남은 수량 < 주문 수량
    else if (resData === -5) {
      response.basicResponse(
        res,
        returnCode.BAD_REQUEST,
        false,
        "주문 불가능한 수량입니다"
      );
    } else {
      response.dataResponse(
        res,
        returnCode.OK,
        true,
        "장바구니 담기 성공",
        resData
      );
    }
  } catch (err) {
    console.log(err);
    // console.error(err.message);
    response.basicResponse(
      res,
      returnCode.INTERNAL_SERVER_ERROR,
      false,
      "서버 오류"
    );
  }
};

const goodsController = {
  GETgoodsController,
  GETgoodsDetailController,
  POSTgoodsController,
};

export default goodsController;
