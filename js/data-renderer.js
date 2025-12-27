/**
 * Data Renderer - Loads and renders country corruption data from JSON
 */

const DataRenderer = {
    currentCountry: 'PT',
    data: null,

    async init(countryCode = 'PT') {
        this.currentCountry = countryCode;
        await this.loadData();
        this.renderAll();
    },

    async loadData() {
        try {
            const response = await fetch(`/data/countries/${this.currentCountry}.json`);
            if (!response.ok) throw new Error(`Failed to load ${this.currentCountry}.json`);
            this.data = await response.json();
        } catch (err) {
            console.error('[DataRenderer] Error loading data:', err);
        }
    },

    renderAll() {
        if (!this.data) return;

        this.renderCountryHeader();
        this.renderStatistics();
        this.renderPoliticians();
        this.renderCases();
        this.renderScandals();
        this.renderLoopholes();
        this.renderMedia();
        this.renderGRECO();
        this.renderComparativeTables();
    },

    renderCountryHeader() {
        const container = document.getElementById('country-header');
        if (!container) return;

        const { country } = this.data;
        container.innerHTML = `
            <div class="text-center mb-12">
                <h1 class="text-4xl md:text-5xl font-serif font-bold text-white mb-4">${country.name}</h1>
                <div class="flex flex-wrap justify-center gap-8">
                    <div class="text-center">
                        <div class="text-4xl font-bold ${country.cpiScore < 50 ? 'text-bad' : country.cpiScore < 65 ? 'text-warning' : 'text-good'}">${country.cpiScore}/100</div>
                        <div class="text-white/60 text-sm">CPI Score 2024</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-warning">#${country.cpiRank}</div>
                        <div class="text-white/60 text-sm">Global Ranking</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-bad">${country.eurobarometerCorruptionPerception}%</div>
                        <div class="text-white/60 text-sm">Citizens: Corruption Widespread</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-bad">${country.grecoComplianceRate}%</div>
                        <div class="text-white/60 text-sm">GRECO Compliance</div>
                    </div>
                </div>
            </div>
        `;
    },

    renderStatistics() {
        const container = document.getElementById('statistics-section');
        if (!container || !this.data.statistics) return;

        const { statistics } = this.data;

        let html = `
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <!-- Legal System Stats -->
                <div class="bg-secondary/50 rounded-xl p-6 border border-white/10">
                    <h3 class="text-lg font-bold text-accent mb-4">Legal System</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-white/60">Avg. Case Duration</span>
                            <span class="text-bad font-bold">${statistics.legalSystem.averageCorruptionCaseDuration} years</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-white/60">Prescription Rate</span>
                            <span class="text-bad font-bold">${statistics.legalSystem.prescriptionRate}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-white/60">Conviction Rate</span>
                            <span class="text-bad font-bold">${statistics.legalSystem.convictionRate}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-white/60">Suspended Sentences</span>
                            <span class="text-bad font-bold">${statistics.legalSystem.suspendedSentenceRate}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-white/60">Prosecutors: Periods Insufficient</span>
                            <span class="text-bad font-bold">${statistics.legalSystem.prosecutorsSayPeriodsInsufficient}%</span>
                        </div>
                    </div>
                </div>

                <!-- Eurobarometer -->
                <div class="bg-secondary/50 rounded-xl p-6 border border-white/10">
                    <h3 class="text-lg font-bold text-accent mb-4">Eurobarometer ${statistics.eurobarometer.year}</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-white/60">Corruption Widespread</span>
                            <span class="text-bad font-bold">${statistics.eurobarometer.corruptionWidespread}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-white/60">Affects Daily Life</span>
                            <span class="text-bad font-bold">${statistics.eurobarometer.corruptionAffectsDaily}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-white/60">Trust in Government</span>
                            <span class="text-warning font-bold">${statistics.eurobarometer.trustInGovernment}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-white/60">Trust in Parliament</span>
                            <span class="text-bad font-bold">${statistics.eurobarometer.trustInParliament}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-white/60">Trust in Political Parties</span>
                            <span class="text-bad font-bold">${statistics.eurobarometer.trustInPoliticalParties}%</span>
                        </div>
                    </div>
                </div>

                <!-- Referendums -->
                <div class="bg-secondary/50 rounded-xl p-6 border border-white/10">
                    <h3 class="text-lg font-bold text-accent mb-4">Direct Democracy</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-white/60">Binding Referendums Since 1974</span>
                            <span class="text-bad font-bold">${statistics.referendums.totalBindingSince1974}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-white/60">Total Referendums</span>
                            <span class="text-warning font-bold">${statistics.referendums.totalHeldSince1974}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-white/60">Signatures Required</span>
                            <span class="text-white font-bold">${statistics.referendums.signaturesRequired.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-white/60">Parliament Can Block</span>
                            <span class="${statistics.referendums.parliamentCanBlock ? 'text-bad' : 'text-good'} font-bold">${statistics.referendums.parliamentCanBlock ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CPI History Chart -->
            <div class="bg-secondary/50 rounded-xl p-6 border border-white/10 mb-8">
                <h3 class="text-lg font-bold text-accent mb-4">CPI Score History</h3>
                <div class="flex items-end gap-4 h-48">
                    ${statistics.cpiHistory.map(y => `
                        <div class="flex-1 flex flex-col items-center">
                            <div class="w-full bg-primary rounded-t" style="height: ${y.score * 1.5}px">
                                <div class="text-center text-xs text-white pt-2">${y.score}</div>
                            </div>
                            <div class="text-xs text-white/60 mt-2">${y.year}</div>
                            <div class="text-xs ${y.change > 0 ? 'text-good' : y.change < 0 ? 'text-bad' : 'text-white/40'}">${y.change > 0 ? '+' : ''}${y.change}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    renderComparativeTables() {
        const container = document.getElementById('comparative-tables');
        if (!container || !this.data.statistics?.comparativeEU) return;

        const { comparativeEU } = this.data.statistics;

        let html = `
            <h2 class="text-2xl font-serif font-bold text-white mb-6">Comparative EU Analysis</h2>

            <!-- Immunity Comparison -->
            <div class="bg-secondary/50 rounded-xl p-6 border border-white/10 mb-6 overflow-x-auto">
                <h3 class="text-lg font-bold text-accent mb-4">Parliamentary Immunity</h3>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-white/20">
                            <th class="py-3 px-4 text-left text-white/60">Country</th>
                            <th class="py-3 px-4 text-left text-white/60">Immunity Scope</th>
                            <th class="py-3 px-4 text-center text-white/60">Can Block Investigation?</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${comparativeEU.immunity.map(row => `
                            <tr class="border-b border-white/10 ${row.country === this.data.country.name ? 'bg-bad/10' : ''}">
                                <td class="py-3 px-4 text-white font-bold">${row.country}</td>
                                <td class="py-3 px-4 text-white/80">${row.scope}</td>
                                <td class="py-3 px-4 text-center ${row.canBlock ? 'text-bad' : 'text-good'} font-bold">${row.canBlock ? 'YES' : 'No'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Prescription Comparison -->
            <div class="bg-secondary/50 rounded-xl p-6 border border-white/10 mb-6 overflow-x-auto">
                <h3 class="text-lg font-bold text-accent mb-4">Statute of Limitations (Prescription)</h3>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-white/20">
                            <th class="py-3 px-4 text-left text-white/60">Country</th>
                            <th class="py-3 px-4 text-center text-white/60">Period</th>
                            <th class="py-3 px-4 text-center text-white/60">Clock Starts</th>
                            <th class="py-3 px-4 text-center text-white/60">Can Suspend?</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${comparativeEU.prescription.map(row => `
                            <tr class="border-b border-white/10 ${row.country === this.data.country.name ? 'bg-bad/10' : ''}">
                                <td class="py-3 px-4 text-white font-bold">${row.country}</td>
                                <td class="py-3 px-4 text-center text-white/80">${row.period}</td>
                                <td class="py-3 px-4 text-center text-white/80">${row.clockStarts}</td>
                                <td class="py-3 px-4 text-center ${row.canSuspend === 'Limited' ? 'text-bad' : 'text-good'}">${row.canSuspend}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Pension Forfeiture Comparison -->
            <div class="bg-secondary/50 rounded-xl p-6 border border-white/10 overflow-x-auto">
                <h3 class="text-lg font-bold text-accent mb-4">Pension Forfeiture for Corruption</h3>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-white/20">
                            <th class="py-3 px-4 text-left text-white/60">Country</th>
                            <th class="py-3 px-4 text-center text-white/60">Has Forfeiture?</th>
                            <th class="py-3 px-4 text-left text-white/60">Conditions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${comparativeEU.pensionForfeiture.map(row => `
                            <tr class="border-b border-white/10 ${row.country === this.data.country.name ? 'bg-bad/10' : ''}">
                                <td class="py-3 px-4 text-white font-bold">${row.country}</td>
                                <td class="py-3 px-4 text-center ${row.hasForfeiture ? 'text-good' : 'text-bad'} font-bold">${row.hasForfeiture ? 'Yes' : 'NO'}</td>
                                <td class="py-3 px-4 text-white/80">${row.conditions}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    },

    renderPoliticians() {
        const container = document.getElementById('politicians-section');
        if (!container) return;

        const { politicians } = this.data;

        container.innerHTML = `
            <h2 class="text-2xl font-serif font-bold text-white mb-6">Politicians Database</h2>
            <div class="grid md:grid-cols-2 gap-4">
                ${politicians.map(p => `
                    <div class="bg-secondary/50 rounded-xl p-4 border border-white/10">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h3 class="font-bold text-white">${p.name}</h3>
                                <span class="text-xs px-2 py-1 rounded bg-${p.partyAbbrev === 'PS' ? 'ps' : p.partyAbbrev === 'PSD' ? 'psd' : 'accent'}/20 text-${p.partyAbbrev === 'PS' ? 'ps' : p.partyAbbrev === 'PSD' ? 'psd' : 'accent'}">${p.partyAbbrev || 'N/A'}</span>
                            </div>
                            ${p.euPositions?.length ? '<span class="text-xs px-2 py-1 rounded bg-warning/20 text-warning">EU Position</span>' : ''}
                        </div>
                        <div class="text-sm text-white/60 space-y-1">
                            ${p.positions.slice(0, 2).map(pos => `<div>• ${pos.title} (${pos.startDate?.split('-')[0] || '?'}-${pos.endDate?.split('-')[0] || 'present'})</div>`).join('')}
                            ${p.euPositions?.map(eu => `<div class="text-warning">• ${eu.title} @ ${eu.institution}</div>`).join('') || ''}
                        </div>
                        ${p.pensionMonthly ? `<div class="mt-2 text-bad text-sm">Pension: €${p.pensionMonthly.toLocaleString()}/month</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderCases() {
        const container = document.getElementById('cases-section');
        if (!container) return;

        const { cases } = this.data;

        container.innerHTML = `
            <h2 class="text-2xl font-serif font-bold text-white mb-6">Corruption Cases</h2>
            <div class="space-y-6">
                ${cases.map(c => `
                    <div class="bg-secondary/50 rounded-xl p-6 border border-white/10">
                        <div class="flex flex-wrap justify-between items-start gap-4 mb-4">
                            <div>
                                <span class="text-xs px-2 py-1 rounded ${this.getStatusClass(c.status)} mb-2 inline-block">${c.status.toUpperCase()}</span>
                                <h3 class="text-xl font-bold text-white">${c.name}</h3>
                                ${c.operationName ? `<div class="text-white/60">${c.operationName}</div>` : ''}
                            </div>
                            ${c.amounts?.alleged ? `<div class="text-right"><div class="text-2xl font-bold text-accent">€${(c.amounts.alleged / 1000000).toFixed(1)}M</div><div class="text-xs text-white/60">Alleged Amount</div></div>` : ''}
                        </div>

                        ${c.charges?.length ? `
                        <div class="mb-4">
                            <div class="text-sm text-white/60 mb-2">Charges:</div>
                            <div class="flex flex-wrap gap-2">
                                ${c.charges.map(ch => `<span class="text-xs px-2 py-1 rounded bg-primary/50 text-white">${ch.count ? ch.count + 'x ' : ''}${ch.type}</span>`).join('')}
                            </div>
                        </div>
                        ` : ''}

                        ${c.timeline?.length ? `
                        <div class="border-l-2 border-accent/50 pl-4 space-y-3">
                            ${c.timeline.slice(0, 5).map(t => `
                                <div class="relative">
                                    <div class="absolute -left-6 w-3 h-3 rounded-full bg-accent"></div>
                                    <div class="text-xs text-white/60">${t.date}</div>
                                    <div class="text-sm text-white">${t.event}</div>
                                </div>
                            `).join('')}
                        </div>
                        ` : ''}

                        ${c.sentence ? `
                        <div class="mt-4 p-3 bg-primary/50 rounded-lg">
                            <div class="text-sm"><strong>Sentence:</strong> ${c.sentence.prison} ${c.sentence.suspended ? '(suspended)' : ''}</div>
                            ${c.sentence.actualTimeServed ? `<div class="text-sm text-bad"><strong>Actual time served:</strong> ${c.sentence.actualTimeServed}</div>` : ''}
                        </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderScandals() {
        const container = document.getElementById('scandals-section');
        if (!container) return;

        const { scandals } = this.data;

        container.innerHTML = `
            <h2 class="text-2xl font-serif font-bold text-white mb-6">Major Scandals</h2>
            <div class="grid md:grid-cols-2 gap-6">
                ${scandals.map(s => `
                    <div class="bg-secondary/50 rounded-xl p-6 border border-white/10">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <span class="text-xs px-2 py-1 rounded bg-bad/20 text-bad">${s.category.toUpperCase()}</span>
                                <h3 class="text-lg font-bold text-white mt-2">${s.name}</h3>
                                <div class="text-sm text-white/60">${s.startYear}${s.endYear ? '-' + s.endYear : '-ongoing'}</div>
                            </div>
                            ${s.publicCost ? `<div class="text-right"><div class="text-xl font-bold text-bad">€${(s.publicCost / 1000000000).toFixed(1)}B</div><div class="text-xs text-white/60">Public Cost</div></div>` : ''}
                        </div>
                        <p class="text-sm text-white/80">${s.description}</p>
                        ${s.victimsCount ? `<div class="mt-3 text-bad text-sm"><strong>${s.victimsCount}+ victims</strong></div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderLoopholes() {
        const container = document.getElementById('loopholes-section');
        if (!container) return;

        const { legalLoopholes } = this.data;

        container.innerHTML = `
            <h2 class="text-2xl font-serif font-bold text-white mb-6">Legal Loopholes</h2>
            <div class="space-y-4">
                ${legalLoopholes.map(l => `
                    <div class="bg-secondary/50 rounded-xl p-6 border border-white/10">
                        <div class="flex items-start gap-4 mb-3">
                            <span class="text-xs px-2 py-1 rounded bg-warning/20 text-warning">${l.category.toUpperCase()}</span>
                            <h3 class="text-lg font-bold text-white">${l.name}</h3>
                        </div>
                        <p class="text-sm text-white/80 mb-3">${l.description}</p>
                        <div class="p-3 bg-bad/10 rounded-lg text-sm text-bad mb-3">
                            <strong>Effect:</strong> ${l.effect}
                        </div>
                        ${l.reformAttempts?.length ? `
                        <div class="text-sm">
                            <strong class="text-white/60">Reform Attempts:</strong>
                            ${l.reformAttempts.map(r => `<div class="ml-4 mt-1"><span class="text-white/80">${r.year}: ${r.proposal}</span> → <span class="${r.outcome === 'passed' ? 'text-good' : 'text-bad'}">${r.outcome}</span>${r.blockedBy?.length ? ` (by ${r.blockedBy.join(', ')})` : ''}</div>`).join('')}
                        </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderMedia() {
        const container = document.getElementById('media-section');
        if (!container) return;

        const { mediaOutlets } = this.data;

        container.innerHTML = `
            <h2 class="text-2xl font-serif font-bold text-white mb-6">Media Landscape</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${mediaOutlets.map(m => `
                    <div class="bg-secondary/50 rounded-xl p-4 border border-white/10">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-white">${m.name}</h3>
                            <span class="text-xs px-2 py-1 rounded ${m.stateOwned ? 'bg-warning/20 text-warning' : 'bg-primary/50 text-white/60'}">${m.type.toUpperCase()}</span>
                        </div>
                        <div class="text-sm text-white/60 mb-2">Owner: ${m.owner}</div>
                        ${m.ownerPoliticalConnection ? `<div class="text-xs text-bad">Political: ${m.ownerPoliticalConnection}</div>` : ''}
                        <div class="flex gap-2 mt-3">
                            <span class="text-xs px-2 py-1 rounded ${m.perceivedLean === 'government-aligned' ? 'bg-warning/20 text-warning' : 'bg-primary/50 text-white/60'}">${m.perceivedLean}</span>
                            <span class="text-xs px-2 py-1 rounded ${m.stateAdvertisingDependency === 'high' ? 'bg-bad/20 text-bad' : 'bg-primary/50 text-white/60'}">State ads: ${m.stateAdvertisingDependency}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderGRECO() {
        const container = document.getElementById('greco-section');
        if (!container) return;

        const { grecoRecommendations } = this.data;

        const implemented = grecoRecommendations.filter(r => r.status === 'implemented').length;
        const partial = grecoRecommendations.filter(r => r.status === 'partly-implemented').length;
        const notImpl = grecoRecommendations.filter(r => r.status === 'not-implemented').length;

        container.innerHTML = `
            <h2 class="text-2xl font-serif font-bold text-white mb-6">GRECO Recommendations</h2>
            <div class="flex gap-4 mb-6">
                <div class="text-center px-4 py-3 bg-good/10 rounded-lg">
                    <div class="text-2xl font-bold text-good">${implemented}</div>
                    <div class="text-xs text-white/60">Implemented</div>
                </div>
                <div class="text-center px-4 py-3 bg-warning/10 rounded-lg">
                    <div class="text-2xl font-bold text-warning">${partial}</div>
                    <div class="text-xs text-white/60">Partial</div>
                </div>
                <div class="text-center px-4 py-3 bg-bad/10 rounded-lg">
                    <div class="text-2xl font-bold text-bad">${notImpl}</div>
                    <div class="text-xs text-white/60">Not Implemented</div>
                </div>
            </div>
            <div class="space-y-3">
                ${grecoRecommendations.map(r => `
                    <div class="flex items-start gap-4 p-3 bg-secondary/50 rounded-lg">
                        <span class="text-xs px-2 py-1 rounded ${this.getGRECOStatusClass(r.status)}">${r.status.replace('-', ' ')}</span>
                        <div>
                            <div class="text-sm text-white">${r.recommendation}</div>
                            <div class="text-xs text-white/60">${r.round} (${r.year})</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    getStatusClass(status) {
        const classes = {
            'investigation': 'bg-warning/20 text-warning',
            'trial': 'bg-warning/20 text-warning',
            'convicted': 'bg-bad/20 text-bad',
            'acquitted': 'bg-good/20 text-good',
            'archived': 'bg-white/10 text-white/60',
            'prescribed': 'bg-bad/20 text-bad',
            'appealing': 'bg-warning/20 text-warning'
        };
        return classes[status] || 'bg-white/10 text-white/60';
    },

    getGRECOStatusClass(status) {
        const classes = {
            'implemented': 'bg-good/20 text-good',
            'partly-implemented': 'bg-warning/20 text-warning',
            'not-implemented': 'bg-bad/20 text-bad'
        };
        return classes[status] || 'bg-white/10 text-white/60';
    }
};

// Auto-init if on a data page
document.addEventListener('DOMContentLoaded', () => {
    const countryCode = new URLSearchParams(window.location.search).get('country') || 'PT';
    if (document.getElementById('country-header')) {
        DataRenderer.init(countryCode);
    }
});
