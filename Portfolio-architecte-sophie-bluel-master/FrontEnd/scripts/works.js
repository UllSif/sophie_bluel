// Récupération des projets
async function getProjects() {
    let datas = "";
    try {
        const response = await fetch("http://localhost:5678/api/works");
        datas = await response.json();
        return datas;
    }
    catch {
        let p = createParagraph(document.querySelector('.gallery'));
        p.classList.add("error");
        p.innerHTML = "Une erreur est survenue lors de la récupération des projets<br><br>" +
            "Une tentative de reconnexion automatique auras lieu dans une minute<br><br><br><br>" +
            "Si le problème persiste, veuillez contacter l'administrateur du site";
        await new Promise(resolve => setTimeout(resolve, 60000));
    }
}

// Récupération des catégories
async function getCategories () {
    let categories = "";
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        categories = await response.json();
        return categories;
    }
    catch {
        let p = createParagraph(document.querySelector('.filters'));
        p.classList.add("error");
        await new Promise(resolve => setTimeout(resolve, 60000));
    }
}

// Génération du contenu html figure/img/figcaption
function generateProjects(datas, categorie) {
    if (datas !== "") {
        document.querySelector(".gallery").innerHTML = "";
        datas.forEach((data) => {
            // On affiche tous les projets si categorie est null
            if (categorie === "null") {
                createProjects(data);
            }
            // On affiche les projets par catégorie
            else if (data.categoryId == categorie) {
                createProjects(data);
            }
        });
    }
}

// Creation des images
function createProjects(data) {
    let figure = createFigure(document.querySelector(".gallery"));
    figure.classList.add("work_" + data.id);
    let image = createImage(figure, data);

    let figCaption = createFigCaption(figure);
    figCaption.innerHTML = data.title;
}

// Génération des filtres catégories
function generateCategoriesFilters(datas) {
    if (datas !== "") {
        // Premier filtre initialisé avec un id null
        let filter = createFilter(document.querySelector(".filters"));
        filter.innerHTML = "Tous";
        filter.classList.add("filter-btn");
        filter.classList.add("filter-btn-active");
        filter.setAttribute("id", "filter_null");

        // Ajout des filtres catégories
        datas.forEach((data) => {
            filter = createFilter(document.querySelector(".filters"));
            filter.innerHTML = data.name;
            filter.classList.add("filter-btn");
            filter.setAttribute("id","filter_" + data.id);
        });
    }
}

// Filtrer les catégories
function filterCategories(projects) {
    let filters = document.querySelectorAll(".filters button");
    filters.forEach((filter) => {
        let filterId = filter.id;
        filterId = filterId.replace("filter_", "");

        filter.addEventListener("click", () => {

            // On retire la class filter-btn-active de tous les boutons
            filters.forEach((btn) => {
                btn.classList.remove("filter-btn-active");
            });

            // On ajoute la class au bouton actif
            filter.classList.add("filter-btn-active");
            generateProjects(projects, filterId);
        });
    });
}



// Modification du bouton login en logout
function changeLoginBtn() {
    let btnLogin = document.getElementById("login");
    if (isConnected()) {
        btnLogin.innerHTML = "logout";
        btnLogin.addEventListener("click", () => {
            logout();
            window.location.href = "index.html";
        });
        addModifierBtn();
        addEditionRod();
    }
}

// Ajout du bouton de modification admin
function addModifierBtn() {
    let projectTitle = document.querySelector(".portfolio-title");
    let div = createDiv(projectTitle);
    let icon = createIcon(div, ["fa-solid", "fa-pen-to-square"]);
    let link = createLink(div, "#modale");
    link.innerText = " Modifier";
    link.classList.add("js-modale");
    link.addEventListener('click', () => {
        displayModale(document.getElementById("modale"));
        document.getElementById("modale-portfolio").classList.remove('hidden');
        document.getElementById("modale-add-project").classList.add('hidden');
    });

    document.getElementById("modale-validate-add-btn").addEventListener('click', (e) => {
        addWork(e, "add");
    });
}

function addEditionRod() {
    let div = createDiv(document.querySelector("body"));
    div.classList.add("admin-rod");
    let div2 = createDiv(div);
    let icon = createIcon(div2, ["fa-solid", "fa-pen-to-square"]);
    // icon.innerHTML = "Mode édition"
    // icon.classList.add("edit-mode");

    // let p = createParagraph(div2);
    // p.innerText = " Mode édition";
    // div2.innerHTML =  icon + " Mode édition";
    let link = createLink(div2, "#modale");
    link.innerText = " Modifier";


    div2.addEventListener('click', () => {
        displayModale(document.getElementById("modale"));
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

// Fonction de deconnection
function logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
}