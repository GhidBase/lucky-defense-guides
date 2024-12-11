const htmlFilePath = "sidebar.html";
fetch(htmlFilePath)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); // Extract the HTML content as a string
    })
    .then(html => {
        document.querySelector(".side-bar").innerHTML = html;
    })

console.log("Sidebar loaded!")