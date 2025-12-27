// Timeline Selector - Filter content by era
const Timeline = {
    // Data analysis timeframe: 1974 (Carnation Revolution) to 2025 (Present)
    dataRange: { start: 1974, end: 2025, years: 51 },

    eras: {
        'full': { label: '1974-2025: Full Analysis', range: [1974, 2025], description: '51 years of documented patterns' },
        'revolution': { label: '1974-1985: Post-Revolution', range: [1974, 1985], description: 'Democratic transition period' },
        'eu-entry': { label: '1986-1999: EU Entry Era', range: [1986, 1999], description: 'European integration' },
        'euro': { label: '2000-2010: Euro Era', range: [2000, 2010], description: 'Single currency adoption' },
        'troika': { label: '2011-2015: Troika Era', range: [2011, 2015], description: 'Bailout and austerity' },
        'costa': { label: '2015-2023: Costa Era', range: [2015, 2023], description: 'Socialist governance' },
        'present': { label: '2024-2025: Current', range: [2024, 2025], description: 'Montenegro government' }
    },

    currentEra: 'full',

    init() {
        this.createDropdown();
        this.setupEvents();
    },

    createDropdown() {
        const container = document.getElementById('timeline-dropdown');
        if (!container) return;

        container.innerHTML = `
            <button class="timeline-btn" id="timeline-btn">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                <span class="timeline-label">1974-2025</span>
                <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
            </button>
            <div class="timeline-menu" id="timeline-menu">
                <div class="timeline-header">
                    <strong>Analysis Timeframe</strong>
                    <span>${this.dataRange.years} years of data</span>
                </div>
                ${Object.entries(this.eras).map(([key, era]) => `
                    <button class="timeline-option ${key === 'full' ? 'active' : ''}"
                            data-era="${key}">
                        <div class="era-main">
                            <span class="era-label">${era.label}</span>
                            <span class="era-desc">${era.description}</span>
                        </div>
                    </button>
                `).join('')}
            </div>
        `;
    },

    setupEvents() {
        const btn = document.getElementById('timeline-btn');
        const menu = document.getElementById('timeline-menu');

        if (!btn || !menu) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            menu.classList.remove('open');
        });

        document.querySelectorAll('.timeline-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const era = opt.dataset.era;
                this.selectEra(era);
                menu.classList.remove('open');
            });
        });
    },

    selectEra(era) {
        if (!this.eras[era]) return;

        this.currentEra = era;
        const eraData = this.eras[era];

        // Update button label
        const label = document.querySelector('.timeline-label');
        if (label) label.textContent = eraData.label;

        // Update active state
        document.querySelectorAll('.timeline-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.era === era);
        });

        // Filter content
        this.filterContent(eraData.range);

        // Update URL
        const url = new URL(window.location);
        if (era === 'all') {
            url.searchParams.delete('era');
        } else {
            url.searchParams.set('era', era);
        }
        history.replaceState({}, '', url);
    },

    filterContent(range) {
        const [startYear, endYear] = range;

        // Filter case files by year
        document.querySelectorAll('.case-file').forEach(caseEl => {
            const year = parseInt(caseEl.dataset.year);
            if (isNaN(year)) {
                caseEl.style.display = '';
                return;
            }

            if (startYear === 1974 && endYear === 2025) {
                caseEl.style.display = '';
            } else {
                caseEl.style.display = (year >= startYear && year <= endYear) ? '' : 'none';
            }
        });

        // Filter timeline items
        document.querySelectorAll('.timeline-item').forEach(item => {
            const dateText = item.querySelector('.date')?.textContent || '';
            const yearMatch = dateText.match(/\d{4}/);

            if (!yearMatch) {
                item.style.display = '';
                return;
            }

            const year = parseInt(yearMatch[0]);
            if (startYear === 1974 && endYear === 2025) {
                item.style.display = '';
            } else {
                item.style.display = (year >= startYear && year <= endYear) ? '' : 'none';
            }
        });

        // Update dashboard charts if available
        if (window.Dashboard && typeof Dashboard.filterByRange === 'function') {
            Dashboard.filterByRange(range);
        }
    },

    // Load era from URL on init
    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        const era = params.get('era');
        if (era && this.eras[era]) {
            this.selectEra(era);
        }
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Timeline.init();
        Timeline.loadFromURL();
    });
} else {
    Timeline.init();
    Timeline.loadFromURL();
}

window.Timeline = Timeline;
