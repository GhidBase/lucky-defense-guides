(function(){
  function isDesktop(){
    return window.matchMedia('(min-width: 1001px)').matches;
  }

  const state = {
    built: false,
    categories: [],
    elements: {
      sidebar: null,
      searchInput: null,
      feedback: null,
      searchContainer: null,
    }
  };

  function init(){
    if (!isDesktop()) return;
    const sidebar = document.querySelector('.side-bar');
    if (!sidebar || state.built) return;
    state.elements.sidebar = sidebar;

    // If sidebar content not yet loaded, observe until it is, then initialize
    const hasContent = !!(sidebar.querySelector('h2.section-header') || sidebar.querySelector('a'));
    if (!hasContent){
      const observer = new MutationObserver(() => {
        const ready = sidebar.querySelector('h2.section-header') || sidebar.querySelector('a');
        if (ready){
          observer.disconnect();
          initSidebarSearch();
        }
      });
      observer.observe(sidebar, { childList: true, subtree: true });
    } else {
      initSidebarSearch();
    }
  }

  function initSidebarSearch(){
    if (state.built) return;

    const sidebar = state.elements.sidebar;
    // Build category structure from existing DOM
    buildCategoriesFromSidebar(sidebar);

    // Inject search UI at the top
    const searchContainer = document.createElement('div');
    searchContainer.className = 'desktop-menu-search';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search articles…';
    input.setAttribute('aria-label', 'Search articles');

    const feedback = document.createElement('div');
    feedback.className = 'desktop-menu-feedback';
    feedback.style.display = 'none';

    searchContainer.appendChild(input);
    searchContainer.appendChild(feedback);

    // Insert as the first child of the sidebar
    sidebar.insertBefore(searchContainer, sidebar.firstChild);

    state.elements.searchContainer = searchContainer;
    state.elements.searchInput = input;
    state.elements.feedback = feedback;

    input.addEventListener('input', onSearchInput);

    state.built = true;
  }

  function buildCategoriesFromSidebar(sidebar){
    const children = Array.from(sidebar.children);
    const categories = [];
    let current = { headerNode: null, linkNodes: [] };

    for (const node of children){
      // Skip the injected search UI
      if (node.classList && node.classList.contains('desktop-menu-search')) continue;

      if (node.tagName === 'H2' && node.classList.contains('section-header')){
        // Push previous category if it has any content
        if (current.headerNode || current.linkNodes.length > 0){
          categories.push(current);
        }
        current = { headerNode: node, linkNodes: [] };
      } else if (node.tagName === 'A'){
        const href = node.getAttribute('href');
        const isDiscord = node.id === 'discord-button' || /discord\.com/.test(href || '');
        if (isDiscord){
          // Leave Discord button unaffected by search
          continue;
        }
        current.linkNodes.push(node);
      } else if (node.classList && node.classList.contains('nav-footer')){
        // Leave footer unaffected by search
        continue;
      }
    }

    // Push last bucket if it has content (handles pre-header "General" links if present)
    if (current.headerNode || current.linkNodes.length > 0){
      categories.push(current);
    }

    state.categories = categories;
  }

  function onSearchInput(e){
    const query = e.target.value.trim().toLowerCase();

    if (query === ''){
      resetFilter();
      return;
    }

    let totalMatches = 0;

    state.categories.forEach(cat => {
      let catMatches = 0;
      // Filter links in-place
      cat.linkNodes.forEach(link => {
        const text = (link.textContent || '').trim().toLowerCase();
        const match = text.includes(query);
        link.style.display = match ? '' : 'none';
        if (match) catMatches++;
      });
      // Show header only if there are matches in its group
      if (cat.headerNode){
        cat.headerNode.style.display = catMatches > 0 ? '' : 'none';
      }
      totalMatches += catMatches;
    });

    // If no matches at all, show feedback. Otherwise hide it.
    if (totalMatches === 0){
      state.elements.feedback.textContent = `No results found for "${query}"`;
      state.elements.feedback.style.display = 'block';
    } else {
      state.elements.feedback.style.display = 'none';
    }
  }

  function resetFilter(){
    // Restore all headers and links to visible
    state.categories.forEach(cat => {
      if (cat.headerNode){
        cat.headerNode.style.display = '';
      }
      cat.linkNodes.forEach(link => {
        link.style.display = '';
      });
    });
    if (state.elements.feedback){
      state.elements.feedback.style.display = 'none';
      state.elements.feedback.textContent = '';
    }
  }

  // Reinitialize on resize boundary crossings to avoid affecting mobile layout
  let lastIsDesktop = isDesktop();
  window.addEventListener('resize', () => {
    const nowIsDesktop = isDesktop();
    if (nowIsDesktop !== lastIsDesktop){
      lastIsDesktop = nowIsDesktop;
      // If switching to desktop and not built yet, initialize
      if (nowIsDesktop && !state.built){
        init();
      }
      // If leaving desktop, remove search UI effects (optional cleanup)
      if (!nowIsDesktop && state.built){
        resetFilter();
      }
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();