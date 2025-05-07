const htmlFilePath = "sidebar.html";
fetch(htmlFilePath)
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.text();
  })
  .then((html) => {
    // Remove <script> tags
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Remove all script tags
    tempDiv.querySelectorAll("script").forEach((script) => script.remove());

    // Now safely inject
    document.querySelector(".side-bar").innerHTML = tempDiv.innerHTML;
    
    const modal = document.getElementById("donationModal");
    const openButtons = document.querySelectorAll(".openModalBtn");
    const closeButton = document.querySelector(".close");

    openButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        modal.style.display = "block";
      });
    });

    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  });

console.log("Sidebar loaded!");
