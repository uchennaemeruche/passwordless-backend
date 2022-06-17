"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const controllers_1 = __importDefault(require("./controllers"));
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Conneceted...");
}).catch(err => {
    console.error("New Error:", err);
});
const app = express_1.default();
app.use(cors_1.default());
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
controllers_1.default.forEach(controller => app.use(controller.path || "/", controller.router));
const { PORT = 5000 } = process.env;
http_1.createServer(app).listen(PORT, () => {
    console.log("Server started on PORT " + PORT);
});
//# sourceMappingURL=index.js.map