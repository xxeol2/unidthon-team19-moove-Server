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
import { GenGoods, Order, PickUp, GenManage } from ".";

@Table({
  tableName: "FundGen",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class FundGen extends Model {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  id: number;

  @Column
  startTime: Date;

  @Column
  endTime: Date;

  @Column
  pickUpTime: Date;

  // @Column
  // pickUpEndTime: Date;

  @Column
  university: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @Default(false)
  @Column
  isDeleted: Boolean;

  @HasMany(() => GenGoods)
  genGoods: GenGoods[];

  @HasMany(() => Order)
  orders: Order[];

  @HasMany(() => PickUp)
  pickUps: PickUp[];

  @HasMany(() => GenManage)
  genManages: GenManage[];
}
