function login() {
    let user = {
        email: email.value,
        password: password.value
    }

    getUser(user);
}

function getUser(user) {
    let loginEmailError = document.querySelector(".login-mail-error");
    let loginMdpError = document.querySelector(".login-password-error");

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
                    let p = createParagraph(loginMdpError);
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