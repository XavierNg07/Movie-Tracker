const passwordURI = REQUEST_INFO.serverURL + ENDPOINT_KEY.changePassword;
const profileURI = REQUEST_INFO.serverURL + ENDPOINT_KEY.profile;
const USERNAME = document.getElementById("username");
const PASSWORD = document.getElementById("newPassword");
const PASSWORD_FORM = document.getElementById("newPasswordForm");
const ERROR_LOG = document.getElementById("profileErrorLog");
const LOG = document.getElementById("log");
const WATCH_LIST = "../html/watchList.html";
const FAVORITE_LIST = "../html/favouritesList.html";

/**
 * Get the username of the user via http GET.
 */
getUsername = () => {
    fetch(profileURI, {
        method: HTTP_METHODS.GET,
        credentials: "include"
    }).then(response => response.json())
    .then(data => USERNAME.innerHTML = data.profile[0].username);
}

/**
 * Add an error to the list of error element.
 * @param {} text
 */
addError = (text) => {
    let item = document.createElement('li');
    item.innerHTML = text;
    ERROR_LOG.appendChild(item);

}

/**
 * Change the password saved in the database.
 */
changePassword = () =>{
    fetch(passwordURI, {
        method: HTTP_METHODS.PATCH,
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "password": PASSWORD.value
        })
    }).then(response => response.json())
        .then(data => {
            updateLog('green', data.statusText);
        PASSWORD.value = "";
    });
}

/**
 * Modify the log element to display the correct information.
 */
updateLog = (color, text) => {
    LOG.innerHTML = text;
    LOG.style.color = color;
    LOG.style.display = 'block';
}

/**
 * When the password is entered, stop reload
 * and change password.
 */
submitPasswordChange = () => {
    PASSWORD_FORM.addEventListener("submit", (event) => {
        if (PASSWORD.value.trim().replaceAll(" ", "").length > 0) {
            changePassword();
        } else {
            updateLog('red', ERRORS.notEmpty);
        }
        event.preventDefault();
    });
}

/**
 * Change the page to the watch list
 */
directWatchList = () => {
    window.location.href = WATCH_LIST;
}

/**
 * Change the page ot the favorite list
 *
 */
directFavoriteList = () => {
    window.location.href = FAVORITE_LIST;
}


getUsername();
submitPasswordChange();
