import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Text is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
},
{
    timestamps: true
});

const flashcardSetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    flashcards: {
        type: [flashcardSchema],
        required: true
    }
},
{
    timestamps: true
});

export default mongoose.model("FlashcardSet", flashcardSetSchema, "flashcard_sets");