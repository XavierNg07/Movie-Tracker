exports.httpStatusCodes = Object.freeze({
    SUCCESS: 200,
    CONFLICT: 409,
    UNAUTHORIZED: 401
});

exports.apiEndpoints = Object.freeze({
    SIGNUP: 1,
    LOGIN: 2,
    LOGOUT: 3,
    ADMIN: 4,
    POST_WATCH_LIST: 5,
    GET_WATCH_LIST: 6,
    DELETE_WATCH_LIST: 7,
    POST_FAVOURITES_LIST: 8,
    GET_FAVOURITES_LIST: 9,
    DELETE_FAVOURITES_LIST: 10,
    CHANGE_PASSWORD: 11,
    PROFILE: 12
});

exports.statusTexts = Object.freeze({
    TOKEN_NOT_FOUND: {error: "token not found"},
    INVALID_TOKEN: {error: "token has expired"},
    SIGNUP_FAILURE: {error: "username already exists"},
    SIGNUP_SUCCESS: {statusText: "account created successfully"},
    LOGIN_FAILURE: {error: "credentials don't match an account in the system"},
    LOGIN_SUCCESS: {statusText: "login successfully"},
    LOGOUT_SUCCESS: {statusText: "logout successfully"},
    UNAUTHORIZED: {error: "unauthorized"},
    WATCHLIST_FAILURE: {error: "movie already added to watchlist"},
    WATCHLIST_SUCCESS: {statusText: "movie successfully added to watchlist"},
    FAVOURITES_LIST_FAILURE: {error: "movie already added to favourites list"},
    FAVOURITES_LIST_SUCCESS: {statusText: "movie successfully added to favourites list"},
    WATCHLIST_REMOVAL: {statusText: "movie successfully removed from watchlist"},
    FAVOURITES_LIST_REMOVAL: {statusText: "movie successfully removed from favourites list"},
    PASSWORD: {statusText: "password successfully changed"}
});

exports.sqlCommands = Object.freeze({
    SELECT: "SELECT",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
    INSERT_INTO: "INSERT INTO"
});

exports.resources = Object.freeze({
    SIGNUP: "signUp",
    LOGIN: "login",
    LOGOUT: "logout",
    ADMIN: "admin",
    WATCHLIST: "watchlist",
    FAVOURITES_LIST: "favouritesList",
    PASSWORD: "changePassword",
    PROFILE: "profile"
});

exports.CORS = Object.freeze({
    CREDENTIALS: {field: "Access-Control-Allow-Credentials", value: "true"},
    ORIGIN: {field: "Access-Control-Allow-Origin", value: "https://comp-4537-project-ckelo.ondigitalocean.app/"},
    METHODS: {field: "Access-Control-Allow-Methods", value: "GET, POST, PUT, PATCH, DELETE, OPTIONS"},
    HEADERS: {field: "Access-Control-Allow-Headers", value: "Content-Type"}
});

