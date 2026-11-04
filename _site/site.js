document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const cover = document.querySelector('.cover-section');
    const sidebar = document.getElementById('sidebar');
    const topNav = document.getElementById('top-nav');
    const desktopHamburger = document.getElementById('desktop-hamburger');
    const hamburger = document.getElementById('hamburger');
    const panel = document.getElementById('mobile-panel');
    const overlay = document.getElementById('panel-overlay');

    const isMobile = () => window.innerWidth <= 900;

    let navTimer = null;

    /* desktop sidebar */
    const openSidebar = () => {
        body.classList.add('sidebar-open');
        desktopHamburger?.classList.add('open');
        desktopHamburger?.setAttribute('aria-label', 'Close menu');
    };

    const closeSidebar = () => {
        body.classList.remove('sidebar-open');
        desktopHamburger?.classList.remove('open');
        desktopHamburger?.setAttribute('aria-label', 'Open menu');
    };

    desktopHamburger?.addEventListener('click', () => {
        if (isMobile()) return;
        if (window.scrollY > 40) return;

        if (body.classList.contains('sidebar-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    /* desktop scroll morph */
    const openTopNav = () => {
        if (!desktopHamburger || !topNav) return;

        clearTimeout(navTimer);

        /* mother disappears immediately */
        desktopHamburger.style.display = 'none';

        /* children are born on the next frame */
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                body.classList.add('top-nav-open');
                topNav.classList.add('open');
            });
        });
    };

    const closeTopNav = () => {
        if (!desktopHamburger || !topNav) return;

        clearTimeout(navTimer);

        /* mother stays hidden while children retreat */
        desktopHamburger.style.display = 'none';

        /* children retreat first */
        topNav.classList.remove('open');
        body.classList.remove('top-nav-open');

        /* mother returns only after children are completely gone */
        navTimer = setTimeout(() => {
            if (window.scrollY <= 40) {
                desktopHamburger.style.display = 'flex';
            }
        }, 390);
    };

    const updateScrollState = () => {
        if (isMobile()) return;

        if (cover) {
            if (window.scrollY > 40) {
                closeSidebar();

                if (!topNav.classList.contains('open')) {
                    openTopNav();
                }
            } else {
                if (topNav.classList.contains('open')) {
                    closeTopNav();
                } else if (!navTimer) {
                    desktopHamburger.style.display = 'flex';
                }
            }

            const scrollHint = document.querySelector('.scroll-hint');

            if (scrollHint) {
                scrollHint.style.opacity =
                    Math.max(0, 0.7 - window.scrollY / 200);
            }

            const aboutHeading =
                document.querySelector('.about-heading');

            if (aboutHeading) {
                const fadeStart = cover.offsetHeight * 0.45;
                const fadeEnd = cover.offsetHeight;

                let progress =
                    (window.scrollY - fadeStart) /
                    (fadeEnd - fadeStart);

                progress = Math.max(0, Math.min(progress, 1));

                aboutHeading.style.opacity =
                    0.12 + 0.88 * progress;
            }
        }
    };

    window.addEventListener('scroll', updateScrollState, {
        passive: true
    });

    window.addEventListener('resize', updateScrollState, {
        passive: true
    });

    updateScrollState();

    /* mobile panel */
    const openPanel = () => {
        panel?.classList.add('open');
        hamburger?.classList.add('menu-open');
        overlay?.classList.add('active');

        requestAnimationFrame(() => {
            overlay?.classList.add('visible');
        });

        body.style.overflow = 'hidden';
    };

    const closePanel = () => {
        panel?.classList.remove('open');
        hamburger?.classList.remove('menu-open');
        overlay?.classList.remove('visible');
        body.style.overflow = '';

        setTimeout(() => {
            overlay?.classList.remove('active');
        }, 300);
    };

    hamburger?.addEventListener('click', () => {
        if (panel?.classList.contains('open')) {
            closePanel();
        } else {
            openPanel();
        }
    });

    overlay?.addEventListener('click', closePanel);

    panel?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closePanel);
    });

    /* reveal */
    document.querySelectorAll('.reveal').forEach(el => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.25
        });

        observer.observe(el);
    });

    /* active navigation */
    const sections = document.querySelectorAll('main [id]');

    if (sections.length) {
        const links = document.querySelectorAll(
            '.top-links a, .nav-links a'
        );

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    links.forEach(link => {
                        link.classList.remove('active');
                    });

                    document.querySelectorAll(
                        `.top-links a[href="#${entry.target.id}"],
                         .nav-links a[href="#${entry.target.id}"]`
                    ).forEach(link => {
                        link.classList.add('active');
                    });
                }
            });
        }, {
            threshold: 0.5
        });

        sections.forEach(section => observer.observe(section));
    }
});