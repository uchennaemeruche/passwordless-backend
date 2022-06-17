"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CodeSchema = new mongoose_1.Schema({
    code: Number,
    email: String,
    expiresAt: Number,
    userId: { type: String, nullable: true }
});
const Code = mongoose_1.model("Code", exports.CodeSchema);
exports.default = Code;
//# sourceMappingURL=Code.model.js.map