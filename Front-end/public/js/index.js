const adminPage = document.querySelector("#adminPage");
const searchInput = document.getElementById('searchbar');
const MOVIE_LIST_PARENT = document.getElementById("movieLists");
const NO_RESULT = document.getElementById("noResult");
const currentCategory = document.getElementById("currentCategory");
const popular = document.getElementById("optionPopular");
const topRated = document.getElementById("optionTopRated");
const playing = document.getElementById("optionNowPlaying");
const errorLog = document.getElementById("errorLog");
const moviePage = "./moviePage.html";
const base_url = "https://image.tmdb.org/t/p/";
const file_size = "w154/";


/**
 * Make a request to the TMDB API and return a list of movies.
 */
GetTMDB_Movies = (url) => {
    fetch(url).then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
    }).catch(err => {
        NO_RESULT.style.display = "block";
    }).then(data => {
        MOVIE_LIST_PARENT.innerHTML = '';
        if (data && data.results.length > 0) {
            addMoviesToList(data);
        } else {
            NO_RESULT.style.display = "block";
        }
    }).catch((err) => {
        NO_RESULT.style.display = "block";
    }); 
}

/**
 * Add all movie to the movie list div.
 * @param {} data 
 */
addMoviesToList = (data) => {
    data.results.forEach(movieData => {
        let movieElement = CreateMovieElement(movieData);
        MOVIE_LIST_PARENT.appendChild(movieElement);
        NO_RESULT.style.display = "none";
    });
}

/**
 * Use a movie json to create a movie category html element.
 * @param {} movieJson 
 * @returns 
 */
CreateMovieElement = (movieJson) => {
    let parentDiv = createMovieParent(movieJson);
    let img = createMovieImg(movieJson);

    let movieInfoDiv = createMovieInfoElement(movieJson);

    parentDiv.appendChild(img);
    parentDiv.appendChild(movieInfoDiv);

    return parentDiv;
}

/**
 * The parent element that will hold all the information on the movie.
 * @returns div.
 */
createMovieParent = (movieJson) => {
    let parentDiv = document.createElement("div");
    parentDiv.classList.add("movieItem");
    let shadow = document.createElement("div");
    shadow.classList.add("movieItemShadow");
    parentDiv.onclick = () => {
        window.location.href = moviePage + "?movieId=" + movieJson.id;
    }
    parentDiv.appendChild(shadow);
    return parentDiv;
}

/**
 * Create the element to display the image of the
 * movie.
 * @returns img tag
 */
createMovieImg = (movieJson) => {
    let img = document.createElement("img");
    img.classList.add("movieItemImg");
    img.src = base_url + file_size + movieJson.poster_path;

    return img;
}

/**
 * Create a nested element that holds
 * the name of the movie and it's rating.
 * @returns div
 */
createMovieInfoElement = (movieJson) => {
    let movieInfoDiv = document.createElement("div");
    movieInfoDiv.classList.add("movieItemInfo")
    let movieName = document.createElement("p");
    movieName.classList.add("movieItemName");
    movieName.innerHTML = movieJson.original_title;
    let movieRating = document.createElement("p");
    movieRating.style.backgroundColor = decideRating(movieJson.vote_average);
    movieRating.classList.add("movieItemRating");
    movieRating.innerHTML = movieJson.vote_average;
    movieInfoDiv.appendChild(movieName);
    movieInfoDiv.appendChild(movieRating);
    return movieInfoDiv;
}

/**
 * Pick the correct color for each movie rating depending
 * on their value.
 * @param {*} value 
 * @returns 
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
 * Display the current option and make another request to the API
 */
movieCategoryOptions = () => {
    popular.onclick = () => {
        currentCategory.innerHTML = CATEGORY.Popular;
        GetTMDB_Movies( TMDB_CONNECTION.BASE_URL + `movie/${MOVIE_CATEGORY.popular}` 
            + "?" + TMDB_CONNECTION.API_KEY);
    };
    topRated.onclick = () => {
        currentCategory.innerHTML = CATEGORY.TopRated;
        GetTMDB_Movies( TMDB_CONNECTION.BASE_URL + `movie/${MOVIE_CATEGORY.topRated}` 
            + "?" + TMDB_CONNECTION.API_KEY);
    };
    playing.onclick = () => {
        currentCategory.innerHTML = CATEGORY.NowPlaying;
        GetTMDB_Movies( TMDB_CONNECTION.BASE_URL + `movie/${MOVIE_CATEGORY.nowPlaying}` 
            + "?" + TMDB_CONNECTION.API_KEY);
    };
}

/**
 * Search using the TMDB api.
 */
search = () => {
    let query = searchInput.value;
    let searchURI = TMDB_CONNECTION.BASE_URL + TMDB_CONNECTION.SEARCH_QUERY 
    + "?query=" + query + "&" + TMDB_CONNECTION.API_KEY;
    GetTMDB_Movies(searchURI);
}

/**
 * Display some inital movies when the user sees the movie page.
 */
displayDefaultMovies = () => {
    NO_RESULT.style.display = "none";
    let url = TMDB_CONNECTION.BASE_URL + `movie/${MOVIE_CATEGORY.popular}` + "?" + TMDB_CONNECTION.API_KEY;
    GetTMDB_Movies(url);
}

/**
 * Set the search form by disabling the redirect.
 */
searchSubmit = () => {
    document.getElementById("searchForm").addEventListener('submit', (event) => {
        search();
        event.preventDefault();
    });
}


movieCategoryOptions();
searchSubmit();