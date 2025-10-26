(function(){
  const isMobile = () => window.matchMedia('(max-width: 1000px)').matches;

  const state = {
    built: false,
    currentOpenCategoryId: null,
    categories: [],
    elements: {
      overlay: null,
      panel: null,
      header: null,
      searchInput: null,
      categoriesContainer: null,
      persistentArea: null,
      closeBtn: null,
    },
  };

  function buildMobileMenu() {
    if (state.built) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';

    // Create centered panel
    const panel = document.createElement('div');
    panel.className = 'mobile-menu-panel surface';

    // Header with search
    const header = document.createElement('div');
    header.className = 'mobile-menu-header';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search articles…';
    searchInput.className = 'mobile-menu-search';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-menu-close';
    closeBtn.textContent = 'Close';

    header.appendChild(searchInput);
    header.appendChild(closeBtn);

    // Categories container
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'mobile-menu-categories';

    // Persistent area (discord + copyright + donate)
    const persistentArea = document.createElement('div');
    persistentArea.className = 'mobile-menu-persistent';

    panel.appendChild(header);
    
    // feedback container for search
    const feedback = document.createElement('div');
    feedback.className = 'mobile-menu-feedback';
    feedback.style.display = 'none';
    feedback.textContent = '';

    panel.appendChild(feedback);

    panel.appendChild(categoriesContainer);
    panel.appendChild(persistentArea);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // Save refs
    state.elements.overlay = overlay;
    state.elements.panel = panel;
    state.elements.header = header;
    state.elements.searchInput = searchInput;
    state.elements.categoriesContainer = categoriesContainer;
    state.elements.persistentArea = persistentArea;
    state.elements.closeBtn = closeBtn;
    state.elements.feedback = feedback;

    // Close handlers
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hideMenu();
    });
    closeBtn.addEventListener('click', hideMenu);

    // Build categories from sidebar once loaded
    buildCategoriesFromSidebar();

    // Search behavior
    searchInput.addEventListener('input', onSearchChange);

    state.built = true;
  }

  function buildCategoriesFromSidebar() {
    const sidebar = document.querySelector('.side-bar');
    if (!sidebar) return;

    const children = Array.from(sidebar.children);
    const categories = [];
    let currentCategory = { id: 'general', name: 'General', links: [] };

    for (const node of children) {
      if (node.tagName === 'H2' && node.classList.contains('section-header')) {
        // push previous category if it has content (or is general)
        if (currentCategory && currentCategory.links.length > 0 || (currentCategory.id === 'general')) {
          categories.push(currentCategory);
        }
        currentCategory = { id: slugify(node.textContent), name: node.textContent.trim(), links: [] };
      } else if (node.tagName === 'A') {
        const href = node.getAttribute('href');
        const isDiscord = node.id === 'discord-button' || /discord\.com/.test(href || '');
        if (isDiscord) {
          // place into persistent area later
          // store reference
          const discordClone = node.cloneNode(true);
          // Keep original ID to preserve styling
          // discordClone.removeAttribute('id');
          state.elements.persistentArea.appendChild(discordClone);
        } else {
          currentCategory.links.push({
            text: node.textContent.trim(),
            href: href,
          });
        }
      } else if (node.classList && node.classList.contains('nav-footer')) {
        // Clone and append footer to persistent area
        const footerClone = node.cloneNode(true);
        // Ensure donate button works with existing modal
        state.elements.persistentArea.appendChild(footerClone);
      }
    }
    // push last category
    if (currentCategory && currentCategory.links.length > 0) {
      categories.push(currentCategory);
    }

    state.categories = categories;

    renderCategories(categories);
  }

  function renderCategories(categories) {
    const container = state.elements.categoriesContainer;
    container.innerHTML = '';

    categories.forEach((cat, idx) => {
      const catWrapper = document.createElement('div');
      catWrapper.className = 'mobile-menu-category';

      const headerBtn = document.createElement('button');
      headerBtn.className = 'mobile-menu-cat-header';
      headerBtn.setAttribute('data-cat-id', cat.id);
      headerBtn.innerHTML = `<span class="cat-name">${escapeHtml(cat.name)}</span> <span class="cat-count">(${cat.links.length})</span>`;

      const linksList = document.createElement('div');
      linksList.className = 'mobile-menu-links';

      cat.links.forEach(link => {
        const a = document.createElement('a');
        a.textContent = link.text;
        a.href = link.href;
        linksList.appendChild(a);
      });

      headerBtn.addEventListener('click', () => openCategory(cat.id));

      catWrapper.appendChild(headerBtn);
      catWrapper.appendChild(linksList);
      container.appendChild(catWrapper);
    });

    // Open first category by default
    if (categories.length > 0) openCategory(categories[0].id);
  }

  function openCategory(catId) {
    if (state.currentOpenCategoryId === catId) return;
    state.currentOpenCategoryId = catId;

    const catElems = state.elements.categoriesContainer.querySelectorAll('.mobile-menu-category');
    catElems.forEach(catEl => {
      const headerBtn = catEl.querySelector('.mobile-menu-cat-header');
      const linksList = catEl.querySelector('.mobile-menu-links');
      const id = headerBtn.getAttribute('data-cat-id');
      if (id === catId) {
        linksList.style.display = 'block';
        headerBtn.classList.add('open');
      } else {
        linksList.style.display = 'none';
        headerBtn.classList.remove('open');
      }
    });
  }

  function onSearchChange(e) {
    const query = e.target.value.trim().toLowerCase();
    const container = state.elements.categoriesContainer;

    // Reset counts and visibility
    const catData = state.categories.map(c => ({...c, visibleCount: 0}));

    let firstMatchCatId = null;
    let totalMatches = 0;

    const catElems = Array.from(container.querySelectorAll('.mobile-menu-category'));
    catElems.forEach((catEl, idx) => {
      const headerBtn = catEl.querySelector('.mobile-menu-cat-header');
      const linksList = catEl.querySelector('.mobile-menu-links');
      const id = headerBtn.getAttribute('data-cat-id');
      const data = catData.find(c => c.id === id);

      const linkElems = Array.from(linksList.querySelectorAll('a'));
      let matchCount = 0;
      linkElems.forEach(a => {
        const match = a.textContent.toLowerCase().includes(query);
        a.style.display = (query === '' || match) ? '' : 'none';
        if (match || query === '') matchCount++;
      });

      data.visibleCount = matchCount;
      totalMatches += matchCount;
      // Update count display
      const countEl = headerBtn.querySelector('.cat-count');
      countEl.textContent = `(${matchCount})`;

      // Show/hide category
      if (query === '') {
        catEl.style.display = '';
      } else {
        catEl.style.display = matchCount > 0 ? '' : 'none';
      }

      if (query !== '' && matchCount > 0 && !firstMatchCatId) {
        firstMatchCatId = id;
      }
    });

    if (query === '') {
      state.elements.feedback.style.display = 'none';
      // Open first category again
      if (state.categories.length > 0) openCategory(state.categories[0].id);
    } else if (firstMatchCatId) {
      state.elements.feedback.style.display = 'none';
      openCategory(firstMatchCatId);
    } else {
      // No results message
      state.elements.feedback.textContent = `No results found for "${query}"`;
      state.elements.feedback.style.display = 'block';
    }
  }

  function showMenu() {
    if (!isMobile()) return; // do not affect desktop
    if (!state.built) buildMobileMenu();
    state.elements.overlay.classList.add('visible');
    document.body.classList.add('unscrollable');
  }

  function hideMenu() {
    state.elements.overlay?.classList.remove('visible');
    document.body.classList.remove('unscrollable');
  }

  function slugify(str) {
    return (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function waitForSidebarThenInit() {
    const sidebar = document.querySelector('.side-bar');
    if (!sidebar) return; // if no sidebar, nothing to build

    if (sidebar.children.length > 0) {
      // content already present
      buildMobileMenu();
      return;
    }
    const observer = new MutationObserver((mutations) => {
      if (sidebar.children.length > 0) {
        observer.disconnect();
        buildMobileMenu();
      }
    });
    observer.observe(sidebar, { childList: true });
  }

  function wireBurgerButton() {
    const btns = document.querySelectorAll('.menu');
    btns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (isMobile()) {
          e.preventDefault();
          showMenu();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    wireBurgerButton();
    waitForSidebarThenInit();
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideMenu();
    });
    // If viewport changes, hide menu automatically when leaving mobile
    window.matchMedia('(max-width: 800px)').addEventListener('change', (e) => {
      if (!e.matches) hideMenu();
    });
  });
})();