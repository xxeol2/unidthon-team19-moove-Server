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
import { FundGen, Goods, OrderDetail } from ".";

@Table({
  tableName: "GenGoods",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class GenGoods extends Model {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  id: number;

  @ForeignKey(() => FundGen)
  @Column
  fundGenID: number;

  @ForeignKey(() => Goods)
  @Column
  goodsID: number;

  @Column
  degree: number;

  @Column
  count: number;

  @Column
  isConfirmed: Boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @Default(false)
  @Column
  isDeleted: Boolean;

  @BelongsTo(() => FundGen)
  fundGen: FundGen;

  @BelongsTo(() => Goods)
  goods: Goods;

  @HasMany(() => OrderDetail)
  orderDetails: OrderDetail[];
}
