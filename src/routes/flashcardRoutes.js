import express from 'express';
import authMiddleware from "../middleware/authMiddleware.js";
import { getSets, getSet, createSet, updateSet, deleteSet, addCard } from "../controllers/flashcardController.js";

const router = express.Router();

// Authenticate user before any flashcard action
router.use(authMiddleware);

// Sets
router.route("/").get(getSets).post(createSet);
router.route("/:setId").get(getSet).put(updateSet).delete(deleteSet);

// Cards
router.post("/:setId/cards", addCard);
// router.route("/:setId/cards/:cardId").put(updateCard).delete(deleteCard);

export default router;