
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const homePage = "../index.html";

/**
 * Signs up a user
 */
signUp = () => {
    fetch(REQUEST_INFO.serverURL + ENDPOINT_KEY.signUp, {
        method: HTTP_METHODS.POST,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(
            {"username": username.value, "password": password.value},
        )
    }).then(() =>  {window.location.href = homePage;})
}
