// Main JavaScript for Architecture of Impunity

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation handled via inline script in index.html (mobile-menu-btn)
    // SPA navigation handled in js/spa-nav.js

    // Navigation background on scroll
    const nav = document.querySelector('#main-nav');
    let lastScroll = 0;

    if (nav) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                nav.style.background = 'rgba(26, 26, 46, 0.98)';
                nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                nav.style.background = 'rgba(26, 26, 46, 0.95)';
                nav.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.case-file, .loophole-card, .mechanism-card, .verdict-block, .cycle-step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Counter animation for stats
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);

            if (element.dataset.suffix) {
                element.textContent = value + element.dataset.suffix;
            } else if (element.dataset.prefix) {
                element.textContent = element.dataset.prefix + value;
            } else {
                element.textContent = value;
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Animate stats when in view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber) {
                    const text = statNumber.textContent;
                    const num = parseInt(text.replace(/[^0-9-]/g, ''));
                    if (!isNaN(num)) {
                        if (text.includes('/')) {
                            statNumber.dataset.suffix = '/100';
                            animateValue(statNumber, 0, num, 1500);
                        } else if (text.includes('+')) {
                            statNumber.dataset.suffix = '+';
                            animateValue(statNumber, 0, num, 1500);
                        } else if (text.includes('%')) {
                            statNumber.dataset.suffix = '%';
                            animateValue(statNumber, 0, num, 1500);
                        } else if (text.includes('-')) {
                            statNumber.dataset.prefix = '-';
                            animateValue(statNumber, 0, Math.abs(num), 1500);
                        }
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Scroll-based nav highlighting disabled - SPA navigation handles this
    // Active link styling handled via spa-active class in spa-nav.js

    // Parallax effect for hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
            }
        });
    }

    // Print functionality
    if (window.location.search.includes('print')) {
        window.print();
    }
});
