document.querySelector(".search").addEventListener("keyup", (e) => {
    searchRestaurant(e);
});

document.querySelector("#sort").addEventListener("click", () => {
    sortResults();
});

document.querySelector("#tag").addEventListener("click", () => {
    filterResults();
});

const cards = document.getElementById('cards');
cards.addEventListener("click", (e) => {
    toggleBookmark(e);
});

const api_url = 'https://jsonplaceholder.typicode.com/todos/1';
const url = "rest.json";
var favRestaurantList = [];
var data;

// async function getData() {
//     const response = await fetch(api_url);
//     var data = await response.json();
//     console.log(data);
//     getCard(data);
// }

async function getData() {
    const response = await fetch(url);
    data = await response.json();
    //console.log(data);
    generateView(data);
}

getData();

function generateView(listOfRestaurants) {
    refreshDisplay();
    listOfRestaurants.map((restaurant, id) => {
        getCard(restaurant);
    });
}

// <i style="font-size:24px" class="fa">&#xf097;</i>

function getCard(listObj) {
    //Create card element
    // const cardBody = document.createElement('div');
    // cardBody.classList = "card-body";

    //Create card content
    const content = `<div class="card" id="${listObj.id}">
    <i id="bookmark-${listObj.id}" class="fa fa-bookmark-o" style="font-size:20px;"></i>
    <p><img src="${listObj.photo}" alt="${listObj.name}" width="200" height="80"/></p>
    <h5>${listObj.name}</h5>
    <h5>${listObj.location}</h5>
    <h5>${listObj.rating}</h5>
    <h5>ETA : ${listObj.eta}</h5>
    </div>`;

    // Append newyly created card element to the container
    cards.innerHTML += content;
    // cardBody.innerHTML += content;
}

function searchRestaurant(e) {
    //var card = document.querySelector(".card");
    //refreshDisplay();
    console.log(e.target.value);
    const resList = data.filter((restaurant) => {
        if (restaurant.name.toLowerCase().includes(e.target.value.toLowerCase())) {
            return restaurant
        }
    });
    generateView(resList);
}


function sortResults() {
    //console.log(e.options[e.selectedIndex].value);
    const sortby = document.getElementById('sort');
    console.log(sortby.options[sortby.selectedIndex].value);
    if (sortby.options[sortby.selectedIndex].value == "Rating") {
        data.sort((a, b) => b.rating - a.rating);
        generateView(data);
    } else if (sortby.options[sortby.selectedIndex].value == "ETA") {
        data.sort((a, b) => a.eta.split(' ')[0] - b.eta.split(' ')[0]);
        generateView(data);
    }
}

function refreshDisplay() {
    var card = cards.lastElementChild;
    while (card) {
        cards.removeChild(card);
        card = cards.lastElementChild;
    }
}

function filterResults() {
    const tag = document.getElementById('tag');

    if (tag.options[tag.selectedIndex].label == "All Cuisines") {
        generateView(data);
    } else {
        var filteredResults = data.filter((restaurant) => {
            var filterRes = restaurant.tags.filter((item) => item === tag.options[tag.selectedIndex].label);
            if (filterRes.length > 0) {
                return restaurant;
            }
        });

        filteredResults.length > 0 ? generateView(filteredResults) : null;
    }
}


function toggleBookmark(e) {
    console.log(e);
    if (document.getElementById(e.target.id)) {
        if (document.getElementById(e.target.id).classList.contains('fa-bookmark-o')) {
            document.getElementById(e.target.id).classList.remove('fa-bookmark-o');
            document.getElementById(e.target.id).classList.add('fa-bookmark');
            if (!favRestaurantList.includes(data.find(restaurant => restaurant.id === e.path[1].id))) {
                favRestaurantList.push(data.find(restaurant => restaurant.id === e.path[1].id));
            }

        } else if (document.getElementById(e.target.id).classList.contains('fa-bookmark')) {
            document.getElementById(e.target.id).classList.remove('fa-bookmark');
            document.getElementById(e.target.id).classList.add('fa-bookmark-o');
            var removeRestaurant = data.find(restaurant => restaurant.id === e.path[1].id);
            if (removeRestaurant) {
                favRestaurantList = favRestaurantList.filter((rest, id) => {
                    return rest.id !== removeRestaurant.id;
                });
            }
        }
    }
}

function displayFavorites() {
    favRestaurantList.length > 0 ? generateView(favRestaurantList) : null;
}
