import express from "express";
import { SaveURL } from "../controller/SaveUrl.js";
import { RedirectURL } from "../controller/RedirectUrl.js";

const router = express.Router();

router.post("/save", SaveURL);
router.get("/:shortId", RedirectURL);

export default router;
