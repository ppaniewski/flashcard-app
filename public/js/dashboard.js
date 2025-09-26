import { initNavbar } from "/js/utils.js";

let grid;
let addSetInput;

function main() {
    initNavbar();

    // Initialize set grid
    grid = document.querySelector(".grid-container");
    fillSetGrid();

    // Initialize set addition
    const addSetButton = document.getElementById("add-set-button");
    addSetButton.addEventListener("click", addSet);
    addSetInput = document.getElementById("add-set-input");
    addSetInput.addEventListener("keydown", event => {
        if (event.code === "Enter") addSet();
    });
}

async function fillSetGrid() {
    const res = await fetch("/api/sets");
    const sets = await res.json();

    for (const set of sets) {
        const div = document.createElement("div");
        div.classList.add("set-grid-item");
        div.addEventListener("click", () => window.location.href = `/set/${set._id}`);

        const p = document.createElement("p");
        p.textContent = set.title;

        div.appendChild(p);
        grid.appendChild(div);
    }
}

async function addSet() {
    const title = addSetInput.value;
    if (!title || title.length < 3) {
        addSetInput.value = "";
        addSetInput.setAttribute("placeholder", "Title required!");
        return;
    }

    const res = await fetch("/api/sets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title
        })
    });
    const data = await res.json();

    if (!res.ok) {
        addSetInput.value = "";
        addSetInput.setAttribute("placeholder", data.message);
        return;
    }

    // Reload page
    window.location.href = "/dashboard";
}

main();