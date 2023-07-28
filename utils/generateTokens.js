import jwt from "jsonwebtoken";
import { createTTLIndex } from "../models/userToken.model.js"
import withDB from "../dbConnect.js";

import { config } from "dotenv";
config();


// generate token for user
async function generateAuthTokens(user) {
    try {
        const payload = { _id: user._id, roles: user.roles };
        const accessToken = jwt.sign(
            payload, process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "14m" }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "30d" }
        );

        withDB(async (db) => {
            const userToken = await db.collection("users_token").findOne({ userId: user._id });
            if (userToken) {
                await db.collection("users_token").deleteOne({ userId: user._id })
            }

            await createTTLIndex(db);
            await db.collection("users_token").insertOne({ userId: user._id, token: refreshToken, createdAt: new Date(), })
        })
        return { accessToken, refreshToken };

    } catch (error) {
        return error;
    }
}

export default generateAuthTokens;