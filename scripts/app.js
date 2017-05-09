let selectElem = document.querySelector("select");
let ulLeftElem = document.querySelector(".left ul");
let ulRightElem = document.querySelector(".right ul");
let formElem = document.querySelector("form");
let apiURL = "http://localhost:3000";
let vkUrl = "https://vk.com/";

attachHandlers();

getCategories()
    .then(data => {
        let categories = JSON.parse(data).categories;
        renderCategories(categories);
        return categories[0];
    })
    .then(category => {
        getGroups(category.id)
            .then(groups => {
                renderGroups(JSON.parse(groups).items, ulRightElem);
            });
    });


function attachHandlers() {
    selectElem.addEventListener("change", handleChange);
    formElem.addEventListener("submit", handleSearch);
}

function getCategories() {
    return ajaxHelper("GET", `${apiURL}/getCatalogInfo`);
}

function getGroups(categoryId) {
    return ajaxHelper("GET", `${apiURL}/getCatalog?category_id=${categoryId}`);
}

function searchGroups(text) {
    return ajaxHelper("GET", `${apiURL}/searchGroups?text=${text}`);
}

function renderCategories(data) {
    data.forEach(item => {
        let option = document.createElement("option");
        option.innerText = item.name;
        option.setAttribute("value", item.id);
        selectElem.append(option)
    });
}

function renderGroups(data, element) {
    data.forEach(item => {
        let li = document.createElement("li");
        let a = document.createElement("a");

        a.setAttribute("href", `${vkUrl+item.screen_name}`);
        a.setAttribute("target", "_blank");

        let img = document.createElement("img");
        img.setAttribute("src", item.photo_100);
        a.appendChild(img);

        let p = document.createElement("p");
        p.innerText = item.name;
        a.appendChild(p);

        li.appendChild(a);
        element.append(li);
    });
}

function handleChange(event) {
    let categoryId = event.target.value;
    getGroups(categoryId)
        .then(groups => {
            cleanGroups(ulRightElem);
            renderGroups(JSON.parse(groups).items, ulRightElem);
        });
}

function cleanGroups(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function ajaxHelper(method, url) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.open(method, url);
        req.send();
        req.onload = onLoad;


        function onLoad() {
            if(req.status == 200) {
                resolve(this.response);
            } else {
                reject(this.responseText);
            }
        }
    });
}

function handleSearch() {
    event.preventDefault();
    if(this.text.value) {
        searchGroups(this.text.value)
            .then(data => {
                cleanGroups(ulLeftElem);
                renderGroups(JSON.parse(data).items, ulLeftElem);
            })
    } else {
        cleanGroups(ulLeftElem);
    }
}