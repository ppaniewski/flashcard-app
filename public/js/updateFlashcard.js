import { initNavbar } from "/js/utils.js";

let set;
let flashcard;

let flashcardTextInput;
let flashcardAnswerInput;
let textUpdateInfo;
let answerUpdateInfo;

async function main() {
    await getFlashcardInfo();
    initNavbar();

    // Initialize input fields
    flashcardTextInput = document.getElementById("flashcard-text");
    flashcardAnswerInput = document.getElementById("flashcard-answer");
    flashcardTextInput.value = flashcard.text;
    flashcardAnswerInput.value = flashcard.answer;
    textUpdateInfo = document.getElementById("text-update-info");
    answerUpdateInfo = document.getElementById("answer-update-info");

    // Initialize update buttons
    document.getElementById("update-text-button").addEventListener("click", updateText);
    document.getElementById("update-answer-button").addEventListener("click", updateAnswer);

    // Initialize flashcard deletion
    const confirmDeleteButton = document.getElementById("confirm-delete-button");
    document.querySelector("#delete-flashcard-button").addEventListener("click", () => {
        confirmDeleteButton.classList.remove("visually-hidden");
    });
    confirmDeleteButton.addEventListener("click", deleteFlashcard);
}

async function getFlashcardInfo() {
    const parts = window.location.pathname.split("/");
    const setId = parts[2];
    const flashcardId = parts[4];

    const res = await fetch(`/api/sets/${setId}`);

    // Redirect user back to dashboard if set id is invalid
    if (!res.ok) {
        window.location.href = "/dashboard";
        return;
    }

    set = await res.json();

    for (const card of set.flashcards) {
        if (card._id === flashcardId) {
            flashcard = card;
            return;
        }
    }

    if (!flashcard) {
        window.location.href = "/dashboard";
    }
}

async function updateText() {
    const newText = flashcardTextInput.value;
    if (!newText || newText.length < 3) {
        textUpdateInfo.textContent = "Too few characters!";
        textUpdateInfo.classList.remove("visually-hidden");
        return;
    }

    const res = await fetch(`/api/sets/${set._id}/cards/${flashcard._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: newText           
        })
    });
    const data = await res.json();

    if (!res.ok) {
        textUpdateInfo.textContent = data.message;
        textUpdateInfo.classList.remove("visually-hidden");
        return;
    }

    textUpdateInfo.textContent = "Successfully updated!";
    textUpdateInfo.classList.remove("visually-hidden");
}

async function updateAnswer() {
    const newAnswer = flashcardAnswerInput.value;
    if (!newAnswer || newAnswer.length < 1) {
        answerUpdateInfo.textContent = "Too few characters!";
        answerUpdateInfo.classList.remove("visually-hidden");
        return;
    }

    const res = await fetch(`/api/sets/${set._id}/cards/${flashcard._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            answer: newAnswer
        })
    });
    const data = await res.json();

    if (!res.ok) {
        answerUpdateInfo.textContent = data.message;
        answerUpdateInfo.classList.remove("visually-hidden");
        return;
    }

    answerUpdateInfo.textContent = "Successfully updated!";
    answerUpdateInfo.classList.remove("visually-hidden");
}

async function deleteFlashcard() {
    const res = await fetch(`/api/sets/${set._id}/cards/${flashcard._id}`, {
        method: "DELETE"
    });
    
    if (res.ok) {
        window.location.href = `/set/${set._id}`;
    }
}

main();