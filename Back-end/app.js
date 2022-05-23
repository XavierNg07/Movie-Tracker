require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser');
const mo = require("./modules/utils");
const constants = require("./modules/constants");
const endpointRoot = "/netflix-clone/API/V1/";
const param = "/:id";
const port = 8080;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
        extended: true
    })
);

app.use((req, res, next) => {
    res.header(constants.CORS.CREDENTIALS.field, constants.CORS.CREDENTIALS.value);
    res.header(constants.CORS.ORIGIN.field, req.headers.origin);
    res.header(constants.CORS.METHODS.field, constants.CORS.METHODS.value);
    res.header(constants.CORS.HEADERS.field, constants.CORS.HEADERS.value);
    next();
});

app.post(`${endpointRoot}${constants.resources.SIGNUP}`, async (req, res) => {
    const hashed = await mo.hashPasswords(req.body.password);
    const userStatement = `INSERT INTO user(username, password) VALUES("${req.body.username}", "${hashed}");`;
    const endpointStatement = `UPDATE endpoint SET requests = requests + 1 WHERE id = ${constants.apiEndpoints.SIGNUP};`;
    mo.handleQueries(endpointStatement, (err) => {if (err) throw err;});
    mo.handleQueries(userStatement, (err) => {
        if (err) res.status(constants.httpStatusCodes.CONFLICT).json(constants.statusTexts.SIGNUP_FAILURE);
        else res.status(constants.httpStatusCodes.SUCCESS).json(constants.statusTexts.SIGNUP_SUCCESS);
    });
});

app.post(`${endpointRoot}${constants.resources.LOGIN}`,(req, res) => {
    const userStatement = `SELECT * FROM user WHERE username = '${req.body.username}';`;
    const endpointStatement = `UPDATE endpoint SET requests = requests + 1 WHERE id = ${constants.apiEndpoints.LOGIN};`;
    mo.handleQueries(endpointStatement, (err) => {if (err) throw err;});
    mo.handleQueries(userStatement, async (user) => {
        if (!user.length) res.status(constants.httpStatusCodes.UNAUTHORIZED).json(constants.statusTexts.LOGIN_FAILURE);
        else {
            const isMatched = await mo.verifyPasswords(req.body.password, user[0]["password"]);
            if (isMatched) {
                const token = mo.createAuthenticationTokens(user[0]["id"]);
                const name = "jwt";
                const val = `Bearer ${token}`;
                const options = {secure:true, httpOnly: true, path: "/", sameSite: "none"};
                res.cookie(name, val, options).status(constants.httpStatusCodes.SUCCESS).json(constants.statusTexts.LOGIN_SUCCESS);
            } else res.status(constants.httpStatusCodes.UNAUTHORIZED).json(constants.statusTexts.LOGIN_FAILURE);
        }
    });
});

app.post(`${endpointRoot}${constants.resources.LOGOUT}`, mo.auth, (req, res) => {
    const endpointCommand = `UPDATE endpoint SET requests = requests + 1 WHERE id = ${constants.apiEndpoints.LOGOUT};`;
    const name = "jwt";
    mo.handleQueries(endpointCommand, (err) => {if (err) throw err;});
    res.clearCookie(name).status(constants.httpStatusCodes.SUCCESS).json(constants.statusTexts.LOGOUT_SUCCESS);
});

app.get(`${endpointRoot}${constants.resources.ADMIN}`, mo.auth, (req, res) => {
    const endpointStatement = `UPDATE endpoint SET requests = requests + 1 WHERE id = ${constants.apiEndpoints.ADMIN};`;
    mo.handleQueries(endpointStatement, (err) => {if (err) throw err;});
    if (req.data === 1) {
        const endpointStatement = 'SELECT * FROM endpoint;';
        mo.handleQueries(endpointStatement, (endpoints) => {
            res.status(constants.httpStatusCodes.SUCCESS).json({endpoints});
        });
    } else res.status(constants.httpStatusCodes.UNAUTHORIZED).json(constants.statusTexts.UNAUTHORIZED);
});

app.post(`${endpointRoot}${constants.resources.WATCHLIST}`, mo.auth, (req, res) => {
    const endpointStatement = `UPDATE endpoint SET requests = requests + 1 WHERE id = ${constants.apiEndpoints.POST_WATCH_LIST};`;
    const watchListStatement = `INSERT INTO watch_list(user_id, movie_name, movie_overview, movie_poster_path, movie_rating)
                                VALUES(${req.data}, "${req.body.name}", "${req.body.overview}", "${req.body.posterPath}", ${req.body.rating});`;
    mo.handleQueries(endpointStatement,(err) => {if (err) throw err;});
    mo.handleQueries(watchListStatement,(err) => {
        if (err) res.status(constants.httpStatusCodes.CONFLICT).json(constants.statusTexts.WATCHLIST_FAILURE);
        else res.status(constants.httpStatusCodes.SUCCESS).json(constants.statusTexts.WATCHLIST_SUCCESS);
    });
});

app.post(`${endpointRoot}${constants.resources.FAVOURITES_LIST}`, mo.auth, (req, res) => {
    const endpointStatement = `UPDATE endpoint SET requests = requests + 1 WHERE id = ${constants.apiEndpoints.POST_FAVOURITES_LIST};`;
    const favouritesListStatement = `INSERT INTO favourites_list(user_id, movie_name, movie_overview, movie_poster_path, movie_rating)
                                 VALUES(${req.data}, "${req.body.name}", "${req.body.overview}", "${req.body.posterPath}", ${req.body.rating});`;
    mo.handleQueries(endpointStatement, (err) => {if (err) throw err;});
    mo.handleQueries(favouritesListStatement, (err) => {
        if (err) res.status(constants.httpStatusCodes.CONFLICT).json(constants.statusTexts.FAVOURITES_LIST_FAILURE);
        else res.status(constants.httpStatusCodes.SUCCESS).json(constants.statusTexts.FAVOURITES_LIST_SUCCESS);
    });
});

app.get(`${endpointRoot}${constants.resources.WATCHLIST}`, mo.auth, (req, res) => {
    const watchListStatement = `SELECT * FROM watch_list WHERE user_id = ${req.data};`;
    const endpointStatement = `UPDATE endpoint SET requests = requests + 1 WHERE id = ${constants.apiEndpoints.GET_WATCH_LIST};`;
    mo.handleQueries(endpointStatement, (err) => {if (err) throw err;});
    mo.handleQueries(watchListStatement, (movies) => {
        res.status(constants.httpStatusCodes.SUCCESS).json({movies});
    });
});

app.get(`${endpointRoot}${constants.resources.FAVOURITES_LIST}`, mo.auth, (req, res) => {
    const favouritesListStatement = `SELECT * FROM favourites_list WHERE user_id=${req.data};`;
    const endpointStatement = `UPDATE endpoint SET requests = requests + 1 WHERE id = ${constants.apiEndpoints.GET_FAVOURITES_LIST};`;
    mo.handleQueries(endpointStatement, (err) => {if (err) throw err;});
    mo.handleQueries(favouritesListStatement, (movies) => {
        res.status(constants.httpStatusCodes.SUCCESS).json({movies});
    });
});

app.delete(`${endpointRoot}${constants.resources.WATCHLIST}${param}`, mo.auth, (req, res) => {
    const watchListStatement = `DELETE FROM watch_list WHERE id = ${req.params.id}`;
    const endpointStatement = `UPDATE endpoint SET requests = requests + 1 WHERE id = ${constants.apiEndpoints.DELETE_WATCH_LIST};`;
    mo.handleQueries(endpointStatement, (err) => {if (err) throw err;});
    mo.handleQueries(watchListStatement, (err) => {
        if (err) throw err;
        else res.status(constants.httpStatusCodes.SUCCESS).json(constants.statusTexts.WATCHLIST_REMOVAL);
    });
});

app.delete(`${endpointRoot}${constants.resources.FAVOURITES_LIST}${param}`, mo.auth, (req, res) => {
    const favouritesListStatement = `DELETE FROM favourites_list WHERE id = ${req.params.id}`;
    const endpointStatement = `UPDATE endpoint SET requests = requests + 1 WHERE id = ${constants.apiEndpoints.DELETE_FAVOURITES_LIST};`;
    mo.handleQueries(endpointStatement, (err) => {if (err) throw err;});
    mo.handleQueries(favouritesListStatement, (err) => {
        if (err) throw err;
        else res.status(constants.httpStatusCodes.SUCCESS).json(constants.statusTexts.FAVOURITES_LIST_REMOVAL);
    });
});

app.patch(`${endpointRoot}${constants.resources.PASSWORD}`, mo.auth, async (req, res) => {
    const hashed = await mo.hashPasswords(req.body.password);
    const userStatement = `UPDATE user SET password = "${hashed}" WHERE id = ${req.data}`;
    const endpointStatement = `UPDATE endpoint SET requests = requests + 1 WHERE id = ${constants.apiEndpoints.CHANGE_PASSWORD};`;
    mo.handleQueries(endpointStatement, (err) => {if (err) throw err;});
    mo.handleQueries(userStatement, (err) => {
        if (err) throw err;
        else res.status(constants.httpStatusCodes.SUCCESS).json(constants.statusTexts.PASSWORD);
    });
});

app.get(`${endpointRoot}${constants.resources.PROFILE}`, mo.auth, async (req, res) => {
    const userStatement = `SELECT username FROM user WHERE id = ${req.data}`;
    const endpointStatement = `UPDATE endpoint SET requests = requests + 1 WHERE id = ${constants.apiEndpoints.PROFILE};`;
    mo.handleQueries(endpointStatement, (err) => {if (err) throw err;});
    mo.handleQueries(userStatement, (profile) => {
        res.status(constants.httpStatusCodes.SUCCESS).json({profile});
    });
});

app.listen(port);
