

const tabList = document.querySelectorAll(".tab");
tabList.forEach((tab) => {
  const button = tab.querySelector(".tab-header");
  const tabBody = tab.querySelector(".tab-body");
  button.addEventListener("click", () => {
    if (tabBody.style.maxHeight) {
      tabBody.style.maxHeight = null;
    } else {
      tabBody.style.maxHeight = tabBody.scrollHeight + "px";
      closeOtherTabs(tab);
    }
  });
});

function closeOtherTabs(openTab) {
    tabList.forEach((tab) => {
        if(openTab != tab) {
            console.log(tab.style.maxHeight);
            tabBody = tab.querySelector(".tab-body")
            tabBody.style.maxHeight = null;
        }
    })
}