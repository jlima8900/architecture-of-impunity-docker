// Stats: Visit Counter, Likes, and Share functionality
const stats = {
    // Using localStorage for demo - in production use a real backend
    storageKey: 'architecture-impunity-stats',

    async init() {
        this.loadStats();
        this.incrementVisits();
        this.setupEventListeners();
        this.updateUI();
    },

    loadStats() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            this.data = JSON.parse(stored);
        } else {
            this.data = {
                visits: 0,
                likes: 0,
                hasLiked: false,
                lastVisit: null
            };
        }
    },

    saveStats() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    },

    incrementVisits() {
        const now = new Date().toDateString();
        // Only count once per day per browser
        if (this.data.lastVisit !== now) {
            this.data.visits++;
            this.data.lastVisit = now;
            this.saveStats();
        }
    },

    toggleLike() {
        if (this.data.hasLiked) {
            this.data.likes = Math.max(0, this.data.likes - 1);
            this.data.hasLiked = false;
            document.getElementById('like-btn').classList.remove('liked');
        } else {
            this.data.likes++;
            this.data.hasLiked = true;
            document.getElementById('like-btn').classList.add('liked');
        }
        this.saveStats();
        this.updateUI();
    },

    async share() {
        const shareData = {
            title: 'The Architecture of Impunity',
            text: 'How Portugal\'s Political System Is Designed to Protect the Corrupt - A comprehensive exposé with 102 documented references.',
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(window.location.href);
                this.showToast('Link copied to clipboard!');
            }
        } catch (err) {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                this.showToast('Link copied to clipboard!');
            } catch (e) {
                console.error('Share failed:', e);
            }
        }
    },

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 6rem;
            right: 2rem;
            background: var(--color-success, #2ecc71);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: fadeInOut 2s ease forwards;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    },

    updateUI() {
        const visitEl = document.getElementById('visit-count');
        const likeEl = document.getElementById('like-count');
        const likeBtn = document.getElementById('like-btn');

        if (visitEl) visitEl.textContent = this.formatNumber(this.data.visits);
        if (likeEl) likeEl.textContent = this.formatNumber(this.data.likes);
        if (likeBtn && this.data.hasLiked) likeBtn.classList.add('liked');
    },

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },

    setupEventListeners() {
        const likeBtn = document.getElementById('like-btn');
        const shareBtn = document.getElementById('share-btn');

        if (likeBtn) {
            likeBtn.addEventListener('click', () => this.toggleLike());
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.share());
        }
    }
};

// Add toast animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => stats.init());
