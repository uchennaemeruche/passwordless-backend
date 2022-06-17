"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = require("jsonwebtoken");
const Code_model_1 = __importDefault(require("../models/Code.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const send_email_1 = require("../utils/send_email");
const router = express_1.Router();
router.post("/send-magic-link", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = req.body;
    if (typeof email !== "string" || !email.trim())
        return res.status(400).json({
            error: "Invalid email",
            message: "Please provide a valid email."
        });
    const userId = (_a = (yield User_model_1.default.findOne({ email }))) === null || _a === void 0 ? void 0 : _a.id;
    const code = Math.floor((Math.random() * 899999) + 100000);
    const newCode = new Code_model_1.default({
        code, userId, email, expiresAt: Date.now() + 15 * 60 * 1000
    });
    console.log("EMail", email, "userID:", userId, "New Code:", newCode);
    yield newCode.save();
    send_email_1.sendMail(email, code);
    return res.status(200).json({ ok: true });
}));
router.get("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code: codeFromQs } = req.query;
    if (typeof codeFromQs !== "string" || isNaN(parseInt(codeFromQs)))
        return res.status(400).json({
            error: "Invalid Code",
            message: "please send a valid code in the querystring"
        });
    const code = parseInt(codeFromQs);
    const checkCode = yield Code_model_1.default.findOne({ code });
    if (!checkCode)
        return res.status(400).json({
            error: "Invalid code",
            message: "Please send a valid code in the querystring"
        });
    const { email, userId } = checkCode;
    let user = null;
    try {
        if (userId) {
            user = yield User_model_1.default.findById(userId).exec();
            if (!user)
                return res.status(400).json({
                    error: "Invalid Code",
                    message: "Please send a valid code in the querystring"
                });
        }
        else {
            user = new User_model_1.default({ email, username: email.split("@")[0] });
            yield user.save();
        }
    }
    catch (error) {
        return res.status(400).json({
            error: error
        });
    }
    const token = jsonwebtoken_1.sign({ id: user._id.toString() }, process.env.SECRET || "secret", { expiresIn: 604800 });
    return res.status(200).json({
        ok: true,
        token,
        user
    });
}));
router.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const authHeader = req.headers.authorization;
    if (!authHeader || typeof authHeader !== "string" || ((_b = authHeader.split(" ")) === null || _b === void 0 ? void 0 : _b.length) !== 2 || authHeader.split(" ")[0].toLowerCase() !== "bearer")
        return res.status(401).json({
            error: "Invalid auth header",
            message: "You supplied an invalid authentication header"
        });
    const identity = jsonwebtoken_1.verify(authHeader.split(" ")[1], process.env.SECRET || "secret");
    if (typeof identity === "string")
        return res.status(401).json({ error: "Invalid token" });
    if (typeof identity.id !== "string")
        return res.status(401).json({ error: "Invalid token" });
    const user = yield User_model_1.default.findById(identity.id);
    if (!user)
        return res.status(401).json({ error: "Invalid token" });
    return res.status(200).json({ ok: true, user });
}));
exports.default = router;
//# sourceMappingURL=auth.js.map