export async function logout() {
    await fetch("/api/users/logout", {
        method: "POST"
    });

    window.location.href = "/login";
}

export async function initNavbar() {
    const logoutButton = document.getElementById("logout-button");
    const dashboardButton = document.getElementById("dashboard-button");
    logoutButton.addEventListener("click", logout);
    dashboardButton.addEventListener("click", () => window.location.href = "/dashboard");
}

export async function getSetInfo() {
    const parts = window.location.pathname.split("/");
    const setId = parts[2];

    const res = await fetch(`/api/sets/${setId}`);

    // Redirect user back to dashboard if set id is invalid
    if (!res.ok) {
        window.location.href = "/dashboard";
        return;
    }

    const set = await res.json();
    return set;
}