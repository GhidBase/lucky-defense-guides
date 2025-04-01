const htmlFilePath = "sidebar.html";
fetch(htmlFilePath)
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.text();
    })
    .then(html => {
        // Remove <script> tags
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        // Remove all script tags
        tempDiv.querySelectorAll("script").forEach(script => script.remove());

        // Now safely inject
        document.querySelector(".side-bar").innerHTML = tempDiv.innerHTML;
    });

console.log("Sidebar loaded!");
