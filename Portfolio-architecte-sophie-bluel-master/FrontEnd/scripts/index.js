window.addEventListener("load", (event) => {
    changeLoginBtn();
    getProjects()
        .then(projects => {
            generateProjects(projects, "null");
            createProjectModal(projects);
            getCategories().then(categories => {
                createModaleSelect(categories);
                if (!isConnected()) {
                    generateCategoriesFilters(categories);
                    filterCategories(projects, categories);
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