// Creating the various with the main API information
const apiKey = "c1ea950c1d9540b621c4e6aef43b3bb4";
const imgApi = "https://image.tmdb.org/t/p/w500";
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;

// Declaring all my variables
const form = document.getElementById("search-form");
const query = document.getElementById("search-input");
const result = document.getElementById("result");
const reset = document.getElementById("search-reset");
let page = 1;
let isSearching = false;

// Creating a connection using Fetch and Async to fetch JSON data from the url
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error in Network response.");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

/*After the connection has been created without giving errors, 
search and show results that came from the URL using Fetch, async and await.*/
async function fetchAndSHOW(url) {
    const data = await fetchData(url);
    if (data && data.results) {
        showResults(data.results);
    }
}

// Creating the function that will create the HTML code for the image of each film.
function createMovieCard(movie) {
    // Creating each of the variables that will be used to shape the film card and will be called in the html code
    const { poster_path, original_title, release_date, overview } = movie;
    const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";
    const truncatedTitle = original_title.length > 15 ? original_title.slice(0, 15) + "..." : original_title;
    const formattedDate = release_date || "No release date";
    // Creating the variable that will shape and create each film card directly in the HTML code
    const cardTemplate = `
        <div class="column">
            <div class="card">
                <a class="card-media" href="./img-01.jpeg">
                    <img src="${imagePath}" alt="${original_title}" width="100%" />
                </a>
                <div class="card-content">
                    <div class="card-header">
                        <div class="left-content">
                        <h3 style="font-weight: 600">${truncatedTitle}</h3>
                        <span style="color: #eada00">${formattedDate}</span>
                        </div>
                    <div class="right-content">
                        <a href="${imagePath}" target="_blank" class="card-button">See Cover</a>
                    </div>
                </div>
                <div class="info">
                    ${overview || "No overview yet..."}
                </div>
            </div>
        </div>
    </div>
    `;
    return cardTemplate;
}

// Clear Search
function clearResults() {
    result.innerHTML = "";
}

// Creating a function to show results on the page or display a Nothing found message
function showResults(item) {
    const newContent = item.map(createMovieCard).join("");
    result.innerHTML += newContent || "<p>Nothing Founded.</p>";
}

// Creating a function that makes the page load more results automatically just by scrolling down.
async function loadMoreResults() {
    if (isSearching) {
        return;
    }
    page++;
    const searchTerm = query.value;
    const url = searchTerm ? `${searchUrl}${searchTerm}&page=${page}` : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    await fetchAndSHOW(url);
}

// A function to detect the end of the page and when detected call the function to load more results
function detectEnd() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreResults();
    }
}

// Control the search / clear the screen / make a connection / call the URL of the API responsible for the search / deal with errors.
async function handleSearch(e) {
    e.preventDefault();
    const searchTerm = query.value.trim();
    if (searchTerm) {
        isSearching = true;
        clearResults();
        const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
        await fetchAndSHOW(newUrl);
        query.value = "";
    }
}

// Isolated and out-of-function events
form.addEventListener('submit', handleSearch);
reset.addEventListener("click",init);
window.addEventListener('scroll', detectEnd);
window.addEventListener('resize', detectEnd);

// Initialize the page
async function init() {
    clearResults();
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    isSearching = false;
    await fetchAndSHOW(url);
}

init();