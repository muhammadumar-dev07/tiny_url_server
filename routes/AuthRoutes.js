import express from "express";
import { CurrentUser, Login, Register } from "../controller/AuthController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/me", authenticate, CurrentUser);

export default router;
