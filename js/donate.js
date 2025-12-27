// Micro-Donation System for Unbiased Research
// Maximum €2/€2 donation to maintain independence

const Donate = {
    AMOUNTS: {
        EUR: [0.50, 1.00, 2.00],
        USD: [0.50, 1.00, 2.00]
    },
    MAX_EUR: 2.00,
    MAX_USD: 2.00,

    totalRaised: 0,
    donorCount: 0,

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

    init() {
        this.loadStats();
        this.setupButtons();
        this.renderStats();
    },

    loadStats() {
        try {
            const stats = JSON.parse(localStorage.getItem('donate_stats') || '{}');
            this.totalRaised = stats.total || 0;
            this.donorCount = stats.count || 0;
        } catch (e) {
            this.totalRaised = 0;
            this.donorCount = 0;
        }
    },

    saveStats() {
        localStorage.setItem('donate_stats', JSON.stringify({
            total: this.totalRaised,
            count: this.donorCount
        }));
    },

    setupButtons() {
        document.querySelectorAll('.donate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const amount = parseFloat(btn.dataset.amount);
                const currency = btn.dataset.currency || 'EUR';
                this.processDonation(amount, currency);
            });
        });

        // Custom amount input
        const customInput = document.getElementById('donate-custom');
        const customBtn = document.getElementById('donate-custom-btn');

        if (customInput && customBtn) {
            customBtn.addEventListener('click', () => {
                let amount = parseFloat(customInput.value);
                const currency = document.getElementById('donate-currency')?.value || 'EUR';
                const max = currency === 'USD' ? this.MAX_USD : this.MAX_EUR;

                if (isNaN(amount) || amount <= 0) {
                    this.showMessage(this.t('donate.errors.invalidAmount', 'Please enter a valid amount'), 'error');
                    return;
                }

                if (amount > max) {
                    amount = max;
                    const maxMsg = this.t('donate.errors.maxAmount', `Maximum donation is €${max} to maintain research independence`).replace('{{max}}', max);
                    this.showMessage(maxMsg, 'info');
                }

                this.processDonation(amount, currency);
            });
        }
    },

    processDonation(amount, currency) {
        const symbol = currency === 'EUR' ? '€' : '$';
        const max = currency === 'USD' ? this.MAX_USD : this.MAX_EUR;

        // Enforce maximum
        if (amount > max) {
            amount = max;
        }

        // In production, this would integrate with Stripe/PayPal
        // For now, simulate the donation flow
        const modal = this.createDonateModal(amount, currency);
        document.body.appendChild(modal);
    },

    createDonateModal(amount, currency) {
        const symbol = currency === 'EUR' ? '€' : '$';

        const modal = document.createElement('div');
        modal.className = 'donate-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'donate-modal-title');

        modal.innerHTML = `
            <div class="donate-modal-content">
                <button class="donate-modal-close" aria-label="${this.t('donate.modal.closeLabel', 'Close donation dialog')}">&times;</button>
                <div class="donate-modal-header">
                    <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true"><path fill="var(--color-accent)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <h3 id="donate-modal-title">${this.t('donate.modal.title', 'Support Unbiased Research')}</h3>
                </div>
                <div class="donate-modal-body">
                    <p class="donate-amount">${symbol}${amount.toFixed(2)}</p>
                    <p class="donate-purpose">${this.t('donate.modal.purpose', 'Your micro-donation supports independent research into political accountability across the EU.')}</p>

                    <div class="donate-principles">
                        <h4>${this.t('donate.modal.principlesTitle', 'Our Principles:')}</h4>
                        <ul>
                            <li><strong>${this.t('donate.modal.maxDonor', 'Maximum €2/donor - No large donors, no influence')}</strong></li>
                            <li><strong>${this.t('donate.modal.allPartiesDoc', 'All parties documented - PS, PSD, CDS, PCP, BE, Chega - all included')}</strong></li>
                            <li><strong>${this.t('donate.modal.officialOnly', 'Official sources only - Court documents, prosecution records')}</strong></li>
                            <li><strong>${this.t('donate.modal.fullTransparency', 'Full transparency - All data verifiable')}</strong></li>
                        </ul>
                    </div>

                    <div class="donate-methods">
                        <p>${this.t('donate.modal.paymentMethods', 'Payment methods coming soon:')}</p>
                        <div class="payment-icons" role="group" aria-label="${this.t('donate.modal.paymentMethodsLabel', 'Available payment methods')}">
                            <span title="Card" aria-label="Card">💳</span>
                            <span title="PayPal" aria-label="PayPal">🅿️</span>
                            <span title="MB WAY" aria-label="MB WAY">📱</span>
                        </div>
                    </div>

                    <button class="donate-confirm-btn" data-amount="${amount}" data-currency="${currency}">
                        ${this.t('donate.modal.simulateBtn', 'Simulate Donation (Demo)')}
                    </button>

                    <p class="donate-note">${this.t('donate.modal.demoNote', 'This is a demonstration. Real payment integration requires backend setup.')}</p>
                </div>
            </div>
        `;

        // Event listeners for modal actions
        const closeBtn = modal.querySelector('.donate-modal-close');
        const confirmBtn = modal.querySelector('.donate-confirm-btn');

        closeBtn.addEventListener('click', () => modal.remove());

        confirmBtn.addEventListener('click', () => {
            const amt = parseFloat(confirmBtn.dataset.amount);
            const curr = confirmBtn.dataset.currency;
            this.confirmDonation(amt, curr);
            modal.remove();
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Close on Escape key
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modal.remove();
        });

        return modal;
    },

    confirmDonation(amount, currency) {
        // In demo mode, just update local stats
        this.totalRaised += amount;
        this.donorCount++;
        this.saveStats();
        this.renderStats();
        const symbol = currency === 'EUR' ? '€' : '$';
        const successMsg = this.t('donate.success', 'Thank you! €{{amount}} donation recorded.').replace('{{amount}}', amount.toFixed(2));
        this.showMessage(successMsg, 'success');
    },

    renderStats() {
        const totalEl = document.getElementById('donate-total');
        const countEl = document.getElementById('donate-count');

        if (totalEl) totalEl.textContent = `€${this.totalRaised.toFixed(2)}`;
        if (countEl) countEl.textContent = this.donorCount;
    },

    showMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `donate-message ${type}`;
        msg.textContent = text;
        document.body.appendChild(msg);

        setTimeout(() => {
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 300);
        }, 3000);
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Donate.init());
} else {
    Donate.init();
}

window.Donate = Donate;
