/**
 * i18n Language Switcher - Hybrid Runtime + Static Support
 *
 * ARCHITECTURE:
 * - Primary: Runtime translation for index-tw.html (dynamic)
 * - Secondary: Static generation for /dist/{lang}/ (build time)
 *
 * Elements with data-i18n="key.subkey" get translated at runtime
 * Language files: /lang/{code}.json
 */

const i18n = {
    // All 24 EU official languages
    languages: {
        en: { flag: '🇬🇧', name: 'English', nativeName: 'English' },
        pt: { flag: '🇵🇹', name: 'Portuguese', nativeName: 'Português' },
        de: { flag: '🇩🇪', name: 'German', nativeName: 'Deutsch' },
        fr: { flag: '🇫🇷', name: 'French', nativeName: 'Français' },
        es: { flag: '🇪🇸', name: 'Spanish', nativeName: 'Español' },
        it: { flag: '🇮🇹', name: 'Italian', nativeName: 'Italiano' },
        nl: { flag: '🇳🇱', name: 'Dutch', nativeName: 'Nederlands' },
        pl: { flag: '🇵🇱', name: 'Polish', nativeName: 'Polski' },
        ro: { flag: '🇷🇴', name: 'Romanian', nativeName: 'Română' },
        el: { flag: '🇬🇷', name: 'Greek', nativeName: 'Ελληνικά' },
        cs: { flag: '🇨🇿', name: 'Czech', nativeName: 'Čeština' },
        hu: { flag: '🇭🇺', name: 'Hungarian', nativeName: 'Magyar' },
        sv: { flag: '🇸🇪', name: 'Swedish', nativeName: 'Svenska' },
        da: { flag: '🇩🇰', name: 'Danish', nativeName: 'Dansk' },
        fi: { flag: '🇫🇮', name: 'Finnish', nativeName: 'Suomi' },
        bg: { flag: '🇧🇬', name: 'Bulgarian', nativeName: 'Български' },
        hr: { flag: '🇭🇷', name: 'Croatian', nativeName: 'Hrvatski' },
        sk: { flag: '🇸🇰', name: 'Slovak', nativeName: 'Slovenčina' },
        sl: { flag: '🇸🇮', name: 'Slovenian', nativeName: 'Slovenščina' },
        et: { flag: '🇪🇪', name: 'Estonian', nativeName: 'Eesti' },
        lv: { flag: '🇱🇻', name: 'Latvian', nativeName: 'Latviešu' },
        lt: { flag: '🇱🇹', name: 'Lithuanian', nativeName: 'Lietuvių' },
        mt: { flag: '🇲🇹', name: 'Maltese', nativeName: 'Malti' },
        ga: { flag: '🇮🇪', name: 'Irish', nativeName: 'Gaeilge' }
    },

    currentLang: 'en',
    translations: {},
    fallbackTranslations: {},
    isLoading: false,

    /**
     * Initialize the i18n system
     */
    async init() {
        // Check if we're on a static pre-rendered page
        const pathMatch = window.location.pathname.match(/^\/([a-z]{2})\//);
        if (pathMatch && this.languages[pathMatch[1]]) {
            this.currentLang = pathMatch[1];
        } else {
            // Check stored preference or browser language
            const stored = localStorage.getItem('preferred_lang');
            const browserLang = navigator.language?.split('-')[0];
            this.currentLang = (stored && this.languages[stored]) ? stored :
                               (browserLang && this.languages[browserLang]) ? browserLang : 'en';
        }

        // Load fallback (English) first
        await this.loadTranslations('en');
        this.fallbackTranslations = { ...this.translations };

        // Load current language if not English
        if (this.currentLang !== 'en') {
            await this.loadTranslations(this.currentLang);
        }

        // Setup UI
        this.setupLanguageSelector();
        this.translatePage();
        this.updateUI();
    },

    /**
     * Load translations from JSON file
     */
    async loadTranslations(lang) {
        if (!this.languages[lang]) return;

        this.isLoading = true;
        try {
            const response = await fetch(`/lang/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
            this.translations = await response.json();
        } catch (err) {
            console.warn(`[i18n] Could not load ${lang}.json, using fallback:`, err.message);
            this.translations = { ...this.fallbackTranslations };
        }
        this.isLoading = false;
    },

    /**
     * Get nested value from translations using dot notation
     */
    t(key, fallback = null) {
        const getValue = (obj, path) => {
            return path.split('.').reduce((curr, k) => curr?.[k], obj);
        };

        let value = getValue(this.translations, key);
        if (value === undefined || value === null) {
            value = getValue(this.fallbackTranslations, key);
        }
        return value ?? fallback ?? key;
    },

    /**
     * Setup language selector dropdowns
     */
    setupLanguageSelector() {
        const langBtn = document.getElementById('lang-btn');
        const langMenu = document.getElementById('lang-menu');
        const mobileLangGrid = document.getElementById('mobile-lang-grid');

        if (!langBtn || !langMenu) return;

        // Build language menu HTML
        const menuHTML = Object.entries(this.languages).map(([code, lang]) => `
            <button class="lang-option w-full px-4 py-2 text-left hover:bg-white/10 flex items-center gap-3 ${code === this.currentLang ? 'bg-accent/20 text-accent' : 'text-white/80'}" data-lang="${code}">
                <span class="text-lg">${lang.flag}</span>
                <span>${lang.nativeName}</span>
            </button>
        `).join('');

        langMenu.innerHTML = menuHTML;

        // Build mobile language grid
        if (mobileLangGrid) {
            const gridHTML = Object.entries(this.languages).map(([code, lang]) => `
                <button class="lang-option p-2 rounded hover:bg-white/10 ${code === this.currentLang ? 'bg-accent/20' : ''}" data-lang="${code}" title="${lang.nativeName}">
                    <span class="text-xl">${lang.flag}</span>
                </button>
            `).join('');
            mobileLangGrid.innerHTML = gridHTML;
        }

        // Toggle dropdown
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('hidden');
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!langMenu.contains(e.target) && e.target !== langBtn) {
                langMenu.classList.add('hidden');
            }
        });

        // Handle language selection
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', () => this.switchLanguage(btn.dataset.lang));
        });
    },

    /**
     * Switch to a different language
     */
    async switchLanguage(lang) {
        if (!this.languages[lang] || lang === this.currentLang) return;

        this.currentLang = lang;
        localStorage.setItem('preferred_lang', lang);

        // Check if we're on a static page - navigate to new language version
        const pathMatch = window.location.pathname.match(/^\/([a-z]{2})\//);
        if (pathMatch) {
            const newPath = window.location.pathname.replace(/^\/[a-z]{2}\//, `/${lang}/`);
            window.location.href = newPath + window.location.search + window.location.hash;
            return;
        }

        // Runtime translation
        await this.loadTranslations(lang);
        this.translatePage();
        this.updateUI();

        // Close dropdown
        document.getElementById('lang-menu')?.classList.add('hidden');
    },

    /**
     * Translate all elements with data-i18n attribute
     */
    translatePage() {
        // Elements with data-i18n for text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const value = this.t(key);
            if (value && typeof value === 'string') {
                // Use innerHTML if value contains HTML tags, otherwise textContent
                if (value.includes('<') && value.includes('>')) {
                    el.innerHTML = value;
                } else {
                    el.textContent = value;
                }
            }
        });

        // Elements with data-i18n-placeholder for input placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            const value = this.t(key);
            if (value) el.placeholder = value;
        });

        // Elements with data-i18n-title for title attributes
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            const value = this.t(key);
            if (value) el.title = value;
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
    },

    /**
     * Update UI elements (flag, language name, etc.)
     */
    updateUI() {
        const lang = this.languages[this.currentLang];
        if (!lang) return;

        // Update current language display
        const flagEl = document.getElementById('current-lang-flag');
        const nameEl = document.getElementById('current-lang-name');

        if (flagEl) flagEl.textContent = lang.flag;
        if (nameEl) nameEl.textContent = this.currentLang.toUpperCase();

        // Update active states in menus
        document.querySelectorAll('.lang-option').forEach(btn => {
            const isActive = btn.dataset.lang === this.currentLang;
            btn.classList.toggle('bg-accent/20', isActive);
            btn.classList.toggle('text-accent', isActive);
        });
    },

    /**
     * Get current language info
     */
    getCurrentLanguage() {
        return {
            code: this.currentLang,
            ...this.languages[this.currentLang]
        };
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}

// Alias for compatibility with spa-nav.js
i18n.applyTranslations = i18n.translatePage.bind(i18n);

// Export for use in other scripts
window.i18n = i18n;
