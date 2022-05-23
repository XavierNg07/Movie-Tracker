const bcrypt = require("bcrypt");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const constants = require("./constants");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
});

exports.handleQueries = (statement, callback) => {
    connection.query(statement, (err, results) => {
        if (statement.includes(constants.sqlCommands.SELECT)){
            if (err) throw err;
            else callback(results);
        } else callback(err);
    });
};

exports.verifyPasswords = (password, hashed) => {
    return bcrypt.compare(password, hashed);
};

exports.createAuthenticationTokens = (userId) => {
    const payload = {'data': userId};
    const options = {expiresIn: "2h"};
    return jwt.sign(payload, process.env.SECRET_KEY, options);
};

exports.auth = (req, res, next) => {
    const httpOnlyCookie = req.cookies["jwt"];
    if (!httpOnlyCookie) res.status(constants.httpStatusCodes.UNAUTHORIZED).json(constants.statusTexts.TOKEN_NOT_FOUND);
    else {
        const token = httpOnlyCookie.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) res.status(constants.httpStatusCodes.UNAUTHORIZED).json(constants.statusTexts.INVALID_TOKEN);
            else {
                req.data = decoded.data;
                next();
            }
        });
    }
};

exports.hashPasswords = async (password) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
};