import { Schema, model } from "mongoose"

export const CodeSchema = new Schema({
    code: Number,
    email: String,
    expiresAt: Number,
    userId: { type: String, nullable: true }
})

const Code = model("Code", CodeSchema)
export default Code