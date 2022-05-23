const LOGIN = "../index.html";
const serverLogout = REQUEST_INFO.serverURL + ENDPOINT_KEY.logout;
/**
 * Log the user out.
 */
logout = () => {
    fetch(serverLogout, {
        method: HTTP_METHODS.POST,
        headers: {"Content-Type": "application/json"},
        credentials: "include"
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
    }).then(data => {
        if (data){
            window.location.href = LOGIN;
        }});
}