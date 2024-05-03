if (document.getElementById("submit")) {
    document.getElementById("submit").addEventListener("click", () => {
        login();
    });
}

// Vérifier si un administrateur est connecté
function isConnected() {
    if (localStorage.getItem("userId")) {
        return true;
    } else {
        return false;
    }
}

// Fonction de deconnexion
function logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
}