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
import { Staff, FundGen } from ".";

@Table({
  tableName: "GenManage",
  freezeTableName: true,
  underscored: false,
  timestamps: true,
  charset: "utf8", // 한국어 설정
  collate: "utf8_general_ci", // 한국어 설정
})
export default class GenManage extends Model {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column
  id: number;

  @ForeignKey(() => Staff)
  @Column
  staffID: number;

  @ForeignKey(() => FundGen)
  @Column
  fundGenID: number;

  @Column
  lockerMasterkey: string;

  @Column
  isDone: Boolean;

  @AllowNull
  @Column
  photo: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @Default(false)
  @Column
  isDeleted: Boolean;

  @BelongsTo(() => Staff)
  staff: Staff;

  @BelongsTo(() => FundGen)
  fundGen: FundGen;
}
