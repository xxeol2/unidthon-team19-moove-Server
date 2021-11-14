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
import { GenGoods, OrderDetail } from ".";

@Table({
  tableName: "Goods",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class Goods extends Model {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  id: number;

  @Unique
  @Column
  name: string;

  @Column
  category: number;

  @Column
  min: number;

  @Column
  price: number;

  @Column
  unit: string;

  @Column
  completeNum: number;

  @Column
  photo: string;

  @AllowNull
  @Column
  desc: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @Default(false)
  @Column
  isDeleted: Boolean;

  @HasMany(() => GenGoods)
  genGoods: GenGoods[];
}
