document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const cover = document.querySelector('.cover-section');
    const aboutHeading = document.querySelector('.about-heading');
    const threshold = 40;
    const isHomePage = !!cover;
    const isMobile = () => window.innerWidth <= 900;

    if (!isHomePage) body.classList.add('scrolled');

    /* ── scroll handler: morph only on desktop ── */
    const updateScrollState = () => {

        if (isMobile()) {
            /* on mobile never apply the scrolled morph — sidebar is hidden */
            body.classList.remove('scrolled');
            return;
        }

        if (!isHomePage) return;

        const scrollY = window.scrollY;

        if (scrollY > threshold) {
            body.classList.add('scrolled');
        } else {
            body.classList.remove('scrolled');
        }

        /* scroll arrow fades out */
        const scrollHint = document.querySelector('.scroll-hint');
        if (scrollHint) {
            scrollHint.style.opacity = Math.max(0, 0.7 - scrollY / 200);
        }

        /* about heading fades in */
        if (aboutHeading) {
            const fadeStart = cover.offsetHeight * 0.45;
            const fadeEnd   = cover.offsetHeight;
            let progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
            progress = Math.max(0, Math.min(progress, 1));
            aboutHeading.style.opacity = 0.12 + 0.88 * progress;
        }
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });
    updateScrollState();

    /* ── mobile panel ── */
    const hamburger = document.getElementById('hamburger');
    const panel     = document.getElementById('mobile-panel');
    const overlay   = document.getElementById('panel-overlay');

    const openPanel = () => {
        panel.classList.add('open');
        hamburger.classList.add('menu-open');
        overlay.classList.add('active');
        requestAnimationFrame(() => overlay.classList.add('visible'));
        body.style.overflow = 'hidden';
    };

    const closePanel = () => {
        panel.classList.remove('open');
        hamburger.classList.remove('menu-open');
        overlay.classList.remove('visible');
        body.style.overflow = '';
        overlay.addEventListener('transitionend', () => {
            overlay.classList.remove('active');
        }, { once: true });
    };

    hamburger?.addEventListener('click', openPanel);
    overlay?.addEventListener('click', closePanel);

    panel?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closePanel);
    });

    /* ── desktop sidebar nav clicks ── */
    document.querySelectorAll('.sidebar .nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('href') || '';
            const goingHome = target === '#home' || target === '' || target === 'index.html';
            if (goingHome && isHomePage) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                body.classList.add('scrolled');
            }
        });
    });

    /* ── scroll reveal ── */
    document.querySelectorAll('.reveal').forEach(el => {
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('in-view');
            }),
            { threshold: 0.25 }
        );
        observer.observe(el);
    });

    /* ── active nav highlight ── */
    const sections = document.querySelectorAll('main [id]');
    if (sections.length) {
        const allNavLinks = document.querySelectorAll('.nav-links a');
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) {
                    allNavLinks.forEach(l => l.classList.remove('active'));
                    document.querySelectorAll(`.nav-links a[href="#${e.target.id}"]`)
                        .forEach(l => l.classList.add('active'));
                }
            }),
            { threshold: 0.5 }
        );
        sections.forEach(s => observer.observe(s));
    }

});