// Tamper-Proof Signature System
// Based on European Citizens' Initiative (ECI) model
// Uses cryptographic hashing for integrity verification

const SignatureSystem = {
    // EU Member States with required ID formats
    EU_COUNTRIES: {
        AT: { name: 'Austria', idLabel: 'Passport/ID Number', format: /^[A-Z0-9]{8,12}$/ },
        BE: { name: 'Belgium', idLabel: 'National Register Number', format: /^\d{11}$/ },
        BG: { name: 'Bulgaria', idLabel: 'ЕГН (Personal Number)', format: /^\d{10}$/ },
        HR: { name: 'Croatia', idLabel: 'OIB', format: /^\d{11}$/ },
        CY: { name: 'Cyprus', idLabel: 'ID Card Number', format: /^\d{7,8}$/ },
        CZ: { name: 'Czechia', idLabel: 'Birth Number', format: /^\d{9,10}$/ },
        DK: { name: 'Denmark', idLabel: 'CPR Number', format: /^\d{10}$/ },
        EE: { name: 'Estonia', idLabel: 'Personal ID Code', format: /^\d{11}$/ },
        FI: { name: 'Finland', idLabel: 'Personal ID', format: /^\d{6}[-+A]\d{3}[A-Z0-9]$/ },
        FR: { name: 'France', idLabel: 'ID Card/Passport', format: /^[A-Z0-9]{9,12}$/ },
        DE: { name: 'Germany', idLabel: 'Personalausweis', format: /^[A-Z0-9]{9,10}$/ },
        GR: { name: 'Greece', idLabel: 'ID Number', format: /^[A-Z]{2}\d{6}$/ },
        HU: { name: 'Hungary', idLabel: 'Personal ID', format: /^\d{6}[A-Z]{2}\d{5}$/ },
        IE: { name: 'Ireland', idLabel: 'PPSN', format: /^\d{7}[A-Z]{1,2}$/ },
        IT: { name: 'Italy', idLabel: 'Codice Fiscale', format: /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/ },
        LV: { name: 'Latvia', idLabel: 'Personal Code', format: /^\d{6}-\d{5}$/ },
        LT: { name: 'Lithuania', idLabel: 'Personal Code', format: /^\d{11}$/ },
        LU: { name: 'Luxembourg', idLabel: 'ID Number', format: /^\d{13}$/ },
        MT: { name: 'Malta', idLabel: 'ID Card Number', format: /^\d{7}[A-Z]$/ },
        NL: { name: 'Netherlands', idLabel: 'BSN', format: /^\d{9}$/ },
        PL: { name: 'Poland', idLabel: 'PESEL', format: /^\d{11}$/ },
        PT: { name: 'Portugal', idLabel: 'Cartão Cidadão', format: /^\d{8}$/ },
        RO: { name: 'Romania', idLabel: 'CNP', format: /^\d{13}$/ },
        SK: { name: 'Slovakia', idLabel: 'Birth Number', format: /^\d{9,10}$/ },
        SI: { name: 'Slovenia', idLabel: 'EMŠO', format: /^\d{13}$/ },
        ES: { name: 'Spain', idLabel: 'DNI/NIE', format: /^[XYZ]?\d{7,8}[A-Z]$/ },
        SE: { name: 'Sweden', idLabel: 'Personnummer', format: /^\d{12}$/ }
    },

    signatures: [],
    auditLog: [],

    async init() {
        this.loadFromStorage();
        this.renderForm();
        this.renderStats();
        this.setupEventListeners();
    },

    // Cryptographic hash function (SHA-256)
    async hashData(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Generate Merkle root for all signatures (tamper detection)
    async generateMerkleRoot() {
        if (this.signatures.length === 0) return null;

        let hashes = await Promise.all(
            this.signatures.map(sig => this.hashData(sig))
        );

        while (hashes.length > 1) {
            const newHashes = [];
            for (let i = 0; i < hashes.length; i += 2) {
                const pair = hashes[i] + (hashes[i + 1] || hashes[i]);
                newHashes.push(await this.hashData(pair));
            }
            hashes = newHashes;
        }

        return hashes[0];
    },

    // Add signature with full audit trail
    async addSignature(data) {
        const timestamp = new Date().toISOString();
        const previousHash = this.signatures.length > 0
            ? await this.hashData(this.signatures[this.signatures.length - 1])
            : '0'.repeat(64);

        const signature = {
            id: crypto.randomUUID(),
            ...data,
            timestamp,
            previousHash,
            sequence: this.signatures.length + 1
        };

        // Hash the signature for integrity
        signature.hash = await this.hashData({
            ...signature,
            hash: undefined // Exclude hash field from hashing
        });

        this.signatures.push(signature);

        // Audit log entry
        this.auditLog.push({
            action: 'SIGNATURE_ADDED',
            signatureId: signature.id,
            timestamp,
            country: data.country,
            hash: signature.hash
        });

        this.saveToStorage();
        return signature;
    },

    // Verify chain integrity
    async verifyIntegrity() {
        const issues = [];

        for (let i = 0; i < this.signatures.length; i++) {
            const sig = this.signatures[i];

            // Verify hash
            const computedHash = await this.hashData({
                ...sig,
                hash: undefined
            });

            if (computedHash !== sig.hash) {
                issues.push({
                    type: 'HASH_MISMATCH',
                    signatureId: sig.id,
                    sequence: sig.sequence
                });
            }

            // Verify chain
            if (i > 0) {
                const prevSig = this.signatures[i - 1];
                const prevHash = await this.hashData(prevSig);
                if (sig.previousHash !== prevHash) {
                    issues.push({
                        type: 'CHAIN_BROKEN',
                        signatureId: sig.id,
                        sequence: sig.sequence
                    });
                }
            }
        }

        return {
            valid: issues.length === 0,
            issues,
            totalSignatures: this.signatures.length,
            merkleRoot: await this.generateMerkleRoot()
        };
    },

    // Export for EU verification
    async exportForVerification() {
        const integrity = await this.verifyIntegrity();
        return {
            exportDate: new Date().toISOString(),
            totalSignatures: this.signatures.length,
            byCountry: this.getCountryStats(),
            merkleRoot: integrity.merkleRoot,
            integrityValid: integrity.valid,
            auditLog: this.auditLog,
            // Signatures with hashed personal data for privacy
            signatures: await Promise.all(this.signatures.map(async sig => ({
                id: sig.id,
                country: sig.country,
                timestamp: sig.timestamp,
                hash: sig.hash,
                personalDataHash: await this.hashData({
                    firstName: sig.firstName,
                    lastName: sig.lastName,
                    idNumber: sig.idNumber
                })
            })))
        };
    },

    getCountryStats() {
        const stats = {};
        this.signatures.forEach(sig => {
            stats[sig.country] = (stats[sig.country] || 0) + 1;
        });
        return stats;
    },

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('eci-signatures');
            if (stored) {
                const data = JSON.parse(stored);
                this.signatures = data.signatures || [];
                this.auditLog = data.auditLog || [];
            }
        } catch (e) {
            console.error('Failed to load signatures:', e);
        }
    },

    saveToStorage() {
        try {
            localStorage.setItem('eci-signatures', JSON.stringify({
                signatures: this.signatures,
                auditLog: this.auditLog
            }));
        } catch (e) {
            console.error('Failed to save signatures:', e);
        }
    },

    // Get translation from embedded translations object
    t(key, fallback) {
        const keys = key.split('.');
        let value = window.translations;
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return fallback || key;
            }
        }
        return typeof value === 'string' ? value : fallback || key;
    },

    renderForm() {
        const container = document.getElementById('signature-form-container');
        if (!container) return;

        const countryOptions = Object.entries(this.EU_COUNTRIES)
            .map(([code, info]) => `<option value="${code}">${info.name}</option>`)
            .join('');

        container.innerHTML = `
            <form id="eci-signature-form" class="eci-form">
                <div class="form-header">
                    <h3>${this.t('signature.title', 'Sign the European Citizens\' Initiative')}</h3>
                    <p>${this.t('signature.subtitle', 'For Political Accountability Across the EU')}</p>
                    <div class="verification-badge">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                        <span>${this.t('signature.verified', 'Cryptographically Verified')}</span>
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label for="sig-firstname">${this.t('signature.firstName', 'First Name')}</label>
                        <input type="text" id="sig-firstname" name="firstName" required autocomplete="given-name">
                    </div>
                    <div class="form-group">
                        <label for="sig-lastname">${this.t('signature.lastName', 'Last Name')}</label>
                        <input type="text" id="sig-lastname" name="lastName" required autocomplete="family-name">
                    </div>
                    <div class="form-group">
                        <label for="sig-country">${this.t('signature.country', 'Country')}</label>
                        <select id="sig-country" name="country" required>
                            <option value="">${this.t('signature.selectCountry', 'Select your country')}</option>
                            ${countryOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="sig-idnumber" id="id-label">${this.t('signature.idNumber', 'ID Number')}</label>
                        <input type="text" id="sig-idnumber" name="idNumber" required>
                        <small class="id-hint"></small>
                    </div>
                </div>

                <div class="form-consent">
                    <label>
                        <input type="checkbox" name="consent" required>
                        <span>${this.t('signature.consent', 'I confirm I am an EU citizen and consent to my data being processed in accordance with EU data protection regulations.')}</span>
                    </label>
                </div>

                <button type="submit" class="submit-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    <span>${this.t('signature.submit', 'Sign the Initiative')}</span>
                </button>

                <div class="form-footer">
                    <p>${this.t('signature.formFooter', 'Your signature will be cryptographically hashed and added to a tamper-proof chain.')}</p>
                    <p>${this.t('signature.merkleLabel', 'Merkle Root:')} <code id="merkle-root">${this.t('signature.merkleCalculating', 'Calculating...')}</code></p>
                </div>
            </form>
        `;

        // Update ID label based on country selection
        document.getElementById('sig-country').addEventListener('change', (e) => {
            const country = this.EU_COUNTRIES[e.target.value];
            if (country) {
                document.getElementById('id-label').textContent = country.idLabel;
                document.querySelector('.id-hint').textContent = `Format: ${country.format.toString().slice(1, -1)}`;
            }
        });
    },

    renderStats() {
        const container = document.getElementById('signature-stats');
        if (!container) return;

        const stats = this.getCountryStats();
        const total = this.signatures.length;
        const goal = 1000000;
        const percentage = Math.min((total / goal) * 100, 100);

        container.innerHTML = `
            <div class="stats-header">
                <div class="total-count">
                    <span class="count-number">${total.toLocaleString()}</span>
                    <span class="count-label">${this.t('signature.count', 'signatures')}</span>
                </div>
                <div class="goal-info">
                    <span>${this.t('signature.goal', 'Goal: 1,000,000')}</span>
                    <span class="percentage">${percentage.toFixed(2)}%</span>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="country-breakdown">
                ${Object.entries(stats)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([code, count]) => `
                        <div class="country-stat">
                            <span class="country-name">${this.EU_COUNTRIES[code]?.name || code}</span>
                            <span class="country-count">${count.toLocaleString()}</span>
                        </div>
                    `).join('')}
            </div>
            <div class="integrity-status" id="integrity-status">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                <span>Verifying integrity...</span>
            </div>
        `;

        // Verify and update integrity status
        this.verifyIntegrity().then(result => {
            const statusEl = document.getElementById('integrity-status');
            if (statusEl) {
                statusEl.innerHTML = result.valid
                    ? `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="#2ecc71" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg><span style="color:#2ecc71">${this.t('signature.integrityVerified', 'Chain Integrity Verified')}</span>`
                    : `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="#e74c3c" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 15h2v2h-2zm0-8h2v6h-2z"/></svg><span style="color:#e74c3c">${this.t('signature.integrityIssues', 'Integrity Issues Detected')} (${result.issues.length})</span>`;
            }
        });

        // Update Merkle root
        this.generateMerkleRoot().then(root => {
            const merkleEl = document.getElementById('merkle-root');
            if (merkleEl) {
                merkleEl.textContent = root ? root.substring(0, 16) + '...' : this.t('signature.merkleNoSigs', 'No signatures yet');
            }
        });
    },

    setupEventListeners() {
        const form = document.getElementById('eci-signature-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                const data = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    country: formData.get('country'),
                    idNumber: formData.get('idNumber')
                };

                // Validate ID format
                const countryInfo = this.EU_COUNTRIES[data.country];
                if (countryInfo && !countryInfo.format.test(data.idNumber)) {
                    alert(`${this.t('signature.invalidFormat', 'Invalid ID format for')} ${countryInfo.name}`);
                    return;
                }

                try {
                    await this.addSignature(data);
                    form.reset();
                    this.renderStats();

                    // Show success
                    const btn = form.querySelector('.submit-btn');
                    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg><span>${this.t('signature.success', 'Signature Recorded!')}</span>`;
                    btn.style.background = '#2ecc71';
                    setTimeout(() => {
                        btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg><span>${this.t('signature.submit', 'Sign the Initiative')}</span>`;
                        btn.style.background = '';
                    }, 2000);
                } catch (error) {
                    alert('Error recording signature. Please try again.');
                    console.error(error);
                }
            });
        }
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => SignatureSystem.init());
