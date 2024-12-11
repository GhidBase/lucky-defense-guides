const htmlFilePath = "sidebar.html";
fetch(htmlFilePath)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(html => {
        document.querySelector(".side-bar").innerHTML = html;
    })

console.log("Sidebar loaded!")