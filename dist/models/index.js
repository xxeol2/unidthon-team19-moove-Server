"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationCode = exports.GenManage = exports.Staff = exports.PickUp = exports.Order = exports.OrderDetail = exports.GenGoods = exports.FundGen = exports.Goods = exports.User = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Goods_1 = __importDefault(require("./Goods"));
exports.Goods = Goods_1.default;
const FundGen_1 = __importDefault(require("./FundGen"));
exports.FundGen = FundGen_1.default;
const GenGoods_1 = __importDefault(require("./GenGoods"));
exports.GenGoods = GenGoods_1.default;
const OrderDetail_1 = __importDefault(require("./OrderDetail"));
exports.OrderDetail = OrderDetail_1.default;
const Order_1 = __importDefault(require("./Order"));
exports.Order = Order_1.default;
const PickUp_1 = __importDefault(require("./PickUp"));
exports.PickUp = PickUp_1.default;
const Staff_1 = __importDefault(require("./Staff"));
exports.Staff = Staff_1.default;
const GenManage_1 = __importDefault(require("./GenManage"));
exports.GenManage = GenManage_1.default;
const AuthenticationCode_1 = __importDefault(require("./AuthenticationCode"));
exports.AuthenticationCode = AuthenticationCode_1.default;
const db = {};
dotenv_1.default.config();
exports.sequelize = new sequelize_typescript_1.Sequelize(
// config.development.database,
// config.development.username,
// config.development.password,
{
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_DBNAME,
    dialect: "mysql",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: false,
    timezone: "+09:00",
});
exports.sequelize.addModels([
    User_1.default,
    Goods_1.default,
    FundGen_1.default,
    GenGoods_1.default,
    OrderDetail_1.default,
    Order_1.default,
    PickUp_1.default,
    Staff_1.default,
    GenManage_1.default,
    AuthenticationCode_1.default,
]);
exports.default = exports.sequelize;
//# sourceMappingURL=index.js.map