// Afficher la modale
async function displayModale(modale) {
    modale.style.display = "flex";
    modale.style.alignItems = "center";
    modale.style.justifyContent = "center";

    // Clique sur la croix pour fermer
    let closeBtn = document.querySelectorAll('.js-modale-close');
    closeBtn.forEach((button) => {
        button.addEventListener('click', () => {
            closeModale(modale);
        });
    });

    // Clique en dehors de la modale
    document.addEventListener('click', (e) => {
        if (e.target === modale) {
            closeModale(modale);
        }
    });

    // Gestion de l'affichage de la partie galerie ou de la partie ajout dans la modale
    document.getElementById("modale-add-btn").addEventListener('click', () => {
        document.getElementById("modale-portfolio").classList.add('hidden');
        document.getElementById("modale-add-project").classList.remove('hidden');
    });
    document.querySelector(".js-modale-return").addEventListener('click', () => {
        document.getElementById("modale-portfolio").classList.remove('hidden');
        document.getElementById("modale-add-project").classList.add('hidden');
    });

    // Génération de la liste des catégories dans le formulaire d'ajout
    document.querySelector(".modale-projet-form").reset();
    document.querySelector('.add-image-preview').style.display = 'none';
    document.querySelector('.add-image').style.display = 'flex';

    document.querySelector(".js-image").addEventListener("change", () => {
        let newPhoto = document.querySelector(".js-image").files[0];

        if (newPhoto != "") {
            document.querySelector('.add-image-preview').innerHTML = "";
            let img = document.createElement("img");
            img.src = "./assets/images/"+document.querySelector(".js-image").files[0].name;
            img.classList.add("form-group-photo-img");

            document.querySelector('.add-image-preview').appendChild(img);
            document.querySelector('.add-image-preview').style.display = 'flex';
            document.querySelector('.add-image').style.display = 'none';
        }
    });

    document.getElementById("modale-validate-add-btn").style.backgroundColor = 'grey';
    document.getElementById("modale-validate-add-btn").style.border = '2px solid grey';

    let imgInput = document.getElementById("photo");
    let titleInput = document.getElementById("titre");
    let categoryInput = document.getElementById("categorie");

    imgInput.addEventListener('change', () => {checkForm(imgInput, titleInput, categoryInput)});
    titleInput.addEventListener('input', () => {checkForm(imgInput, titleInput, categoryInput)});
    categoryInput.addEventListener('change', () => {checkForm(imgInput, titleInput, categoryInput)});
}

function checkForm(imgInput, titleInput, categoryInput) {
    if (imgInput.files[0] !== '' && titleInput.value !== '' && categoryInput.value !== 'null') {
        // Changement du bouton si tout les champs sont remplis
        document.getElementById("modale-validate-add-btn").style.backgroundColor = '#1D6154';
        document.getElementById("modale-validate-add-btn").style.border = '2px solid #1D6154';
        resetErrorMessage(document.querySelector(".modale-add-img-error"),
            document.querySelector(".modale-add-title-error"),
            document.querySelector(".modale-add-category-error"))
    } else {
        document.getElementById("modale-validate-add-btn").style.backgroundColor = 'grey';
        document.getElementById("modale-validate-add-btn").style.border = '2px solid grey';
        resetErrorMessage(document.querySelector(".modale-add-img-error"),
            document.querySelector(".modale-add-title-error"),
            document.querySelector(".modale-add-category-error"))
    }
}

function resetErrorMessage(img, title, category) {
    img.innerHTML = "";
    title.innerHTML = "";
    category.innerHTML = "";
}

function createModaleSelect (categories) {
    createOption(document.querySelector(".form-group-id select"), {id: "null", name: ""})
    categories.forEach((category) => {
        createOption(document.querySelector(".form-group-id select"), category);
    });
}

// Affichage de la gallerie dans la modale
async function createProjectModal(projects) {
    document.querySelector('.modale-gallery').innerHTML = "";

    projects.forEach((project) => {
        createProjects(project, true);
    });
}

// Suppression d'un projet au clique sur l'icone de poubelle, dans la modale
async function deleteProjectModal(id) {
    let token = localStorage.getItem("token");
    await fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {Authorization: `Bearer ` + token}
    })
        .then(response => {
            if (response.status === 204) {
                console.log("Suppression du projet numero " + id);
                refreshProjet(id);
            } else if (response.status === 401) {
                console.log(response)
                alert("vous n'êtes pas autorisé à supprimer un projet");
            }
        })
        .catch(error => {
            console.log(error);
        });
}

// Ajout d'un projet à la galerie
async function addWork(event) {
    // On empèche le rechargement de la page au clique sur le bouton du formulaire
    event.preventDefault();

    // On récupère les données des champs du formulaire
    let title = document.querySelector(".js-title").value;
    let categoryId = document.querySelector(".js-categoryId").value;
    let image = document.querySelector(".js-image").files[0];

    // Gestion des erreurs
    let imgError = document.querySelector(".modale-add-img-error");
    let titleError = document.querySelector(".modale-add-title-error");
    let categoryError = document.querySelector(".modale-add-category-error");
    imgError.innerHTML = "";
    titleError.innerHTML = "";
    categoryError.innerHTML = "";

    if (title === "" || categoryId === "" || image === undefined) {
        let p = createParagraph(imgError);
        p.innerHTML = "Veuillez remplir tous les champs";
        p = createParagraph(titleError);
        p.innerHTML = "Veuillez remplir tous les champs";
        p = createParagraph(categoryError);
        p.innerHTML = "Veuillez remplir tous les champs";
        return;
    } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
        let p = createParagraph(categoryError);
        p.innerHTML = "Veuillez sélectionner une catégorie valide";
        return;
    } else {
        try {
            let formData = new FormData();
            formData.append("title", title);
            formData.append("category", categoryId);
            formData.append("image", image);

            let response = await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: {Authorization: "Bearer " + localStorage.getItem("token")},
                    body: formData
                }
            );

            if (response.status === 201) {
                let data = await response.json();
                alert("Projet ajouté avec succès");
                refreshProjet(0, data);
                document.querySelector(".modale-projet-form").reset();
                closeModale(document.getElementById("modale"));
            } else if (response.status === 400) {
                alert("Merci de remplir tous les champs");
            } else if (response.status === 500) {
                alert("Erreur serveur");
            } else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à ajouter un projet");
                // window.location.href = "login.html";
            }
        } catch (error) {
            console.log(error);
        }
    }
}


// Rafraichir les projets (suite à une suppression ou un ajout)
function refreshProjet(id = 0, data = "") {
    if (id != 0) {
        let projetToDelete = document.querySelector(".work_" + id);
        projetToDelete.style.display = "none";
        document.querySelector(".modale-gallery-work_" + id).style.display = "none";
    }

    if (data !== "") {
        createProjects(data);
        createProjects(data, modale);
    }
}

// Fermer la modale
function closeModale(modale) {
    modale.style.display = "none";
    modale.style.removeProperty("align-items");
    modale.style.removeProperty("justify-content");
}