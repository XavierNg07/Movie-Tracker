const movieList = document.querySelector("#favList_container");
const homePage = "../html/index.html";

/**
 * Gets the movie information.
 */
GETMovies = () => {
    fetch(REQUEST_INFO.serverURL + ENDPOINT_KEY.favouritesList, {
        method: HTTP_METHODS.GET,
        credentials: "include",
    }).then(response => { if (response.ok) return response.json();})
        .then(data => {
            if (data) {
                for (let i = 0; i < data.movies.length;  i++){
                    let newMovie = displayMovie(data.movies[i]);
                    movieList.appendChild(newMovie);
                }
            } else {
                window.location.href = homePage;
            }
        });   
}

/**
 * Deletes the movie from the favourites list
 * @param {*} id string movie id
 */
DELETEMovie = (id) => {
    fetch(REQUEST_INFO.serverURL + ENDPOINT_KEY.favouritesList + "/" + id, {
        method: HTTP_METHODS.DELETE,
        credentials: "include",
    }).then(response => { if (response.ok) return response.json();})
}

/**
 * Pick the correct color for each movie rating depending
 * on their value.
 * @param {*} value 
 * @returns rgb string
 */
decideRating = (value) => {
    if (value <= 4) {
        return RATING_COLOR.sucks;
    } else if (value > 4 && value <= 7) {
        return RATING_COLOR.meh;
    } else {
        return RATING_COLOR.good;
    }
}

/**
 * creates a div element with the movie information in it
 * @param {*} movieObj 
 * @returns div element
 */
createMovieElement = (movieObj) => {
    let movie = document.createElement('div');
    movie.classList.add("movielist");
    let movieTitle = document.createElement('p');
    movieTitle.classList.add("movieItemName");
    movieTitle.textContent = "Name: " + movieObj["movie_name"];
    let movieDescription = document.createElement('p');
    movieDescription.classList.add("movieItemInfo");
    movieDescription.textContent = "Overview: " + movieObj["movie_overview"];
    let movieRating = document.createElement('p');
    movieRating.classList.add("movieItemRating");
    movieRating.style.backgroundColor = decideRating(parseFloat(movieObj["movie_rating"]));
    movieRating.textContent = "Rating: " + movieObj["movie_rating"];
    movie.appendChild(movieTitle);
    movie.appendChild(movieRating);
    return movie;
}

/**
 * Displays movie information in a list
 * @param {} movieObj 
 * @returns list
 */
displayMovie = (movieObj) => {
    let parentDiv = document.createElement('div');
    parentDiv.classList.add("movieItem");
    let movieImg = document.createElement('img');
    movieImg.classList.add("movieItemImg");
    let removeMovie = document.createElement('button');
    removeMovie.classList.add("movielist_remove_btn");
    removeMovie.textContent = "Remove";
    removeMovie.onclick = () => { parentDiv.remove();
    DELETEMovie(movieObj["id"]);}
    movieImg.src = movieObj["movie_poster_path"];
    let movieElement = createMovieElement(movieObj);
    movieElement.appendChild(removeMovie);
    parentDiv.appendChild(movieImg);
    parentDiv.appendChild(movieElement);
    return parentDiv;
}