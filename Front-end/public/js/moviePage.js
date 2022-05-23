const MOVIE_INFO = document.getElementById("movieInfo_container");
const url_string = new URL(window.location.href);
let imgSrc;
const timeout = 2000;

/**
 * Gets the movie from TMDB api and uses 
 * createElement function to display the movie
 */
GetTMDB_Movie_Info = () => {
    let url = TMDB_CONNECTION.BASE_URL + TMDB_CONNECTION.MOVIE
     + url_string.searchParams.get("movieId") + "?" + TMDB_CONNECTION.API_KEY;
    fetch(url).then(response => {
        return response.json();
    })
    .then(data => {
        let movieElement = createMovieElement(data);
        MOVIE_INFO.appendChild(movieElement);
    }); 
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
 * Creates an element that holds the movie information
 * @param {*} movieJson 
 * @returns div
 */
createMovieInfoElement = (movieJson) => {
    let movieInfoDiv = document.createElement("div");
    let movieName = document.createElement("p");
    movieName.classList.add("movieInfoName");
    movieName.innerHTML = movieJson.original_title;
    let movieDesc = document.createElement("p");
    movieDesc.classList.add("movieInfoDesc");
    movieDesc.innerHTML = "<b>Overview: </b>" + movieJson.overview;
    let movieRating = document.createElement("p");
    movieRating.classList.add("movieInfoRating");
    movieRating.style.backgroundColor = decideRating(parseFloat(movieJson.vote_average));
    movieRating.innerHTML = movieJson.vote_average;
    movieInfoDiv.appendChild(movieName);
    movieInfoDiv.appendChild(movieDesc);
    movieInfoDiv.appendChild(movieRating);
    return movieInfoDiv;
}

/**
 * creates movie element with an image to be displayed in the html
 * @param {json object} movieJson 
 * @returns div
 */
createMovieElement = (movieJson) => {
    const base_url = "https://image.tmdb.org/t/p/";
    const file_size = "h632/";
    let parentDiv = document.createElement("div");
    parentDiv.classList.add("movieInfo");
    let img = document.createElement("img");
    img.classList.add("movieInfoImg");
    img.src = base_url + file_size + movieJson.poster_path;
    imgSrc = base_url + "w154/" + movieJson.poster_path;
    let movieElement = createMovieInfoElement(movieJson);
    parentDiv.appendChild(img);
    parentDiv.appendChild(movieElement);
    return parentDiv;
}

/**
 * This function shows the error and then disappear after 2 seconds.
 */
errorAlert = (dataError) => {
    const error = dataError;
    document.getElementById("errorList").innerHTML = error;
    document.getElementById("errorList").hidden = false;
    setTimeout(() => {
        document.getElementById("errorList").hidden = true;
    }, timeout);
}

/**
 * Adds the movie to the Watch List
 */
addToWatchList = () => {
    fetch(REQUEST_INFO.serverURL + ENDPOINT_KEY.watchList, {
        method: HTTP_METHODS.POST,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
            {"name": document.querySelector(".movieInfoName").innerHTML,
             "overview": document.querySelector(".movieInfoDesc").innerHTML, 
            "posterPath": imgSrc, "rating": document.querySelector(".movieInfoRating").innerHTML}, )
        }).then(response => { 
            return response.json();
        }).then(data => {
            if (data.error) { errorAlert(data.error);
            } else { window.location.href = "./watchList.html"; }
        });
}

/**
 * Adds a movie to the Favourites List
 */
addToFavList = () => {
    fetch(REQUEST_INFO.serverURL + ENDPOINT_KEY.favouritesList, {
        method: HTTP_METHODS.POST,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
            {"name": document.querySelector(".movieInfoName").innerHTML, 
            "overview": document.querySelector(".movieInfoDesc").innerHTML, 
            "posterPath": imgSrc, "rating": document.querySelector(".movieInfoRating").innerHTML}, )
    }).then(response => { 
        return response.json();
    }).then(data => {
        if (data.error) { errorAlert(data.error);
        } else { window.location.href = "./favouritesList.html"; }
    });
}