// Créer les balises figure
function createFigure(appendTo) {
    let figure = document.createElement("figure");
    appendTo.appendChild(figure);

    return figure;
}

// Créer les balises images
function createImage (appendTo, datas) {
    let image = document.createElement("img");
    appendTo.appendChild(image);
    image.src = datas.imageUrl;
    image.alt = datas.title;

    return image;
}

// Créer les balises figcaption
function createFigCaption (appendTo) {
    let figCaption = document.createElement("figcaption");
    appendTo.appendChild(figCaption);

    return figCaption;
}

function createFilter (appendTo) {
    let filter = document.createElement("button");
    appendTo.appendChild(filter);

    return filter;
}

function createParagraph(appendTo) {
    let p = document.createElement("p");
    appendTo.appendChild(p);

    return p;
}

function createLink(appendTo, link) {
    let a = document.createElement("a");
    a.href = link;
    appendTo.appendChild(a);

    return a;
}

function createIcon(appendTo, iconsToAdd) {
    let i = document.createElement("i");
    iconsToAdd.forEach((icon) => {
        i.classList.add(icon);
    })

    appendTo.appendChild(i);

    return i;
}

function createDiv(appendTo) {
    let div = document.createElement("div");
    appendTo.appendChild(div);

    return div;
}

function createOption(appendTo, datas) {
    let option = document.createElement('option');
    option.value = datas.id;
    option.innerHTML = datas.name;

    appendTo.appendChild(option);
}