import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import User from "./User";
import Goods from "./Goods";
import FundGen from "./FundGen";
import GenGoods from "./GenGoods";
import OrderDetail from "./OrderDetail";
import Order from "./Order";
import PickUp from "./PickUp";
import Staff from "./Staff";
import GenManage from "./GenManage";
import AuthenticationCode from "./AuthenticationCode";

const db: any = {};

dotenv.config();

export const sequelize = new Sequelize(
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
  }
);

sequelize.addModels([
  User,
  Goods,
  FundGen,
  GenGoods,
  OrderDetail,
  Order,
  PickUp,
  Staff,
  GenManage,
  AuthenticationCode,
]);

export {
  User,
  Goods,
  FundGen,
  GenGoods,
  OrderDetail,
  Order,
  PickUp,
  Staff,
  GenManage,
  AuthenticationCode,
};

export default sequelize;
