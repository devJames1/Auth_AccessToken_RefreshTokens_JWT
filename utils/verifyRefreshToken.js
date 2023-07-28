import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

import withDB from "../dbConnect.js";

const verifyRefreshToken = async (refreshToken) => {

    try {
        const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY
        let myTokenDetails;
        await withDB(async (db) => {
            const doc = await db.collection("users_token").findOne({ token: refreshToken })
            if (!doc) {
                return ({ error: true, message: "Invalid refresh token" });
            }
            jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
                if (err) {
                    return ({ error: true, message: "Invalid refresh token" });
                }
                myTokenDetails = tokenDetails
            })
        })
        return ({
            myTokenDetails,
            error: false,
            message: "Valid refresh token"
        });
        // return withDB();
    } catch (error) {
        console.log(error);
    }
}

export default verifyRefreshToken;