"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const _1 = require(".");
let FundGen = class FundGen extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Unique,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], FundGen.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], FundGen.prototype, "startTime", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], FundGen.prototype, "endTime", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], FundGen.prototype, "pickUpTime", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], FundGen.prototype, "university", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], FundGen.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], FundGen.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], FundGen.prototype, "isDeleted", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => _1.GenGoods),
    __metadata("design:type", Array)
], FundGen.prototype, "genGoods", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => _1.Order),
    __metadata("design:type", Array)
], FundGen.prototype, "orders", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => _1.PickUp),
    __metadata("design:type", Array)
], FundGen.prototype, "pickUps", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => _1.GenManage),
    __metadata("design:type", Array)
], FundGen.prototype, "genManages", void 0);
FundGen = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "FundGen",
        freezeTableName: true,
        underscored: false,
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci", // 한국어 설정
    })
], FundGen);
exports.default = FundGen;
//# sourceMappingURL=FundGen.js.map