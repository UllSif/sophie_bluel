function login() {
    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }

    let loginEmailError = document.querySelector(".login-mail-error");
    let loginMdpError = document.querySelector(".login-password-error");
    loginEmailError.innerHTML = "";
    loginMdpError.innerHTML = "";

    // Vérification adresse mail
    if (!user.email.includes('@')) {
        let p = createParagraph(loginEmailError);
        p.innerHTML = "Veuillez entrer une addresse mail valide";
        return;
    }

    // Vérification mot de passe
    if (user.password.length < 5) {
        let p = createParagraph(loginMdpError);
        p.innerHTML = "Veuillez entrer un mot de passe valide";
        return;
    }

    else {
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(result => {
                if (result.error || result.message) {
                    let p = createParagraph(loginEmailError);
                    p.innerHTML = "La combinaison e-mail/mot de passe est incorrecte";
                    p = createParagraph(loginMdpError);
                    p.innerHTML = "La combinaison e-mail/mot de passe est incorrecte";
                } else if (result.token) {
                    localStorage.setItem("userId", result.userId);
                    localStorage.setItem("token", result.token);
                    window.location.href = "index.html";
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
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