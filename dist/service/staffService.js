"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models
const models_1 = require("../models");
// library
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config"));
const sequelize_1 = __importDefault(require("sequelize"));
/**
 *  @회원가입
 *  @route Post /api/v1/staff/signup
 *  @body email, password
 *  @access public
 *  @error
 *      1. 요청 바디 부족
 *      2. 이미 가입한 이메일
 */
const POSTsignupService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, phone, university } = data;
    // 1. 요청 바디 부족
    if (!email || !password) {
        return -1;
    }
    // 2. 이미 가입한 email - isDeleted:false
    const emailStaff = yield models_1.Staff.findOne({
        where: { email, isDeleted: false },
    });
    if (emailStaff) {
        return -2;
    }
    // password 암호화
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashPassword = yield bcryptjs_1.default.hash(password, salt);
    const newStaff = yield models_1.Staff.create({
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
    let token = jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: "14d" });
    return { token };
});
/**
 *  @로그인
 *  @route Post /api/v1/staff/siginin
 *  @body email,password
 *  @error
 *      1. 요청 바디 부족
 *      2. 아이디가 존재하지 않음
 *      3. 패스워드가 올바르지 않음
 */
function POSTsigninService(reqData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = reqData;
        // 1. 요청 바디 부족
        if (!email || !password) {
            return -1;
        }
        // 2. email이 DB에 존재하지 않음
        const staff = yield models_1.Staff.findOne({
            where: { email, isDeleted: false },
        });
        if (!staff) {
            return -2;
        }
        // 3. password가 올바르지 않음
        const isMatch = yield bcryptjs_1.default.compare(password, staff.password);
        if (!isMatch) {
            return -3;
        }
        yield staff.save();
        const payload = {
            staff: {
                id: staff.id,
            },
        };
        // access 토큰 발급
        // 유효기간 14일
        let token = jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: "14d" });
        const resData = {
            staffID: staff.id,
            university: staff.university,
        };
        return { resData, token };
    });
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
const POSTphotoService = (staffID, fundGenID, url) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 요청 바디 부족
    if (!url)
        return -1;
    const staff = yield models_1.Staff.findOne({
        where: { id: staffID, isDeleted: false },
    });
    // 2. staff id 잘못됨
    if (!staff)
        return -2;
    const fundGen = yield models_1.FundGen.findOne({
        where: { id: fundGenID, isDeleted: false },
    });
    // 3. fundGenID가 잘못됨
    if (!fundGen)
        return -3;
    // 4. 해당 staff에게 권한이 없을 때
    const genManage = yield models_1.GenManage.findOne({
        where: { staffID, fundGenID, isDeleted: false },
    });
    if (!genManage)
        return -3;
    yield models_1.GenManage.update({ photo: url.imgThumbnail }, { where: { id: genManage.id } });
    staff.save();
    const genGoods = yield models_1.GenGoods.findAll({
        where: {
            fundGenID: genManage.fundGenID,
            isConfirmed: true,
            isDeleted: false,
        },
    });
    const genGoodsIDs = genGoods.map((gengoods) => {
        return gengoods.id;
    });
    yield models_1.OrderDetail.update({ state: 3 }, { where: { genGoodsID: { [sequelize_1.default.Op.in]: genGoodsIDs } } });
    return undefined;
});
const staffService = {
    POSTsignupService,
    POSTsigninService,
    POSTphotoService,
};
exports.default = staffService;
//# sourceMappingURL=staffService.js.map