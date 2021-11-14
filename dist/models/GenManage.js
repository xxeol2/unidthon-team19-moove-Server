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
let GenManage = class GenManage extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Unique,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GenManage.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => _1.Staff),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GenManage.prototype, "staffID", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => _1.FundGen),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GenManage.prototype, "fundGenID", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], GenManage.prototype, "lockerMasterkey", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], GenManage.prototype, "isDone", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], GenManage.prototype, "photo", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], GenManage.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], GenManage.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], GenManage.prototype, "isDeleted", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => _1.Staff),
    __metadata("design:type", _1.Staff)
], GenManage.prototype, "staff", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => _1.FundGen),
    __metadata("design:type", _1.FundGen)
], GenManage.prototype, "fundGen", void 0);
GenManage = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "GenManage",
        freezeTableName: true,
        underscored: false,
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci", // 한국어 설정
    })
], GenManage);
exports.default = GenManage;
//# sourceMappingURL=GenManage.js.map