import { initNavbar } from "/js/utils.js";

let reviseList;
let flashcard;
let set;
let facingFront = true;
let flashcardTextField;

async function main() {
    flashcardTextField = document.querySelector("#flashcard-text-p");
    await getFlashcardInfo();
    setFlashcardData();

    // If flashcard isn't on revise list, redirect user to dashboard
    reviseList = JSON.parse(localStorage.getItem("flashcardIds"));
    if (!reviseList.find(id => id === flashcard._id)) {
        window.location.href = "/dashboard";
        return;
    }

    initNavbar();

    // Flip flashcard upon click or spacebar press
    const flashcardDiv = document.querySelector("#flashcard-review-div");
    flashcardDiv.addEventListener("click", flipFlashcard);
    document.addEventListener("keydown", event => {
        if (event.code === "Space") flipFlashcard();
    });
    
    // Feedback buttons
    document.querySelector("#incorrect-button").addEventListener("click", () => guessFeedback(false));
    document.querySelector("#correct-button").addEventListener("click", () => guessFeedback(true));
}

function setFlashcardData() {
    if (facingFront) {
        flashcardTextField.textContent = flashcard.text;
    }
    else {
        flashcardTextField.textContent = flashcard.answer;
    }
}

function flipFlashcard() {
    facingFront = !facingFront;
    setFlashcardData();
}

function guessFeedback(guessedCorrectly) {
    // Remove current id from list
    const index = reviseList.indexOf(flashcard._id);
    reviseList.splice(index, 1);

    // Set new flashcard list
    localStorage.setItem("flashcardIds", JSON.stringify(reviseList));

    // If guess was correct, store this information in local storage
    if (guessedCorrectly) {
        localStorage.setItem(`flashcard:${flashcard._id}:correct`, "true");
    }

    // Redirect back to set page if there are no more flashcards left
    if (reviseList.length === 0) {
        window.location.href = `/set/${set._id}`;
        return;
    }

    // Redirect to next flashcard
    const nextId = reviseList[0];
    window.location.href = `/set/${set._id}/review/${nextId}`;
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

main();