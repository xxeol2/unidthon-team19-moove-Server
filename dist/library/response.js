"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basicResponse = (res, status, success, message) => {
    res.status(status).json({
        status: status,
        success: success,
        message: message,
    });
};
const dataResponse = (res, status, success, message, data) => {
    res.status(status).json({
        status: status,
        success: success,
        message: message,
        data: data,
    });
};
const tokenResponse = (res, status, success, message, token) => {
    res.status(status).json({
        status: status,
        success: success,
        message: message,
        token: token,
    });
};
const dataTokenResponse = (res, status, success, message, data, token) => {
    res.status(status).json({
        status: status,
        success: success,
        message: message,
        data: data,
        token: token,
    });
};
const responseTypes = {
    basicResponse,
    dataResponse,
    tokenResponse,
    dataTokenResponse,
};
exports.default = responseTypes;
//# sourceMappingURL=response.js.map