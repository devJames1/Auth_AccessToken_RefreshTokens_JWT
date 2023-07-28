import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();


//middleware function to authenticate and asign token details to user variable
const auth = async (req, res, next) => {
    const token = req.header("x-access-token");
    if (!token) {
        return res.status(403).json({ error: true, message: "Access Denied: No token provided" });
    }
    try {
        const tokenDetails = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        req.user = tokenDetails;
        next();
    } catch (error) {
        res.status(403).json({ error: true, message: "Access Denied: Invalid token" });
    }
};

export default auth;