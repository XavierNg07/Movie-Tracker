const REQUEST_INFO = Object.freeze({
    ACCESS_TOKEN: "access_token",
    API_V1: "API/V1/",
    server: "http://localhost:8080/netflix-clone/API/V1/",
    serverURL: "http://localhost:8080/netflix-clone/API/V1/"
});


const ENDPOINT_KEY = Object.freeze( {
    method: 'method',
    api: 'api',
    requests: 'requests',
    admin: 'admin',
    login: 'login',
    logout: "logout",
    signUp: 'signUp',
    watchList: "watchlist",
    favouritesList : "favouritesList",
    changePassword: "changePassword",
    profile: "profile",
});

const HTTP_METHODS = Object.freeze({
    GET: "GET",
    POST: "POST",
    DELETE: "DELETE",
    PATCH: "PATCH",
});

const TMDB_CONNECTION = Object.freeze({
    API_KEY: "api_key=4a2ecca072789ccd5a6d6e988d88670e", 
    BASE_URL: "https://api.themoviedb.org/3/",
    SEARCH_QUERY: "search/movie",
    MOVIE: "movie/"
});

const MOVIE_CATEGORY = Object.freeze({
    popular: "popular",
    topRated: "top_rated",
    nowPlaying: "now_playing"
});

const RATING_COLOR = Object.freeze({
    good: "#57e32c",
    meh: "#b7dd29",
    sucks: "#ff4545"
});

const readyState = Object.freeze({
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2, 
    LOADING: 3,
    DONE: 4
});

const responseStatus = Object.freeze({
    SUCCESS: 200
});

const MOVIE_STATUS = Object.freeze({
    MOVIE_ADDED: "movie already added"
});