import express from "express"
import cors from "cors"
import morgan from "morgan"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { createServer } from "http"
import controllers from "./controllers"

dotenv.config()
mongoose.connect(process.env.MONGODB_URL!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(() => {
    console.log("Conneceted...")
}).catch(err => {
    console.error("New Error:", err)
})

const app = express()
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
controllers.forEach(controller => 
    app.use(controller.path || "/", controller.router)
)

const { PORT = 5000 } = process.env
createServer(app).listen(PORT, () => {
    console.log("Server started on PORT " + PORT)
})