import { Router } from "express";
import bcrypt from "bcrypt";

import { config } from "dotenv";
config();

import withDB from "../dbConnect.js";
import { signUpBodyValidation, loginBodyValidation } from "../utils/validationSchema.js";
import generateAuthTokens from "../utils/generateTokens.js";

const router = Router();

//signup
router.post("/signup", async (req, res) => {
    try {
        const { error } = signUpBodyValidation(req.body);
        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message });
        }
        withDB(async (db) => {
            const user = await db.collection('users').findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: true, message: "User with given email already exist" });
            }

            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.password, salt);

            console.log({ ...req.body, password: hashPassword, roles: ["user"] })
            await db.collection("users").insertOne({ ...req.body, password: hashPassword, roles: ["user"] })

            res.status(201).json({ error: false, message: "Account created successfully" });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

//login
router.post("/login", async (req, res) => {
    try {
        const { error } = loginBodyValidation(req.body);
        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message });
        }
        withDB(async (db) => {
            const user = await db.collection("users").findOne({ email: req.body.email })
            if (!user) {
                return res.status(400).json({ error: true, message: "Email not found" })
            }
            const verifyPassword = await bcrypt.compare(req.body.password, user.password);
            if (!verifyPassword) {
                return res.status(401).json({ error: true, messgae: "Invalid email or password" });
            }

            //generate access and refresh token
            const { accessToken, refreshToken } = await generateAuthTokens(user);

            res.status(200).json({
                error: false,
                accessToken,
                refreshToken,
                message: "Logged in sucessfully"
            });
        })
    } catch (error) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
})



export default router;