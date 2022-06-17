"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    email: { type: String, unique: true },
    username: String,
    role: { type: String, default: 'member' }
});
const User = mongoose_1.model("User", exports.UserSchema);
exports.default = User;
//# sourceMappingURL=User.model.js.map