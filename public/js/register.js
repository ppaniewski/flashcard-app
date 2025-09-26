let usernameField;
let usernameLabel;
let passwordField;
let passwordConfirmField;
let passwordLabel;
let signInButton;
let buttonLabel;

function main() {
    usernameField = document.getElementById("username-field");
    usernameLabel = usernameField.labels[0];
    passwordField = document.getElementById("password-field");
    passwordConfirmField = document.getElementById("password-confirm-field");
    passwordLabel = passwordField.labels[0];
    signInButton = document.getElementById("sign-in-button");
    buttonLabel = document.getElementById("button-label");

    signInButton.addEventListener("click", registerUser);
    document.getElementById("login-button").addEventListener("click", () => window.location.href = "/login");
}

async function registerUser() {
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

    if (!passwordConfirmField || passwordConfirmField.value !== password) {
        insertLabelMessage(passwordLabel, "Passwords have to match!");
        return;
    }

    const res = await fetch("/api/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await res.json();

    if (!res.ok) {
        insertLabelMessage(usernameLabel, data.message);
        return;
    }

    window.location.href = "/login";
}

function insertLabelMessage(label, text) {
    label.textContent = text;
    label.classList.remove("visually-hidden");
    label.classList.add("warning-label");
}

main();