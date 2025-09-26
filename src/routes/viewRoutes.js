import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import requireAuth from "../middleware/requireAuth.js";
import verifyAccess from "../middleware/verifyAccess.js";
import noCache from "../middleware/noCache.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewPath = path.join(__dirname, "../views");

const router = express.Router();

router.use(noCache);

router.get("/login", verifyAccess, sendIfAuthenticated("dashboard.html", "login.html"));

router.get("/register", verifyAccess, sendIfAuthenticated("dashboard.html", "register.html"));

router.get("/dashboard", verifyAccess, sendIfAuthenticated("dashboard.html"));

router.get("/set/:setId", verifyAccess, sendIfAuthenticated("set.html"));

router.get("/set/:setId/create-flashcard", verifyAccess, sendIfAuthenticated("create-flashcard.html"));

router.get("/set/:setId/update-flashcard/:flashcardId", verifyAccess, sendIfAuthenticated("update-flashcard.html"));

router.get("/set/:setId/review/:flashcardId", verifyAccess, sendIfAuthenticated("review.html"));

function sendIfAuthenticated(viewIfLoggedIn, viewIfGuest = "login.html") {
    return (req, res) => {
        if (!req.user) {
            return res.sendFile(path.join(viewPath, viewIfGuest));
        }
        return res.sendFile(path.join(viewPath, viewIfLoggedIn));
    }
}

export default router;