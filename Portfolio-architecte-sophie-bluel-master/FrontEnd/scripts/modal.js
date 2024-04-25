// Afficher la modale
async function displayModale(modale) {
    modale.style.display = "flex";
    modale.style.alignItems = "center";
    modale.style.justifyContent = "center";

    createProjectModal();

    // Clique sur la croix pour fermer
    let closeBtn = document.querySelector('.js-modale-close i');
    closeBtn.addEventListener('click', () => {
        closeModale(modale);
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
    let categories = await getCategories();
    categories.forEach((category) => {
        createOption(document.querySelector(".form-group-id select"), category);
    });

    let photoAddDisplay = document.querySelector(".form-group-photo");
    // console.log(photoAddDisplay)
    // // document.querySelector(".form-group-photo").appendChild(photoAddDisplay);
    let photoAddDisplayMod = document.querySelector(".form-group-photo");

    document.querySelector(".js-image").addEventListener("change", () => {
        let newPhoto = document.querySelector(".js-image").files[0];

        if (newPhoto != "") {
            let img = document.createElement("img");
            img.src = "./assets/images/"+document.querySelector(".js-image").files[0].name;
            img.classList.add("form-group-photo-img");
            photoAddDisplayMod.innerHTML = "";
            photoAddDisplayMod.appendChild(img);
        }
    });
}

// Affichage de la gallerie dans la modale
async function createProjectModal() {
    document.querySelector('.modale-gallery').innerHTML = "";
    let projects = await getProjects();

    projects.forEach((project) => {
        let div = createDiv(document.querySelector('.modale-gallery'));
        div.classList.add('gallery-item-modale');

        let img = createImage(div, project);

        let p = createParagraph(div);
        p.classList.add("work_" + project.id, "js-delete-work");

        createIcon(p, ["fa-solid", "fa-trash-can"]);

        p.addEventListener("click", () => {
            deleteProjectModal(project.id);
        });
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
            console.log(response);
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
async function addWork(event, add) {
    // On empèche le rechargement de la page au clique sur le bouton du formulaire
    event.preventDefault();

    // On récupère les données des champs du formulaire
    let title = document.querySelector(".js-title").value;
    let categoryId = document.querySelector(".js-categoryId").value;
    let image = document.querySelector(".js-image").files[0];

    if (title === "" || categoryId === "" || image === undefined) {
        alert("Veuillez remplir tous les champs");
        return;
    } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
        alert("Veuillez sélectionner une catégorie valide");
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
                alert("Projet ajouté avec succès");
                refreshProjet(0, add);
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
async function refreshProjet(id = 0, add = "") {
    createProjectModal();

    if (id != 0) {
        let projetToDelete = document.querySelector(".work_" + id);
        projetToDelete.style.display = "none";
    }

    if (add == "add") {
        let projects = await getProjects();
        generateProjects(projects, "null");
    }
}

// Fermer la modale
function closeModale(modale) {
    modale.style.display = "none";
    modale.style.removeProperty("align-items");
    modale.style.removeProperty("justify-content");
}