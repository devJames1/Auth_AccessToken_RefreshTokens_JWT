import { Router } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

import verifyRefreshToken from "../utils/verifyRefreshToken.js";
import { refreshTokenBodyValidation } from "../utils/validationSchema.js";
import withDB from "../dbConnect.js";

const router = Router();

//get new access token
router.post("/", async (req, res) => {

    const { error } = refreshTokenBodyValidation(req.body);
    if (error) {
        return res.status(400).json({ error: true, message: error.details[0].message })
    }
    const { myTokenDetails } = await verifyRefreshToken(req.body.refreshToken)
    // console.log(myTokenDetails);
    if (!myTokenDetails) {
        return res.status(400).json({
            error: true, message: "Invalid refresh token"
        })
    }
    const payload = { _id: myTokenDetails._id, roles: myTokenDetails.roles };
    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "14m" }
    )
    res.status(200).json({
        error: false,
        accessToken,
        message: "Access token created successfully"
    })


})

router.delete("/", async (req, res) => {
    try {
        const { error } = refreshTokenBodyValidation(req.body);
        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message });
        }
        withDB(async (db) => {
            const userToken = await db.collection("users_token").findOne({ token: req.body.refreshToken })
            if (!userToken) {
                return res.status(200).json({ error: false, message: "Logged Out Successfully" })
            }
            await db.collection("users_token").deleteOne({ token: req.body.refreshToken })
            res.status(200).json({ error: false, message: "Logged out succesfully" })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
})

export default router;