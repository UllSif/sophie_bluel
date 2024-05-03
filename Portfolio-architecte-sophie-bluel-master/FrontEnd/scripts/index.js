window.addEventListener("load", (event) => {
    // Si on est connecté, on affiche le contenu administrateur
    changeLoginBtn();
    // On récupère les projets
    getProjects()
        .then(projects => {
            // On génère tous les travaux
            generateProjects(projects, "null");
            // On génère les travaux dans la modale
            createProjectModal(projects);
            // On récupère les catégories
            getCategories()
                .then(categories => {
                    // On créer le menu <select> dans la modale
                    createModaleSelect(categories);
                    if (!isConnected()) {
                        // Si on est pas connecté, on affiche les filtres
                        generateCategoriesFilters(categories);
                        filterCategories(projects);
                    }
                }).catch(error => {
                console.error("Failed to load categories:", error);
            });
        })
        .catch(error => {
            let p = createParagraph(document.querySelector('.gallery'));
            p.classList.add("error");
            p.innerHTML = "Une erreur est survenue lors de la récupération des projets<br><br>" +
                "Une tentative de reconnexion automatique auras lieu dans une minute<br><br><br><br>" +
                "Si le problème persiste, veuillez contacter l'administrateur du site";
        });
});