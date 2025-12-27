/**
 * Translation Debug Overlay - Full JSON Comparison Scanner
 * Add ?debug=i18n to URL to activate
 * Compares current language JSON against English base to find ALL missing translations
 */
(function() {
    if (!window.location.search.includes('debug=i18n')) return;

    console.log('[i18n DEBUG] Full JSON scanner activated');

    setTimeout(initDebugger, 1500);

    function initDebugger() {
        const panel = document.createElement('div');
        panel.id = 'i18n-debug-panel';
        panel.innerHTML = `
            <style>
                #i18n-debug-panel {
                    position: fixed;
                    top: 80px;
                    left: 20px;
                    width: 420px;
                    max-height: 85vh;
                    background: rgba(0,0,0,0.95);
                    border: 3px solid #e94560;
                    border-radius: 10px;
                    z-index: 99999;
                    font-family: -apple-system, sans-serif;
                    font-size: 12px;
                    color: #fff;
                    overflow: hidden;
                    user-select: none;
                }
                #i18n-debug-header {
                    background: linear-gradient(135deg, #e94560, #ff6b6b);
                    padding: 10px 15px;
                    font-weight: bold;
                    cursor: grab;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                #i18n-debug-header:active { cursor: grabbing; }
                .debug-lang-badge {
                    background: #000;
                    padding: 3px 10px;
                    border-radius: 4px;
                    font-size: 14px;
                }
                #i18n-debug-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                    padding: 10px;
                    background: #16213e;
                }
                .debug-stat {
                    text-align: center;
                    padding: 6px;
                    border-radius: 5px;
                    background: rgba(0,0,0,0.3);
                }
                .debug-stat-value { font-size: 18px; font-weight: bold; }
                .debug-stat-label { font-size: 9px; opacity: 0.8; }
                #i18n-progress-bar {
                    height: 6px;
                    background: #333;
                    margin: 0 10px 10px;
                    border-radius: 3px;
                    overflow: hidden;
                }
                #i18n-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #e94560, #00ff41);
                    transition: width 0.3s;
                }
                #i18n-sections-scanned {
                    padding: 5px 10px;
                    font-size: 10px;
                    color: #888;
                    border-bottom: 1px solid #333;
                }
                .debug-controls {
                    padding: 8px;
                    display: flex;
                    gap: 5px;
                    flex-wrap: wrap;
                    background: #0d1528;
                }
                .debug-btn {
                    background: #16213e;
                    border: 1px solid #e94560;
                    color: #fff;
                    padding: 5px 8px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 10px;
                }
                .debug-btn:hover { background: #e94560; }
                .debug-btn.active { background: #e94560; }
                .debug-btn.success { background: #00aa55; border-color: #00aa55; }
                #i18n-debug-content {
                    max-height: 350px;
                    overflow-y: auto;
                    padding: 10px;
                }
                .debug-section-header {
                    background: #e94560;
                    color: #fff;
                    padding: 5px 10px;
                    margin: 10px 0 5px;
                    border-radius: 4px;
                    font-weight: bold;
                    font-size: 11px;
                    display: flex;
                    justify-content: space-between;
                }
                .debug-section-header.complete {
                    background: #00aa55;
                }
                .debug-item {
                    background: rgba(255,255,255,0.05);
                    margin: 3px 0;
                    padding: 6px 8px;
                    border-radius: 4px;
                    border-left: 3px solid #666;
                    cursor: pointer;
                    font-size: 11px;
                }
                .debug-item:hover { background: rgba(255,255,255,0.1); }
                .debug-item.ok { border-left-color: #00ff41; }
                .debug-item.english { border-left-color: #ffaa00; }
                .debug-item.missing { border-left-color: #ff4444; }
                .debug-key { color: #e94560; font-weight: bold; }
                .debug-value { color: #aaa; font-size: 10px; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .debug-value.en-val { color: #ffaa00; }
                .highlight-english { outline: 3px solid #ffaa00 !important; outline-offset: 2px !important; }
                #i18n-debug-close { background: none; border: none; color: #000; font-size: 18px; cursor: pointer; }
                #report-status { padding: 5px 10px; font-size: 11px; display: none; }
                .scan-indicator { animation: pulse 1s infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .section-coverage {
                    display: inline-block;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 10px;
                    margin-left: 5px;
                }
                .coverage-100 { background: #00aa55; }
                .coverage-high { background: #88aa00; }
                .coverage-med { background: #ffaa00; color: #000; }
                .coverage-low { background: #ff4444; }
            </style>
            <div id="i18n-debug-header">
                <span>🔍 i18n Full Scanner <span class="debug-lang-badge" id="debug-lang">?</span></span>
                <span id="scan-status"></span>
                <button id="i18n-debug-close">✕</button>
            </div>
            <div id="i18n-debug-stats">
                <div class="debug-stat">
                    <div class="debug-stat-value" id="stat-total" style="color:#4488ff">0</div>
                    <div class="debug-stat-label">Total Keys</div>
                </div>
                <div class="debug-stat">
                    <div class="debug-stat-value" id="stat-ok" style="color:#00ff41">0</div>
                    <div class="debug-stat-label">Translated</div>
                </div>
                <div class="debug-stat">
                    <div class="debug-stat-value" id="stat-english" style="color:#ffaa00">0</div>
                    <div class="debug-stat-label">Missing</div>
                </div>
                <div class="debug-stat">
                    <div class="debug-stat-value" id="stat-coverage" style="color:#fff">0%</div>
                    <div class="debug-stat-label">Coverage</div>
                </div>
            </div>
            <div id="i18n-progress-bar"><div id="i18n-progress-fill" style="width:0%"></div></div>
            <div id="i18n-sections-scanned">Sections: <span id="sections-list">loading...</span></div>
            <div id="i18n-base-url" style="padding:2px 10px;font-size:9px;color:#555;border-bottom:1px solid #222;word-break:break-all;"></div>
            <div class="debug-controls">
                <button class="debug-btn active" id="btn-scan-json">📡 Scan JSON</button>
                <button class="debug-btn" id="btn-highlight">⚠️ Highlight DOM</button>
                <button class="debug-btn" id="btn-english-only">🔶 Missing Only</button>
                <button class="debug-btn" id="btn-show-all">📋 Show All</button>
                <button class="debug-btn success" id="btn-submit-all">📤 Submit All</button>
                <button class="debug-btn" id="btn-submit">📤 This Lang</button>
                <button class="debug-btn" id="btn-download">💾 Download</button>
            </div>
            <div id="report-status"></div>
            <div id="i18n-debug-content">
                <div style="color:#888;padding:10px;">Loading translation files...</div>
            </div>
        `;
        document.body.appendChild(panel);

        makeDraggable(panel, document.getElementById('i18n-debug-header'));

        // Button handlers
        document.getElementById('i18n-debug-close').onclick = () => panel.remove();
        document.getElementById('btn-scan-json').onclick = () => window.i18nDebug.scanFromJSON();
        document.getElementById('btn-highlight').onclick = () => window.i18nDebug.toggleHighlight();
        document.getElementById('btn-english-only').onclick = () => window.i18nDebug.showMissingOnly();
        document.getElementById('btn-show-all').onclick = () => window.i18nDebug.showAll();
        document.getElementById('btn-submit-all').onclick = () => window.i18nDebug.submitAllLanguages();
        document.getElementById('btn-submit').onclick = () => window.i18nDebug.submitReport();
        document.getElementById('btn-download').onclick = () => window.i18nDebug.downloadReport();

        // Full JSON Scanner API
        window.i18nDebug = {
            allResults: new Map(),
            sectionsScanned: new Set(),
            lastLang: null,
            highlightActive: false,
            enTranslations: null,
            currentTranslations: null,

            // Keys that are intentionally identical (proper names, Portuguese terms)
            sameInAllLanguages: new Set([
                'nav.mediaMachine',
                'hero.begin',
                'tables.headers.portugal',
                'tables.headers.tiCpi',
                'cases.socrates.name', 'cases.socrates.operation',
                'cases.costa.name', 'cases.costa.operation',
                'cases.montenegro.name',
                'cases.mendes.name',
                'cases.albuquerque.name', 'cases.albuquerque.operation',
                'cases.salgado.name',
                'cases.galamba.name',
                'cases.calado.name',
                'cases.barroso.name',
                'cases.tableStatus.arguido',
                'goldenParachute.cases.socrates.name',
                'loopholes.averiguacao.subtitle',
                'loopholes.constitutionalCourt.subtitle',
                'eliteLaws.acordao179.title',
                'eliteLaws.acordao377.title'
            ]),

            async scanFromJSON() {
                const currentLang = window.i18n?.currentLang || 'en';
                document.getElementById('debug-lang').textContent = currentLang.toUpperCase();
                document.getElementById('scan-status').innerHTML = '<span class="scan-indicator">Loading...</span>';

                // Detect base URL - works from any page/subdirectory
                const getBaseUrl = () => {
                    // Check if there's a base tag
                    const baseTag = document.querySelector('base');
                    if (baseTag) return baseTag.href;

                    // Check for script src to find where debug-translations.js is loaded from
                    const scripts = document.querySelectorAll('script[src*="debug-translations"]');
                    if (scripts.length > 0) {
                        const src = scripts[0].src;
                        return src.substring(0, src.lastIndexOf('/js/'));
                    }

                    // Check if i18n system has a basePath
                    if (window.i18n?.basePath) return window.i18n.basePath;

                    // Default: try to find from current URL by looking for known paths
                    const url = window.location.href;
                    const match = url.match(/(.*?)(\/research\/|\/countries\/|\?|#|$)/);
                    if (match) return match[1];

                    // Fallback to origin
                    return window.location.origin;
                };

                const baseUrl = getBaseUrl().replace(/\/$/, '');
                console.log('[i18n DEBUG] Base URL detected:', baseUrl);
                document.getElementById('i18n-base-url').textContent = `Base: ${baseUrl}`;

                try {
                    // Load English (base) translations
                    console.log('[i18n DEBUG] Loading:', `${baseUrl}/lang/en.json`);
                    const enResponse = await fetch(`${baseUrl}/lang/en.json?t=${Date.now()}`);
                    this.enTranslations = await enResponse.json();

                    // Load current language translations
                    const langResponse = await fetch(`${baseUrl}/lang/${currentLang}.json?t=${Date.now()}`);
                    this.currentTranslations = await langResponse.json();

                    this.lastLang = currentLang;
                    this.compareTranslations();

                    document.getElementById('scan-status').innerHTML = '✓';
                    setTimeout(() => document.getElementById('scan-status').innerHTML = '', 2000);
                } catch (err) {
                    console.error('[i18n DEBUG] Error loading translations:', err);
                    document.getElementById('scan-status').innerHTML = '✗ Error';
                    document.getElementById('i18n-debug-content').innerHTML =
                        `<div style="color:#ff4444;padding:10px;">Error loading files: ${err.message}</div>`;
                }
            },

            compareTranslations() {
                this.allResults.clear();
                this.sectionsScanned.clear();

                const flattenObject = (obj, prefix = '') => {
                    const result = {};
                    for (const [key, value] of Object.entries(obj)) {
                        const newKey = prefix ? `${prefix}.${key}` : key;
                        if (value && typeof value === 'object' && !Array.isArray(value)) {
                            Object.assign(result, flattenObject(value, newKey));
                        } else {
                            result[newKey] = value;
                        }
                    }
                    return result;
                };

                const enFlat = flattenObject(this.enTranslations);
                const currentFlat = flattenObject(this.currentTranslations);

                // Compare all English keys
                for (const [key, enValue] of Object.entries(enFlat)) {
                    if (typeof enValue !== 'string') continue;

                    const section = key.split('.')[0];
                    this.sectionsScanned.add(section);

                    const currentValue = currentFlat[key];
                    let status = 'ok';

                    if (!currentValue) {
                        status = 'missing';
                    } else if (
                        this.lastLang !== 'en' &&
                        currentValue === enValue &&
                        !this.sameInAllLanguages.has(key)
                    ) {
                        status = 'english';
                    }

                    this.allResults.set(key, {
                        key,
                        enValue,
                        currentValue: currentValue || '',
                        status,
                        section
                    });
                }

                this.updateStats();
                this.renderResults();
            },

            updateStats() {
                const results = Array.from(this.allResults.values());
                const total = results.length;
                const ok = results.filter(r => r.status === 'ok').length;
                const missing = results.filter(r => r.status !== 'ok').length;
                const coverage = total > 0 ? Math.round((ok / total) * 100) : 0;

                document.getElementById('stat-total').textContent = total;
                document.getElementById('stat-ok').textContent = ok;
                document.getElementById('stat-english').textContent = missing;
                document.getElementById('stat-coverage').textContent = coverage + '%';
                document.getElementById('i18n-progress-fill').style.width = coverage + '%';

                // Color the coverage based on percentage
                const coverageEl = document.getElementById('stat-coverage');
                coverageEl.style.color = coverage >= 95 ? '#00ff41' : coverage >= 80 ? '#ffaa00' : '#ff4444';

                document.getElementById('sections-list').textContent =
                    Array.from(this.sectionsScanned).join(', ');
            },

            renderResults(filter = null) {
                const container = document.getElementById('i18n-debug-content');
                let results = Array.from(this.allResults.values());

                if (filter === 'english') {
                    results = results.filter(r => r.status !== 'ok');
                }

                // Group by section
                const bySection = {};
                results.forEach(r => {
                    if (!bySection[r.section]) bySection[r.section] = [];
                    bySection[r.section].push(r);
                });

                if (Object.keys(bySection).length === 0) {
                    container.innerHTML = '<div style="color:#888;padding:10px;">No results. Click "Scan JSON" to analyze.</div>';
                    return;
                }

                let html = '';
                Object.entries(bySection)
                    .sort((a, b) => {
                        // Sort by missing count descending
                        const aMissing = a[1].filter(r => r.status !== 'ok').length;
                        const bMissing = b[1].filter(r => r.status !== 'ok').length;
                        return bMissing - aMissing;
                    })
                    .forEach(([section, items]) => {
                        const missing = items.filter(r => r.status !== 'ok').length;
                        const ok = items.filter(r => r.status === 'ok').length;
                        const sectionCoverage = Math.round((ok / items.length) * 100);

                        let coverageClass = 'coverage-low';
                        if (sectionCoverage >= 100) coverageClass = 'coverage-100';
                        else if (sectionCoverage >= 80) coverageClass = 'coverage-high';
                        else if (sectionCoverage >= 50) coverageClass = 'coverage-med';

                        const headerClass = sectionCoverage === 100 ? 'complete' : '';

                        html += `<div class="debug-section-header ${headerClass}">
                            <span>${section.toUpperCase()} <span class="section-coverage ${coverageClass}">${sectionCoverage}%</span></span>
                            <span style="font-weight:normal">✓${ok} ⚠${missing}</span>
                        </div>`;

                        items.forEach(r => {
                            const displayValue = r.status === 'ok'
                                ? this.escapeHtml(r.currentValue.substring(0, 60))
                                : `<span class="en-val">EN: ${this.escapeHtml(r.enValue.substring(0, 50))}</span>`;

                            html += `<div class="debug-item ${r.status}" data-key="${r.key}">
                                <div class="debug-key">${r.key}</div>
                                <div class="debug-value">${displayValue}</div>
                            </div>`;
                        });
                    });

                container.innerHTML = html;

                // Add click handlers to highlight in DOM
                container.querySelectorAll('.debug-item').forEach(item => {
                    item.onclick = () => this.highlightInDOM(item.dataset.key);
                });
            },

            showMissingOnly() {
                this.renderResults('english');
                document.getElementById('btn-english-only').classList.add('active');
                document.getElementById('btn-show-all').classList.remove('active');
            },

            showAll() {
                this.renderResults();
                document.getElementById('btn-show-all').classList.add('active');
                document.getElementById('btn-english-only').classList.remove('active');
            },

            toggleHighlight() {
                this.highlightActive = !this.highlightActive;
                const btn = document.getElementById('btn-highlight');

                if (this.highlightActive) {
                    btn.classList.add('active');
                    document.querySelectorAll('[data-i18n]').forEach(el => {
                        const key = el.getAttribute('data-i18n');
                        const result = this.allResults.get(key);
                        if (result && result.status !== 'ok') {
                            el.classList.add('highlight-english');
                        }
                    });
                } else {
                    btn.classList.remove('active');
                    document.querySelectorAll('.highlight-english').forEach(el => {
                        el.classList.remove('highlight-english');
                    });
                }
            },

            highlightInDOM(key) {
                const el = document.querySelector(`[data-i18n="${key}"]`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.style.outline = '4px solid #e94560';
                    el.style.outlineOffset = '4px';
                    setTimeout(() => {
                        el.style.outline = '';
                        el.style.outlineOffset = '';
                    }, 3000);
                } else {
                    // Show notification that key is not in current DOM
                    const statusEl = document.getElementById('report-status');
                    statusEl.style.display = 'block';
                    statusEl.style.background = '#333';
                    statusEl.textContent = `Key "${key}" not found in current view`;
                    setTimeout(() => statusEl.style.display = 'none', 3000);
                }
            },

            escapeHtml(text) {
                if (!text) return '';
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            },

            downloadReport() {
                const results = Array.from(this.allResults.values());

                // Build section-by-section report
                const bySection = {};
                results.forEach(r => {
                    if (!bySection[r.section]) {
                        bySection[r.section] = { total: 0, translated: 0, missing: [], keys: [] };
                    }
                    bySection[r.section].total++;
                    if (r.status === 'ok') {
                        bySection[r.section].translated++;
                    } else {
                        bySection[r.section].missing.push({
                            key: r.key,
                            englishValue: r.enValue,
                            currentValue: r.currentValue || null
                        });
                    }
                });

                // Calculate section coverages
                Object.keys(bySection).forEach(section => {
                    const s = bySection[section];
                    s.coverage = Math.round((s.translated / s.total) * 100) + '%';
                });

                const report = {
                    language: this.lastLang,
                    timestamp: new Date().toISOString(),
                    summary: {
                        totalKeys: results.length,
                        translated: results.filter(r => r.status === 'ok').length,
                        missing: results.filter(r => r.status !== 'ok').length,
                        coverage: document.getElementById('stat-coverage').textContent
                    },
                    sections: bySection,
                    allMissingKeys: results
                        .filter(r => r.status !== 'ok')
                        .map(r => ({
                            key: r.key,
                            section: r.section,
                            englishValue: r.enValue
                        }))
                };

                // Download as JSON
                const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `i18n-report-${this.lastLang}-${new Date().toISOString().slice(0,10)}.json`;
                a.click();
                URL.revokeObjectURL(url);

                const statusEl = document.getElementById('report-status');
                statusEl.style.display = 'block';
                statusEl.style.background = '#00aa55';
                statusEl.textContent = `✓ Report downloaded`;
                setTimeout(() => statusEl.style.display = 'none', 3000);
            },

            async submitReport() {
                const statusEl = document.getElementById('report-status');
                statusEl.style.display = 'block';
                statusEl.style.background = '#333';
                statusEl.textContent = 'Submitting report...';

                const results = Array.from(this.allResults.values());

                // Build section-by-section report
                const bySection = {};
                results.forEach(r => {
                    if (!bySection[r.section]) {
                        bySection[r.section] = { total: 0, translated: 0, missing: [] };
                    }
                    bySection[r.section].total++;
                    if (r.status === 'ok') {
                        bySection[r.section].translated++;
                    } else {
                        bySection[r.section].missing.push({
                            key: r.key,
                            englishValue: r.enValue,
                            currentValue: r.currentValue || null
                        });
                    }
                });

                // Calculate section coverages
                Object.keys(bySection).forEach(section => {
                    const s = bySection[section];
                    s.coverage = Math.round((s.translated / s.total) * 100) + '%';
                });

                const report = {
                    language: this.lastLang,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    stats: {
                        total: results.length,
                        translated: results.filter(r => r.status === 'ok').length,
                        missing: results.filter(r => r.status !== 'ok').length,
                        coverage: document.getElementById('stat-coverage').textContent
                    },
                    sections: bySection,
                    missing: results.filter(r => r.status !== 'ok').map(r => ({
                        key: r.key,
                        section: r.section,
                        englishValue: r.enValue
                    }))
                };

                try {
                    const response = await fetch('http://localhost:9998/report', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(report)
                    });
                    const result = await response.json();
                    if (result.success) {
                        statusEl.style.background = '#00aa55';
                        statusEl.textContent = `✓ ${result.filename}`;
                    } else {
                        throw new Error(result.error);
                    }
                } catch (err) {
                    statusEl.style.background = '#ff4444';
                    statusEl.textContent = `✗ ${err.message}`;
                }
                setTimeout(() => statusEl.style.display = 'none', 4000);
            },

            async submitAllLanguages() {
                const statusEl = document.getElementById('report-status');
                statusEl.style.display = 'block';
                statusEl.style.background = '#333';

                // All supported languages (except English which is the base)
                const languages = [
                    'pt', 'es', 'fr', 'de', 'it', 'nl', 'pl', 'ro', 'el',
                    'cs', 'hu', 'sv', 'da', 'fi', 'bg', 'hr', 'sk', 'sl',
                    'et', 'lv', 'lt', 'mt', 'ga'
                ];

                const baseUrl = this.getBaseUrl();
                let completed = 0;
                let failed = 0;
                const results = [];

                // Load English base once
                statusEl.textContent = `Loading English base...`;
                const enResponse = await fetch(`${baseUrl}/lang/en.json?t=${Date.now()}`);
                const enTranslations = await enResponse.json();
                const enFlat = this.flattenObject(enTranslations);

                for (const lang of languages) {
                    statusEl.textContent = `Processing ${lang.toUpperCase()}... (${completed + 1}/${languages.length})`;

                    try {
                        // Load language file
                        const langResponse = await fetch(`${baseUrl}/lang/${lang}.json?t=${Date.now()}`);
                        const langTranslations = await langResponse.json();
                        const langFlat = this.flattenObject(langTranslations);

                        // Compare
                        const comparison = this.compareForReport(enFlat, langFlat, lang);

                        // Build report
                        const report = {
                            language: lang,
                            timestamp: new Date().toISOString(),
                            url: window.location.href,
                            stats: {
                                total: comparison.total,
                                translated: comparison.translated,
                                missing: comparison.missing,
                                coverage: comparison.coverage
                            },
                            sections: comparison.bySection,
                            missing: comparison.missingKeys
                        };

                        // Submit
                        const response = await fetch('http://localhost:9998/report', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(report)
                        });
                        const result = await response.json();

                        if (result.success) {
                            completed++;
                            results.push({ lang, status: 'ok', coverage: comparison.coverage });
                        } else {
                            throw new Error(result.error);
                        }
                    } catch (err) {
                        failed++;
                        results.push({ lang, status: 'error', error: err.message });
                        console.error(`[i18n] Failed to submit ${lang}:`, err);
                    }

                    // Small delay to not overwhelm server
                    await new Promise(r => setTimeout(r, 100));
                }

                // Show summary
                statusEl.style.background = failed === 0 ? '#00aa55' : '#ffaa00';
                statusEl.textContent = `✓ ${completed} submitted, ${failed} failed`;

                // Log detailed results
                console.log('[i18n] All languages submitted:', results);

                setTimeout(() => statusEl.style.display = 'none', 5000);
            },

            getBaseUrl() {
                const baseTag = document.querySelector('base');
                if (baseTag) return baseTag.href;

                const scripts = document.querySelectorAll('script[src*="debug-translations"]');
                if (scripts.length > 0) {
                    const src = scripts[0].src;
                    return src.substring(0, src.lastIndexOf('/js/'));
                }

                if (window.i18n?.basePath) return window.i18n.basePath;

                const url = window.location.href;
                const match = url.match(/(.*?)(\/research\/|\/countries\/|\?|#|$)/);
                if (match) return match[1];

                return window.location.origin;
            },

            flattenObject(obj, prefix = '') {
                const result = {};
                for (const [key, value] of Object.entries(obj)) {
                    const newKey = prefix ? `${prefix}.${key}` : key;
                    if (value && typeof value === 'object' && !Array.isArray(value)) {
                        Object.assign(result, this.flattenObject(value, newKey));
                    } else if (typeof value === 'string') {
                        result[newKey] = value;
                    }
                }
                return result;
            },

            compareForReport(enFlat, langFlat, langCode) {
                const bySection = {};
                const missingKeys = [];
                let translated = 0;
                let missing = 0;

                for (const [key, enValue] of Object.entries(enFlat)) {
                    const section = key.split('.')[0];
                    if (!bySection[section]) {
                        bySection[section] = { total: 0, translated: 0, missing: [] };
                    }
                    bySection[section].total++;

                    const langValue = langFlat[key];
                    const isTranslated = langValue &&
                        (langValue !== enValue || this.sameInAllLanguages.has(key));

                    if (isTranslated) {
                        translated++;
                        bySection[section].translated++;
                    } else {
                        missing++;
                        bySection[section].missing.push({
                            key,
                            englishValue: enValue,
                            currentValue: langValue || null
                        });
                        missingKeys.push({ key, section, englishValue: enValue });
                    }
                }

                // Calculate coverages
                Object.keys(bySection).forEach(section => {
                    const s = bySection[section];
                    s.coverage = Math.round((s.translated / s.total) * 100) + '%';
                });

                const total = translated + missing;
                return {
                    total,
                    translated,
                    missing,
                    coverage: Math.round((translated / total) * 100) + '%',
                    bySection,
                    missingKeys
                };
            }
        };

        function makeDraggable(element, handle) {
            let offsetX = 0, offsetY = 0, startX = 0, startY = 0, isDragging = false;
            handle.onmousedown = e => {
                e.preventDefault();
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = element.getBoundingClientRect();
                offsetX = rect.left;
                offsetY = rect.top;
                document.onmouseup = () => { isDragging = false; document.onmouseup = null; document.onmousemove = null; };
                document.onmousemove = e => {
                    if (!isDragging) return;
                    element.style.left = (offsetX + e.clientX - startX) + 'px';
                    element.style.top = (offsetY + e.clientY - startY) + 'px';
                    element.style.right = 'auto';
                };
            };
        }

        // Auto-scan on load
        setTimeout(() => window.i18nDebug.scanFromJSON(), 500);

        // Re-scan on language change
        setInterval(() => {
            const currentLang = window.i18n?.currentLang;
            if (currentLang && currentLang !== window.i18nDebug.lastLang) {
                window.i18nDebug.scanFromJSON();
            }
        }, 2000);
    }
})();
