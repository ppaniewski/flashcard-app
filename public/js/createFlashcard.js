import { initNavbar, getSetInfo } from "/js/utils.js";

let set;
let flashcardTextInput;
let flashcardAnswerInput;
let createInfo;

async function main() {
    set = await getSetInfo();
    initNavbar();

    // Initialize elements
    flashcardTextInput = document.getElementById("flashcard-text");
    flashcardAnswerInput = document.getElementById("flashcard-answer");
    createInfo = document.getElementById("create-info");

    const createButton = document.getElementById("create-flashcard-button");
    createButton.addEventListener("click", createFlashcard);
}

async function createFlashcard() {
    const text = flashcardTextInput.value;
    const answer = flashcardAnswerInput.value;
    if (!text || text.length < 3) {
        createInfo.textContent = "Text is too short!";
        createInfo.classList.remove("visually-hidden");
        return;
    }

    if (!answer || answer.length < 1) {
        createInfo.textContent = "Answer is too short!";
        createInfo.classList.remove("visually-hidden");
        return;
    }

    const res = await fetch(`/api/sets/${set._id}/cards`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text,
            answer
        })
    })
    const data = await res.json();

    if (!res.ok) {
        createInfo.textContent = data.message;
        createInfo.classList.remove("visually-hidden");
        return;
    }

    window.location.href = `/set/${set._id}`;
}

main();