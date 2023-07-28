import { Router } from "express";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";


const router = Router();

router.get("/details", auth, roleCheck(["user"]), (req, res) => {
    res.status(200).json({ message: "User have access right" })
})


export default router;