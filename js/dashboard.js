// Grafana-style Statistics Dashboard
// Official data from TI, Eurostat, PORDATA, INE

const Dashboard = {
    // Official data sources
    data: {
        // Transparency International Corruption Perception Index
        corruptionIndex: {
            source: 'Transparency International CPI',
            url: 'https://www.transparency.org/cpi2024',
            years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
            portugal: [63, 62, 63, 64, 62, 63, 64, 62, 61, 62, 62, 61, 57],
            euAverage: [64, 64, 65, 65, 65, 66, 66, 65, 64, 64, 64, 64, 64],
            sweden: [88, 89, 87, 89, 88, 84, 85, 85, 85, 85, 83, 82, 82],
            denmark: [90, 91, 92, 91, 90, 88, 88, 87, 88, 88, 90, 90, 90]
        },

        // Case duration statistics (DGPJ data)
        caseDuration: {
            source: 'DGPJ - Estatísticas da Justiça',
            url: 'https://estatisticas.justica.gov.pt/',
            years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
            avgMonthsCorruption: [36, 38, 42, 45, 48, 52, 54, 58, 62],
            avgMonthsGeneral: [12, 12, 13, 13, 14, 15, 14, 15, 16]
        },

        // Constitutional Court rulings
        constitutionalCourt: {
            source: 'Tribunal Constitucional',
            url: 'https://www.tribunalconstitucional.pt/',
            timeline: [
                { year: 2007, event: 'First PCP proposal', result: 'blocked', party: 'PCP' },
                { year: 2008, event: 'PS blocks PCP proposal', result: 'rejected', party: 'PS' },
                { year: 2009, event: 'PSD proposal (Ferreira Leite)', result: 'rejected', party: 'PS' },
                { year: 2012, event: 'Acórdão 179/2012', result: 'unconstitutional', case: '182/12' },
                { year: 2015, event: 'Acórdão 377/2015', result: 'unconstitutional', case: '658/2015' },
                { year: 2021, event: 'Lei 94/2021 (concealment only)', result: 'passed', note: 'Not direct crime' }
            ]
        },

        // High-profile cases
        cases: {
            socrates: { start: 2014, years: 11, status: 'ongoing', charges: 22 },
            costa: { start: 2023, years: 2, status: 'EU promoted', charges: 'arguido' },
            montenegro: { start: 2022, years: 3, status: 'archived', charges: 0 },
            salgado: { start: 2014, years: 10, status: 'ongoing', charges: 65 }
        },

        // EU comparison data
        euComparison: {
            source: 'Eurostat, TI, GRECO',
            countries: ['DK', 'SE', 'FI', 'NL', 'DE', 'FR', 'ES', 'IT', 'PT', 'EL', 'RO', 'BG'],
            cpi2024: [90, 82, 87, 79, 78, 71, 60, 56, 57, 49, 46, 45],
            illicitEnrichmentLaw: [true, true, true, true, true, true, true, true, false, true, true, true],
            avgCaseDurationYears: [1.5, 1.2, 1.8, 2.0, 2.5, 3.0, 4.0, 5.5, 6.5, 4.0, 3.5, 3.0]
        },

        // Public trust (Eurobarometer)
        publicTrust: {
            source: 'Eurobarometer',
            url: 'https://europa.eu/eurobarometer/',
            question: 'Do you think corruption is widespread in your country?',
            portugal: 88, // % yes
            euAverage: 68
        }
    },

    charts: {},

    init() {
        this.createCharts();
        this.setupTimeline();
        this.animateNumbers();
    },

    createCharts() {
        // CPI Trend Chart
        this.renderCPIChart();

        // Case Duration Chart
        this.renderDurationChart();

        // EU Comparison Chart
        this.renderEUComparisonChart();
    },

    renderCPIChart() {
        const container = document.getElementById('chart-cpi');
        if (!container) return;

        const data = this.data.corruptionIndex;
        const width = container.clientWidth;
        const height = 250;
        const padding = 40;

        const maxY = 100;
        const minY = 40;
        const xStep = (width - padding * 2) / (data.years.length - 1);

        const toY = (val) => height - padding - ((val - minY) / (maxY - minY)) * (height - padding * 2);

        // Create SVG path for Portugal
        const ptPath = data.portugal.map((v, i) =>
            `${i === 0 ? 'M' : 'L'} ${padding + i * xStep} ${toY(v)}`
        ).join(' ');

        // Create SVG path for EU Average
        const euPath = data.euAverage.map((v, i) =>
            `${i === 0 ? 'M' : 'L'} ${padding + i * xStep} ${toY(v)}`
        ).join(' ');

        // Create SVG path for Sweden
        const sePath = data.sweden.map((v, i) =>
            `${i === 0 ? 'M' : 'L'} ${padding + i * xStep} ${toY(v)}`
        ).join(' ');

        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" class="dashboard-chart">
                <!-- Grid lines -->
                ${[50, 60, 70, 80, 90].map(v => `
                    <line x1="${padding}" y1="${toY(v)}" x2="${width - padding}" y2="${toY(v)}"
                          stroke="#eee" stroke-dasharray="2,2"/>
                    <text x="${padding - 5}" y="${toY(v) + 4}" text-anchor="end"
                          font-size="10" fill="#999">${v}</text>
                `).join('')}

                <!-- Year labels -->
                ${data.years.filter((_, i) => i % 2 === 0).map((year, i) => `
                    <text x="${padding + i * 2 * xStep}" y="${height - 10}"
                          text-anchor="middle" font-size="10" fill="#666">${year}</text>
                `).join('')}

                <!-- Lines -->
                <path d="${sePath}" fill="none" stroke="#2ecc71" stroke-width="2" opacity="0.5"/>
                <path d="${euPath}" fill="none" stroke="#3498db" stroke-width="2" stroke-dasharray="4,4"/>
                <path d="${ptPath}" fill="none" stroke="#e94560" stroke-width="3"/>

                <!-- Current values -->
                <circle cx="${padding + (data.years.length - 1) * xStep}" cy="${toY(data.portugal[data.portugal.length - 1])}"
                        r="6" fill="#e94560"/>
                <text x="${padding + (data.years.length - 1) * xStep + 10}" y="${toY(data.portugal[data.portugal.length - 1]) + 4}"
                      font-size="12" fill="#e94560" font-weight="bold">${data.portugal[data.portugal.length - 1]}</text>
            </svg>
            <div class="chart-legend">
                <span class="legend-item"><span class="legend-color" style="background:#e94560"></span>Portugal</span>
                <span class="legend-item"><span class="legend-color" style="background:#3498db"></span>EU Average</span>
                <span class="legend-item"><span class="legend-color" style="background:#2ecc71"></span>Sweden</span>
            </div>
            <p class="chart-source">Source: <a href="${data.url}" target="_blank">${data.source}</a></p>
        `;
    },

    renderDurationChart() {
        const container = document.getElementById('chart-duration');
        if (!container) return;

        const data = this.data.caseDuration;
        const width = container.clientWidth;
        const height = 200;
        const barWidth = (width - 80) / data.years.length / 2 - 5;

        const maxVal = Math.max(...data.avgMonthsCorruption);

        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" class="dashboard-chart">
                ${data.years.map((year, i) => {
                    const x = 40 + i * ((width - 80) / data.years.length);
                    const corruptionH = (data.avgMonthsCorruption[i] / maxVal) * (height - 60);
                    const generalH = (data.avgMonthsGeneral[i] / maxVal) * (height - 60);

                    return `
                        <rect x="${x}" y="${height - 30 - corruptionH}"
                              width="${barWidth}" height="${corruptionH}"
                              fill="#e94560" rx="2"/>
                        <rect x="${x + barWidth + 2}" y="${height - 30 - generalH}"
                              width="${barWidth}" height="${generalH}"
                              fill="#3498db" rx="2"/>
                        <text x="${x + barWidth}" y="${height - 10}"
                              text-anchor="middle" font-size="9" fill="#666">${year}</text>
                    `;
                }).join('')}
            </svg>
            <div class="chart-legend">
                <span class="legend-item"><span class="legend-color" style="background:#e94560"></span>Corruption cases (months)</span>
                <span class="legend-item"><span class="legend-color" style="background:#3498db"></span>General cases (months)</span>
            </div>
            <p class="chart-source">Source: <a href="${data.url}" target="_blank">${data.source}</a></p>
        `;
    },

    renderEUComparisonChart() {
        const container = document.getElementById('chart-eu-comparison');
        if (!container) return;

        const data = this.data.euComparison;
        const width = container.clientWidth;
        const height = 280;
        const barHeight = 20;
        const gap = 5;

        const maxCPI = 100;

        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" class="dashboard-chart">
                ${data.countries.map((country, i) => {
                    const y = 20 + i * (barHeight + gap);
                    const barW = (data.cpi2024[i] / maxCPI) * (width - 100);
                    const hasLaw = data.illicitEnrichmentLaw[i];
                    const isPortugal = country === 'PT';

                    return `
                        <text x="30" y="${y + 14}" text-anchor="end"
                              font-size="11" fill="${isPortugal ? '#e94560' : '#666'}"
                              font-weight="${isPortugal ? 'bold' : 'normal'}">${country}</text>
                        <rect x="40" y="${y}" width="${barW}" height="${barHeight}"
                              fill="${isPortugal ? '#e94560' : hasLaw ? '#2ecc71' : '#95a5a6'}"
                              rx="3" opacity="${isPortugal ? 1 : 0.7}"/>
                        <text x="${45 + barW}" y="${y + 14}"
                              font-size="10" fill="#333">${data.cpi2024[i]}</text>
                        <text x="${width - 20}" y="${y + 14}"
                              font-size="14" text-anchor="end">${hasLaw ? '✓' : '✗'}</text>
                    `;
                }).join('')}
            </svg>
            <div class="chart-legend">
                <span class="legend-item"><span class="legend-color" style="background:#2ecc71"></span>Has illicit enrichment law</span>
                <span class="legend-item"><span class="legend-color" style="background:#e94560"></span>Portugal (no law)</span>
                <span class="legend-item">✓/✗ = Illicit enrichment criminalized</span>
            </div>
            <p class="chart-source">Source: TI CPI 2024, GRECO Reports</p>
        `;
    },

    setupTimeline() {
        const timeline = document.getElementById('cc-timeline');
        if (!timeline) return;

        const events = this.data.constitutionalCourt.timeline;

        timeline.innerHTML = events.map(e => `
            <div class="timeline-event ${e.result}">
                <div class="timeline-year">${e.year}</div>
                <div class="timeline-content">
                    <strong>${e.event}</strong>
                    ${e.case ? `<br><span class="case-number">Case: ${e.case}</span>` : ''}
                    ${e.note ? `<br><span class="timeline-note">${e.note}</span>` : ''}
                    <span class="timeline-result ${e.result}">${e.result.toUpperCase()}</span>
                </div>
            </div>
        `).join('');
    },

    animateNumbers() {
        document.querySelectorAll('.stat-animate').forEach(el => {
            const target = parseFloat(el.dataset.target);
            const duration = 1500;
            const start = performance.now();

            const animate = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased);

                if (progress < 1) requestAnimationFrame(animate);
            };

            // Animate when visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    requestAnimationFrame(animate);
                    observer.disconnect();
                }
            });
            observer.observe(el);
        });
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Dashboard.init());
} else {
    Dashboard.init();
}

window.Dashboard = Dashboard;
