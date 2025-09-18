import asyncHandler from "express-async-handler";
import FlashcardSet from "../models/flashcardModel.js";

// @route GET /api/sets
export const getSets = asyncHandler(async (req, res) => {
    // Don't include flashcards in the list
    const sets = await FlashcardSet.find({userId: req.user.id}).select("_id title");
    res.status(200).json(sets);
});

// @route POST /api/sets
export const createSet = asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
        res.status(400);
        throw new Error("Title not provided");
    }

    // Check if user doesn't already have a set with this title
    const titleTaken = await FlashcardSet.findOne({userId: req.user.id, title});
    if (titleTaken) {
        res.status(400);
        throw new Error("Title already taken");
    }

    // Create new set
    const set = await FlashcardSet.create({
        userId: req.user.id,
        title,
        flashcards: []
    });

    res.status(201).json({
        id: set._id,
        title: set.title
    });
});

// @route GET /api/sets/:setId
export const getSet = asyncHandler(async (req, res) => {
    const set = await FlashcardSet.findOne({
        _id: req.params.setId,
        userId: req.user.id
    }).select("_id title flashcards");

    if (!set) {
        res.status(404);
        throw new Error("Set not found");
    }

    res.status(200).json(set);
});

// @route PUT /api/sets/:setId
export const updateSet = asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
        res.status(400);
        throw new Error("New title required");
    }

    const set = await FlashcardSet.findOneAndUpdate(
        { _id: req.params.setId, userId: req.user.id }, 
        { title },
        { new: true }
    ).select("_id title");

    if (!set) {
        res.status(404);
        throw new Error("Set not found");
    }

    res.status(200).json(set);
});

// @route DELETE /api/sets/:setId
export const deleteSet = asyncHandler(async (req, res) => {
    const deletedSet = await FlashcardSet.findOneAndDelete({
        _id: req.params.setId,
        userId: req.user.id
    }).select("title");

    if (!deletedSet) {
        res.status(404);
        throw new Error("Set not found");
    }

    res.status(200).json(deletedSet);
});

// @route POST /api/sets/:setId/cards
export const addCard = asyncHandler(async (req, res) => {
    const { text, answer } = req.body;
    if (!text || !answer) {
        res.status(400);
        throw new Error("Text and answer required");
    }

    const set = await FlashcardSet.findOne({
        _id: req.params.setId,
        userId: req.user.id
    });
    if (!set) {
        res.status(404);
        throw new Error("Set not found");
    }

    // Add new flashcard
    const flashcard = { text, answer };
    set.flashcards.push(flashcard);
    await set.save();

    res.status(200).json(flashcard);
});