const htmlFilePath = "sidebar.html";
fetch(htmlFilePath)
    .then(html => {
        document.querySelector(".side-bar").innerHTML = html;
    })
