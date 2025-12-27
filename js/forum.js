// Forum/Comment System
// Lightweight discussion system with moderation

const Forum = {
    comments: [],
    pendingModeration: [],

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
        this.loadComments();
        this.setupForm();
        this.renderComments();
    },

    loadComments() {
        try {
            this.comments = JSON.parse(localStorage.getItem('forum_comments') || '[]');
        } catch (e) {
            this.comments = [];
        }
    },

    saveComments() {
        localStorage.setItem('forum_comments', JSON.stringify(this.comments));
    },

    setupForm() {
        const form = document.getElementById('comment-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('comment-name')?.value.trim() || 'Anonymous';
            const country = document.getElementById('comment-country')?.value || 'EU';
            const message = document.getElementById('comment-message')?.value.trim();

            if (!message || message.length < 10) {
                this.showNotice(this.t('forum.errors.tooShort', 'Comment must be at least 10 characters'), 'error');
                return;
            }

            if (message.length > 1000) {
                this.showNotice(this.t('forum.errors.tooLong', 'Comment must be under 1000 characters'), 'error');
                return;
            }

            // Basic content moderation
            if (this.containsProhibited(message)) {
                this.showNotice(this.t('forum.errors.prohibited', 'Comment contains prohibited content'), 'error');
                return;
            }

            const comment = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
                name: this.sanitize(name.substring(0, 50)),
                country,
                message: this.sanitize(message),
                timestamp: new Date().toISOString(),
                likes: 0,
                verified: false // Would need backend verification
            };

            this.comments.unshift(comment);
            this.saveComments();
            this.renderComments();

            form.reset();
            this.showNotice(this.t('forum.success', 'Comment added successfully'), 'success');
        });
    },

    containsProhibited(text) {
        const lower = text.toLowerCase();
        // Block obvious spam patterns and harmful content
        const patterns = [
            /https?:\/\/[^\s]+/g, // URLs
            /<script/i,
            /javascript:/i,
            /\bon\w+\s*=/i, // onclick, etc.
        ];
        return patterns.some(p => p.test(lower));
    },

    sanitize(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    renderComments() {
        const container = document.getElementById('comments-list');
        if (!container) return;

        if (this.comments.length === 0) {
            container.innerHTML = `<p class="no-comments">${this.t('forum.noComments', 'Be the first to share your perspective on political accountability.')}</p>`;
            return;
        }

        const countryFlags = {
            'PT': '🇵🇹', 'ES': '🇪🇸', 'FR': '🇫🇷', 'DE': '🇩🇪', 'IT': '🇮🇹',
            'NL': '🇳🇱', 'BE': '🇧🇪', 'AT': '🇦🇹', 'PL': '🇵🇱', 'RO': '🇷🇴',
            'EL': '🇬🇷', 'CZ': '🇨🇿', 'HU': '🇭🇺', 'SE': '🇸🇪', 'DK': '🇩🇰',
            'FI': '🇫🇮', 'IE': '🇮🇪', 'BG': '🇧🇬', 'HR': '🇭🇷', 'SK': '🇸🇰',
            'SI': '🇸🇮', 'LT': '🇱🇹', 'LV': '🇱🇻', 'EE': '🇪🇪', 'CY': '🇨🇾',
            'MT': '🇲🇹', 'LU': '🇱🇺', 'EU': '🇪🇺'
        };

        container.innerHTML = this.comments.slice(0, 50).map(c => `
            <div class="comment-card" data-id="${c.id}">
                <div class="comment-header">
                    <span class="comment-flag">${countryFlags[c.country] || '🇪🇺'}</span>
                    <span class="comment-author">${c.name}</span>
                    <span class="comment-date">${this.formatDate(c.timestamp)}</span>
                </div>
                <div class="comment-body">${c.message}</div>
                <div class="comment-actions">
                    <button class="like-btn" data-comment-id="${c.id}" aria-label="${this.t('forum.likeButton', 'Like this comment')}">
                        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        <span>${c.likes}</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Event delegation for like buttons
        this.setupLikeButtons(container);

        // Update count
        const countEl = document.getElementById('comments-count');
        if (countEl) countEl.textContent = this.comments.length;
    },

    setupLikeButtons(container) {
        container.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.like-btn');
            if (likeBtn) {
                const commentId = likeBtn.dataset.commentId;
                if (commentId) {
                    this.likeComment(commentId);
                }
            }
        });
    },

    likeComment(id) {
        const comment = this.comments.find(c => c.id === id);
        if (comment) {
            // Check if already liked (using localStorage)
            const liked = JSON.parse(localStorage.getItem('forum_liked') || '[]');
            if (!liked.includes(id)) {
                comment.likes++;
                liked.push(id);
                localStorage.setItem('forum_liked', JSON.stringify(liked));
                this.saveComments();
                this.renderComments();
            }
        }
    },

    formatDate(iso) {
        const date = new Date(iso);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return this.t('forum.time.justNow', 'Just now');
        if (diff < 3600000) return `${Math.floor(diff / 60000)}${this.t('forum.time.minutesAgo', 'm ago')}`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}${this.t('forum.time.hoursAgo', 'h ago')}`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}${this.t('forum.time.daysAgo', 'd ago')}`;

        const lang = window.currentLang || 'en';
        const locale = lang === 'pt' ? 'pt-PT' : 'en-GB';
        return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
    },

    showNotice(message, type) {
        const notice = document.createElement('div');
        notice.className = `forum-notice ${type}`;
        notice.textContent = message;

        const form = document.getElementById('comment-form');
        if (form) {
            form.insertAdjacentElement('beforebegin', notice);
            setTimeout(() => notice.remove(), 3000);
        }
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Forum.init());
} else {
    Forum.init();
}

window.Forum = Forum;
