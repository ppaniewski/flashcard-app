let usernameField;
let usernameLabel;
let passwordField;
let passwordLabel;
let signInButton;
let buttonLabel;

function main() {
    usernameField = document.getElementById("username-field");
    usernameLabel = usernameField.labels[0];
    passwordField = document.getElementById("password-field");
    passwordLabel = passwordField.labels[0];
    signInButton = document.getElementById("sign-in-button");
    buttonLabel = document.getElementById("button-label");

    signInButton.addEventListener("click", validateLogin);
    document.getElementById("register-button").addEventListener("click", () => window.location.href = "/register");
}

async function validateLogin() {
    const username = usernameField.value;
    const password = passwordField.value;

    if (!username) {
        insertLabelMessage(usernameLabel, "Username is required!");
        return;
    }

    if (!password) {
        insertLabelMessage(passwordLabel, "Password is required!");
        return;
    }

    const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    if (!res.ok) {
        insertLabelMessage(buttonLabel, "Username or password is incorrect");
        return;
    }
    
    window.location.href = "/dashboard";
}

function insertLabelMessage(label, text) {
    label.textContent = text;
    label.classList.remove("visually-hidden");
    label.classList.add("warning-label");
}

main();