// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~ API News ~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// ==== Sélections ====
const btnCategory       = document.querySelectorAll("button");
const nav               = document.querySelector("nav");
// Formulaire source
const inputSourceName   = document.querySelector("#source-name");
const btnSearchSource   = document.querySelector(".btn-search");
// Pagination
const previousPage      = document.querySelector(".previous");
const nextPage          = document.querySelector(".next");
const scorePage         = document.querySelector(".current-page");
// Affichage
const displayNews       = document.querySelector(".display-news");

// ==== Variables ====
let currentPage = 1;
let nextPageId = null; // sotcker l'id de la page suivante

// ==== Fonctions utilitaires ==== 
function createElement(tag, className, content) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }
    if (content) {
        element.innerHTML = content;
    }
    return element;
}
function appendElement(parent, child) {
    parent.append(child);
}

// ==== Fonctions Fetch => API ====
async function getApi(language = "fr, en", search, category, pageId = null) {
    try {
        let fetchUrl = `https://newsdata.io/api/1/latest?apikey=pub_bc74ea75721f46efb28f670daf40279a&language=${language}`;
        if (search) {
            fetchUrl += `&q=${search}`;
        }
        if (pageId) {
            fetchUrl += `&page=${pageId}`;
        }
        if (category) {
            fetchUrl += `&category=${category}`
        }

        const response = await fetch(fetchUrl);
        const data = await response.json();

        console.log(data, "data");
        
        return data
    }
    catch (error) {
        console.error(error);
    }
}

// ==== Fonctions affichage ====
async function displayApi(language = "fr, en", search, category, pageId = null) {
    // Vider le contenu de la balise d'affichage
    displayNews.innerHTML = "";

    // Appel de résultats
    const articles = await getApi(language, search, category, pageId);

    articles.results.forEach(article => {

        if (article.title && article.description) {
            // Déterminer les éléments à récupérer dans mon api par article
            const title                 = article.title;
            const date                  = article.pubDate;
            const img                   = article.image_url ? article.image_url : `./img/no-img-available_V2.jpg`;
            const description           = article.description;
            const sourceName            = article.source_name;
            const sourceUrl             = article.source_url;

            // Créer les cartes articles
            const articleTag            = createElement("article", "article", "");
            const articleTitle          = createElement("a", "article__title", `${title}`);
            articleTitle.setAttribute("href", `${sourceUrl}`);
            const articleDate           = createElement("small", "article__date", `${date}`);
            const articleImg            = createElement("a", "article__img", `<img src="${img}" alt="">`);
            articleImg.setAttribute("href", `${sourceUrl}`);
            const articleDescription    = createElement("p", "article__description", `${description}`);
            const articleSourceName     = createElement("cite", "article__source", `${sourceName}`);
            const articleSourceUrl      = createElement("a", "url", `${sourceUrl}`);
            articleSourceUrl.setAttribute("href", `${sourceUrl}`);

            // Insérer les articles
            appendElement(displayNews, articleTag);
            appendElement(articleTag, articleTitle);
            appendElement(articleTag, articleDate);
            appendElement(articleTag, articleImg);
            appendElement(articleTag, articleDescription);
            appendElement(articleTag, articleSourceName);
            appendElement(articleSourceName, articleSourceUrl);
        }
    });

    // Pagination
    nextPageId = articles.nextPage;

    // Mettre à jour l'état des boutons de pagination
    previousPage.disabled   = currentPage <= 1;
    nextPage.disabled       = !nextPageId;
    scorePage.textContent   = currentPage;
}



// ==== Evénéments ====
    // ---- Pagination ----
previousPage.addEventListener("click", function (event) {
    event.preventDefault();

    if (currentPage > 1) {
        currentPage--;
        displayApi()
    }
})
nextPage.addEventListener("click", function (event) {
    event.preventDefault();

    if (nextPageId) {
        currentPage++;
        displayApi("fr, en", null, null, nextPageId)
    }
})

    // ---- Choix catégorie ----
nav.addEventListener("click", function (event) {
    event.preventDefault();

    btnCategory.forEach(button => {
        button.classList.remove("active")
    })

    if (event.target.classList.contains("latest")) {
        displayApi()
        event.target.classList.add("active")

    } else if (event.target.dataset.category) {
        const category = event.target.dataset.category

        displayApi("fr, en", null, category, null)
        event.target.classList.add("active")
    }
})

    // ---- Recherche par mots-clefs ----
btnSearchSource.addEventListener("click", function (event) {
    event.preventDefault();

    const search = inputSourceName.value;

    displayApi("fr, en", search, null, null)
    inputSourceName.value = "";
})


// ==== Afficher les articles de la 1ère page ====
displayApi()



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~ API Ip ~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ==== Sélections ====
const displayIpAddress = document.querySelector(".display-ip-address");

// ==== Fonctions Fetch => API ====
async function getApiIp() {
    try {
        let fetchUrl = `https://api.ipstack.com/check?access_key=1bf707cc4165474eaef5a97ee7bc8732`;

        const response = await fetch(fetchUrl);
        const data = await response.json();

        console.log(data, "data ip address");

        if (displayIpAddress) {
            displayIpAddress.innerHTML = 
                `<h2>IP address :</h2>
                <p><strong>Adresse IP:</strong> ${data.ip}</p>
                <p><strong>Pays:</strong> ${data.country_name}</p>
                <p><strong>Code Postal:</strong> ${data.zip}</p>
                <p><strong>Latitude:</strong> ${data.latitude.toFixed(2)}</p>
                <p><strong>Longitude:</strong> ${data.longitude.toFixed(2)}</p>
                `;
        }

        return data;
    } catch (error) {
        console.error(error);
        if (displayIpAddress) {
            displayIpAddress.innerHTML = "Failed to fetch IP address.";
        }
    }
}

getApiIp();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~ API Weather ~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ==== Sélections ====
const displayWeather = document.querySelector(".display-weather");

// ==== Fonctions Fetch => API ====
async function getApiWeather() {
    try {
        let fetchUrl = `https://api.weatherstack.com/current?access_key=c2e5cc26744b6c5b51a6097b6f31d607&query=fetch:ip`;

        const response = await fetch(fetchUrl);
        const data = await response.json();

        console.log(data, "data Weather");

        if (displayWeather) {
            displayWeather.innerHTML = 
                `<h2>Weather:</h2>
                <p><strong>Ville:</strong> ${data.location.name}</p>
                <p><strong>Heure d'observation de la météo:</strong> ${data.current.observation_time}</p>
                <p><strong>Température:</strong> ${data.current.temperature}°</p>
                <p><strong>Humidité:</strong> ${data.current.humidity}%</p>
                <p><strong>Description:</strong> ${data.current.weather_descriptions[0]}</p>
                <div><img src="${data.current.weather_icons[0]}" alt=""></div>
                `;
        }
        return data;

    } catch (error) {
        console.error(error);
        displayWeather.innerHTML = "Failed to fetch Weather.";
    }
}
getApiWeather()

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~ API Market ~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ==== Sélections ====
const displayMarket = document.querySelector(".display-market");

// ==== Variables ====
// Liste des indices des pays
const countryIndices = {
    'Belgium': 'belgium_bel20',
    'France': 'france_cac40',
    'USA': 'usa_sp500',
    'Japan': 'japan_nikkei',
    'China': 'china_sse'
};

// ==== Fonctions Fetch => API ====
async function getApiMarket() {
    try {
        let tableHTML = `
            <h2>Stock Market Index Info</h2>
            <table>
            <thead>
                <tr>
                    <th>Country</th>
                    <th>Index</th>
                    <th>Price</th>
                    <th>Change</th>
                    <th>% Change</th>
                </tr>
            </thead>
            <tbody>
        `;

        for (const [country, index] of Object.entries(countryIndices)) {
            let fetchUrl = `https://api.marketstack.com/v2/indexinfo?access_key=b74b6340757487e4a5d83d304540a97d&index=${index}`;
            const response = await fetch(fetchUrl);
            const data = await response.json();

            console.log(data, `Data for ${country}`);

            if (data && data.data) {
                const symbolData = data.data;
                const change = symbolData.close - symbolData.open;
                const changePct = ((symbolData.close - symbolData.open) / symbolData.open) * 100;

                tableHTML += `
                    <tr>
                        <td>${country}</td>
                        <td>${index}</td>
                        <td>${symbolData.close}</td>
                        <td style="color: ${change >= 0 ? 'green' : 'red'}">${change.toFixed(2)}</td>
                        <td style="color: ${changePct >= 0 ? 'green' : 'red'}">${changePct.toFixed(2)}%</td>
                    </tr>
                `;
            }
        }

        tableHTML += `
            </tbody>
            </table>
        `;

        displayMarket.innerHTML = tableHTML;
    } catch (error) {
        console.error(error);
        displayMarket.innerHTML = "Failed to fetch market data.";
    }
}
getApiMarket();
