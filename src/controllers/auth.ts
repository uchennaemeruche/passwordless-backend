import { Router } from "express"
import {sign, verify} from "jsonwebtoken"
import Code from "../models/Code.model"
import User from "../models/User.model"
import {sendMail} from "../utils/send_email"
const router = Router()

router.post("/send-magic-link", async(req, res,) => {
    // Code to send the magic link email
    const { email } = req.body
    if (typeof email !== "string" || !email.trim()) return res.status(400).json({
        error: "Invalid email",
        message: "Please provide a valid email."
    })

    const userId = (await User.findOne({ email }))?.id
    const code = Math.floor((Math.random() * 899999) + 100000)
    
    const newCode = new Code({
        code, userId, email, expiresAt: Date.now() + 15 * 60 * 1000
    })
    console.log("EMail", email, "userID:", userId, "New Code:", newCode)
    await newCode.save()

    sendMail(email, code)

    return res.status(200).json({ok:true})

})

router.get("/token", async(req, res) => {
    // Code to generate a token from the code in the email
    const { code: codeFromQs } = req.query
    if (typeof codeFromQs !== "string" || isNaN(parseInt(codeFromQs)))
        return res.status(400).json({
            error: "Invalid Code",
            message: "please send a valid code in the querystring"
        })
    const code = parseInt(codeFromQs)
    const checkCode = await Code.findOne({ code })
    if (!checkCode)
        return res.status(400).json({
            error: "Invalid code",
            message: "Please send a valid code in the querystring"
        })
    
    const { email, userId } = checkCode as any
    let user = null

    try {
        if (userId) {
            user = await User.findById(userId).exec()
            if (!user) return res.status(400).json({
                error: "Invalid Code",
                message: "Please send a valid code in the querystring"
            })
        } else {
            user = new User({ email, username: email.split("@")[0] })
            await user.save()
        }
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
    

    // Exp in 1 week
    const token = sign({id:user._id.toString()},
        process.env.SECRET || "secret",
        {expiresIn: 604800}
    )
    return res.status(200).json({
        ok: true,
        token,
        user
    })

})

router.get("/user", async(req, res) => {
    // Code to fetch the user from the token
    const authHeader = req.headers.authorization;
    if (!authHeader || typeof authHeader !== "string" || authHeader.split(" ")?.length !== 2 || authHeader.split(" ")[0].toLowerCase() !== "bearer")
        return res.status(401).json({
            error: "Invalid auth header",
            message: "You supplied an invalid authentication header"
        })
    
    const identity = verify(authHeader.split(" ")[1], process.env.SECRET || "secret") as any
    if (typeof identity === "string")
        return res.status(401).json({ error: "Invalid token" })
    if (typeof identity.id !== "string") return res.status(401).json({ error: "Invalid token" })
    
    const user = await User.findById(identity.id)
    if (!user) return res.status(401).json({ error: "Invalid token" })
    return res.status(200).json({ok:true, user})
})

export default router
