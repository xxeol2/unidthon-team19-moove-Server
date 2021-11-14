import {
  Model,
  Column,
  CreatedAt,
  UpdatedAt,
  Table,
  PrimaryKey,
  AutoIncrement,
  Unique,
  Default,
  AllowNull,
  HasMany,
  HasOne,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Order, GenGoods } from ".";

@Table({
  tableName: "OrderDetail",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class OrderDetail extends Model {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  id: number;

  @ForeignKey(() => Order)
  @Column
  orderID: number;

  @ForeignKey(() => GenGoods)
  @Column
  genGoodsID: number;

  @Column
  count: number;

  @Column
  degree: number;

  @Column
  state: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @Default(false)
  @Column
  isDeleted: Boolean;

  @BelongsTo(() => Order)
  order: Order;

  @BelongsTo(() => GenGoods)
  genGoods: GenGoods;
}
