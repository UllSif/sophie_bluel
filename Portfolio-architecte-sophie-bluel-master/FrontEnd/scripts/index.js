async function main() {
    changeLoginBtn();
    let projects = await getProjects();
    generateProjects(projects, "null");
    if (!isConnected()) {
        let categories = await getCategories();

        generateCategoriesFilters(categories);
        filterCategories(projects, categories);
    }
}

main();