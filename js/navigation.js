// Navigation functions

function setupNavigationListeners() {
  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");
      switchTab(targetTab);

      if (targetTab === "players") {
        loadPlayers();
      }
    });
  });

  const playerSearch = document.getElementById("playerSearch");
  if (playerSearch) {
    playerSearch.addEventListener("input", (e) => {
      filterPlayers(e.target.value);
    });
  }

  // Mobile menu touch improvements
  if ("ontouchstart" in window) {
    navTabs.forEach((tab) => {
      tab.style.webkitTapHighlightColor = "transparent";
    });
  }
}

function switchTab(tabName) {
  navTabs.forEach((tab) => tab.classList.remove("active"));
  contentSections.forEach((section) => section.classList.remove("active"));

  const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
  const selectedSection = document.getElementById(tabName);

  if (selectedTab && selectedSection) {
    selectedTab.classList.add("active");
    selectedSection.classList.add("active");
    currentTab = tabName;
  }
}
