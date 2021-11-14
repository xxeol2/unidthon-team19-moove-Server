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
let OrderDetail = class OrderDetail extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Unique,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], OrderDetail.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => _1.Order),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], OrderDetail.prototype, "orderID", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => _1.GenGoods),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], OrderDetail.prototype, "genGoodsID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], OrderDetail.prototype, "count", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], OrderDetail.prototype, "degree", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], OrderDetail.prototype, "state", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], OrderDetail.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], OrderDetail.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], OrderDetail.prototype, "isDeleted", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => _1.Order),
    __metadata("design:type", _1.Order)
], OrderDetail.prototype, "order", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => _1.GenGoods),
    __metadata("design:type", _1.GenGoods)
], OrderDetail.prototype, "genGoods", void 0);
OrderDetail = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "OrderDetail",
        freezeTableName: true,
        underscored: false,
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci", // 한국어 설정
    })
], OrderDetail);
exports.default = OrderDetail;
//# sourceMappingURL=OrderDetail.js.map