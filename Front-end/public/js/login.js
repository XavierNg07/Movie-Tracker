const errorLog = document.getElementById("errorLog");
let username = document.querySelector("#username");
let password = document.querySelector("#password");
const server = REQUEST_INFO.serverURL + ENDPOINT_KEY.login;
const MAIN_PAGE = "../html/main.html";

/**
 * Logs the user in
 */
login = () => {
    fetch(server, {
        method: HTTP_METHODS.POST,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(
            {"username": username.value, "password": password.value},
        ),
        credentials: "include"
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                errorLog.style.display = "block";
                errorLog.innerHTML = data.error;
            } else window.location.href = MAIN_PAGE;
        });
}

