/**
 * Clean SPA Navigation - Architecture of Impunity
 * Simple show/hide navigation with no conflicts
 */
(function() {
    'use strict';

    // All navigable section IDs (shown individually when clicked)
    const SECTIONS = [
        'thesis', 'cases', 'loopholes', 'blocking', 'eu-rewards',
        'solution', 'elite-laws', 'eu-labor', 'probability',
        'convicted-protected', 'judicial-corruption',
        'media-machine', 'golden-parachute', 'corruption-database',
        'timeline', 'stats', 'methodology', 'sources', 'sign',
        'why-investigate', 'verdict'
    ];

    // Pre-thesis sections that show on Home (intro sections)
    const HOME_SECTIONS = ['roadmap'];

    // DOM elements
    let hero, preSections, homeSectionElements, allSections;

    function init() {
        // Get hero (the header with id="hero")
        hero = document.getElementById('hero');

        // Get pre-thesis sections (sections without IDs that show on home)
        preSections = document.querySelectorAll('main > section:not([id])');

        // Get home sections (sections WITH IDs that should show on home)
        homeSectionElements = {};
        HOME_SECTIONS.forEach(id => {
            homeSectionElements[id] = document.getElementById(id);
        });

        // Cache all navigable sections
        allSections = {};
        SECTIONS.forEach(id => {
            allSections[id] = document.getElementById(id);
        });

        // Attach click handlers to ALL anchor links
        document.addEventListener('click', handleClick, true); // Capture phase!

        // Handle browser back/forward
        window.addEventListener('popstate', handlePopState);

        // Check initial hash
        const hash = location.hash.slice(1);
        if (hash === 'hero' || !hash) {
            // On home - hide all sections, show only hero + roadmap
            showHome(false);
        } else if (SECTIONS.includes(hash)) {
            showSection(hash);
        }
    }

    function handleClick(e) {
        // Find if click was on an anchor or inside one
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.length < 2) return;

        const id = href.slice(1);

        // Home link (brand) - handle #, empty, or #hero
        if (href === '#' || id === '' || id === 'hero') {
            e.preventDefault();
            e.stopPropagation();
            showHome();
            return;
        }

        // Section link
        if (SECTIONS.includes(id)) {
            e.preventDefault();
            e.stopPropagation();
            showSection(id);

            // Close mobile menu
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) mobileMenu.classList.add('hidden');

            // Close more dropdown
            const moreMenu = document.getElementById('more-menu');
            if (moreMenu) moreMenu.classList.add('hidden');
        }
    }

    function handlePopState() {
        const hash = location.hash.slice(1);
        if (hash === 'hero' || !hash) {
            showHome(false);
        } else if (SECTIONS.includes(hash)) {
            showSection(hash, false);
        } else {
            showHome(false);
        }
    }

    function showSection(id, pushState = true) {
        const section = allSections[id];
        if (!section) return;

        // Hide hero and pre-sections
        if (hero) hero.style.display = 'none';
        preSections.forEach(s => s.style.display = 'none');

        // Hide home sections (journalism-ethics, roadmap)
        HOME_SECTIONS.forEach(hid => {
            const s = homeSectionElements[hid];
            if (s) s.style.display = 'none';
        });

        // Hide all sections, show target
        SECTIONS.forEach(sid => {
            const s = allSections[sid];
            if (s) s.style.display = (sid === id) ? 'block' : 'none';
        });

        // Update nav highlighting
        updateNavHighlight(id);

        // Scroll to top instantly
        window.scrollTo(0, 0);

        // Update URL
        if (pushState) {
            history.pushState({ section: id }, '', '#' + id);
        }

        // Re-apply translations if i18n available
        if (window.i18n && typeof window.i18n.applyTranslations === 'function') {
            window.i18n.applyTranslations();
        }
    }

    function showHome(pushState = true) {
        // Show hero and pre-sections
        if (hero) hero.style.display = 'flex';
        preSections.forEach(s => s.style.display = 'block');

        // Show home sections (journalism-ethics, roadmap)
        HOME_SECTIONS.forEach(hid => {
            const s = homeSectionElements[hid];
            if (s) s.style.display = 'block';
        });

        // Hide all navigable sections
        SECTIONS.forEach(sid => {
            const s = allSections[sid];
            if (s) s.style.display = 'none';
        });

        // Clear nav highlighting
        updateNavHighlight(null);

        // Scroll to top
        window.scrollTo(0, 0);

        // Update URL
        if (pushState) {
            history.pushState({}, '', location.pathname);
        }
    }

    function updateNavHighlight(activeId) {
        document.querySelectorAll('nav a[href^="#"]').forEach(link => {
            const href = link.getAttribute('href');
            const isActive = activeId && href === '#' + activeId;
            link.classList.toggle('text-accent', isActive);
            link.classList.toggle('spa-active', isActive);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
