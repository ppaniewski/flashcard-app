import { initNavbar, getSetInfo } from "/js/utils.js";

let set;
let grid;
let newTitleInput;

async function main() {
    set = await getSetInfo();
    document.querySelector(".title-header").textContent = `${set.title}`;

    initNavbar();

    // Initialize grid
    grid = document.querySelector(".grid-container");
    fillFlashcardGrid();

    // Initialize set deletion
    const confirmDeleteButton = document.getElementById("confirm-delete-set-button");
    document.querySelector("#delete-set-button").addEventListener("click", () => {
        confirmDeleteButton.classList.remove("visually-hidden");
        confirmDeleteButton.classList.add("confirm-delete-set-button");
    });
    confirmDeleteButton.addEventListener("click", deleteSet);

    // Initialize title change
    newTitleInput = document.getElementById("new-title-input");
    document.querySelector("#change-title-button").addEventListener("click", changeTitle);    

    // Flashcard add button
    document.getElementById("add-flashcard-button").addEventListener("click", () => window.location.href = `/set/${set._id}/create-flashcard`);

    // Initialize review buttons
    document.getElementById("review-all-button").addEventListener("click", reviewAll);
    document.getElementById("review-mistakes-button").addEventListener("click", reviewMistakes);
}

function fillFlashcardGrid() {
    for (const flashcard of set.flashcards) {
        const div = document.createElement("div");
        div.classList.add("flashcard-grid-item");
        div.addEventListener("click", () => window.location.href = `/set/${set._id}/update-flashcard/${flashcard._id}`);

        const p = document.createElement("p");
        p.textContent = flashcard.text;

        div.appendChild(p);
        grid.appendChild(div);
    }
}

function reviewAll() {
    // Must be at least one flashcard to start reviewing
    if (set.flashcards.length < 1) {
        return;
    }

    let flashcardIds = [];
    for (const card of set.flashcards) {
        flashcardIds.push(card._id);
    }

    // Store ids in local storage
    localStorage.setItem("flashcardIds", JSON.stringify(flashcardIds));

    // Redirect to first flashcard review page
    window.location.href = `/set/${set._id}/review/${flashcardIds[0]}`;
}

function reviewMistakes() {
    if (set.flashcards.length < 1) {
        return;
    }
    
    let flashcardIds = [];
    for (const card of set.flashcards) {
        if (localStorage.getItem(`flashcard:${card._id}:correct`) === "true") {
            continue;
        } 

        // Only add id if not guessed correctly
        flashcardIds.push(card._id);
    }

    // If all cards learned, clear local storage
    if (flashcardIds.length < 1) {
        clearCardGuesses();
        reviewMistakes(); // Call function again
        return;
    }

    // Store ids in local storage
    localStorage.setItem("flashcardIds", JSON.stringify(flashcardIds));

    // Redirect to first flashcard review page
    window.location.href = `/set/${set._id}/review/${flashcardIds[0]}`;
}

function clearCardGuesses() {
    for (const card of set.flashcards) {
        localStorage.removeItem(`flashcard:${card._id}:correct`);
    }
}

async function changeTitle() {
    const newTitle = newTitleInput.value;
    if (!newTitle || newTitle.length < 3) {
        newTitleInput.value = "";
        newTitleInput.setAttribute("placeholder", "Title required!");
        return;
    }

    const res = await fetch(`/api/sets/${set._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: newTitle
        })
    });
    const data = await res.json();

    if (!res.ok) {
        newTitleInput.value = "";
        newTitleInput.setAttribute("placeholder", data.message);
        return;
    }

    // Reload page
    window.location.href = window.location.pathname;
}

async function deleteSet() {
    const res = await fetch(`/api/sets/${set._id}`, {
        method: "DELETE"
    });

    // Reload page
    if (res.ok) {
        window.location.href = "/dashboard";
    }
}

main();