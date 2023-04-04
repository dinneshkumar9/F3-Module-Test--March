// Define the API key and current date in ISO format
const apiKey = "uqvYh76vQuis0Tx4pyOpmmfChUdcUuRAcV44RYMs";
const currentDate = new Date().toISOString().split("T")[0];

// Get references to search form elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// Get references to search history elements
const searchHistory = document.getElementById("search-history");
const searchButton = document.getElementById("search");

// Get references to current image elements
const currentImageContainer = document.getElementById(
  "current-image-container"
);
// Listen for changes to the search input field
searchInput.addEventListener("input", () => {
  const currentDate = new Date();
  const selectedDate = new Date(searchInput.value);
  if (selectedDate > currentDate) {
    searchInput.setCustomValidity("Invalid date");
    searchButton.disabled = true;
  } else {
    searchInput.setCustomValidity("");
    searchButton.disabled = false;
  }
});

// Listen for the form submit event
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const date = searchInput.value;
  if (date !== "") {
    getImageOfTheDay(date);
  }
});

// On page load, display the image of the day for the current date
window.onload = function () {
  getCurrentImageOfTheDay();
};

// Fetch the image of the day for the current date from the API
function getCurrentImageOfTheDay() {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      renderImage(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Fetch the image of the day for a given date from the API
function getImageOfTheDay(date) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      renderImage(data);

      const searches = getSearches();
      searches.push(date);
      saveSearches(searches);
      renderSearchHistory(searches);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Save the search history to local storage
function saveSearches(searches) {
  localStorage.setItem("searches", JSON.stringify(searches));
}

// Get the search history from local storage
function getSearches() {
  const searches = localStorage.getItem("searches");
  if (searches) {
    return JSON.parse(searches);
  } else {
    return [];
  }
}

// Fetch and display the image of the day for a selected date in the search history
function addSearchToHistory(date) {
  getImageOfTheDay(date);
}

// Render the search history as a list of clickable items
function renderSearchHistory(searches) {
  searchHistory.innerHTML = "";
  searches.forEach((search) => {
    const searchItem = document.createElement("li");
    searchItem.textContent = search;
    searchItem.addEventListener("click", () => {
      addSearchToHistory(search);
    });
    searchHistory.appendChild(searchItem);
  });
}

const searches = getSearches();
renderSearchHistory(searches);

// Clear the search history and local storage
const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => {
  localStorage.clear();
  const searchHistoryList = document.getElementById("search-history");
  searchHistoryList.innerHTML = "";
});

// Render the image of the day for a selected date in the current image container
function renderImage(data) {
  currentImageContainer.innerHTML = `
    <h1>Picture on ${data.date}</h1>
    <img src="${data.url}" alt="${data.title}">
    <p><strong>${data.title}</strong></p>
    <p>${data.explanation}</p>
  `;
}
