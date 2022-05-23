const tableElm = document.querySelector("#stats");
const errorLog = document.getElementById("adminErrorLog");

/**
 * Get the amount of requests that have been send to the server's endpoints and
 * display them as stats.
 */
GETStats =() => {
    fetch(REQUEST_INFO.serverURL + ENDPOINT_KEY.admin, {
        method: HTTP_METHODS.GET,
        credentials: "include"
    }).then(response => response.json())
        .then(data => {
        if (data.error) displayError(data.error);
        else createStatRow(data);
    });
}

/**
 * Display the error visually.
 * @param {*} text
 */
displayError = (text) => {
    errorLog.style.display = "inline-block";

    let item = document.createElement("li");
    item.innerHTML = text;

    errorLog.appendChild(item);
}

createStatRow = (data) => {
    for (let i = 0; i < data.endpoints.length; i++) {
        let newRow = createStatsRow(data.endpoints[i]);
        tableElm.appendChild(newRow);
    }
}

/**
 * create a row that represents an enpoint and display
 * it's stats.
 */
createStatsRow = (endpointObj) => {
    let row = document.createElement('tr');
    let methodCol = document.createElement('td');
    let endpointCol = document.createElement('td');
    let requestCol = document.createElement('td');

    methodCol.textContent = endpointObj[ENDPOINT_KEY.method];
    endpointCol.textContent = endpointObj[ENDPOINT_KEY.api];
    requestCol.textContent = endpointObj[ENDPOINT_KEY.requests];

    row.appendChild(methodCol);
    row.appendChild(endpointCol);
    row.appendChild(requestCol);

    return row;
}
