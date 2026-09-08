document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const cover = document.querySelector('.cover-section');
    const aboutHeading = document.querySelector('.about-heading');
    const threshold = 40;

    // Side panel
    const isHomePage = !!cover;

    if (!isHomePage) {
        body.classList.add('scrolled');
    }

    // Scroll
    const updateScrollState = () => {

        if (!isHomePage) return;

        const scrollY = window.scrollY;

        // Side panel → top nav
        if (scrollY > threshold) {
            body.classList.add('scrolled');
        } else {
            body.classList.remove('scrolled');
        }

        // Scroll hint
        const scrollHint = document.querySelector('.scroll-hint');

        if (scrollHint) {
            scrollHint.style.opacity = Math.max(0, 0.7 - scrollY / 200);
        }

        // Cover → About
        if (aboutHeading) {
            const fadeStart = cover.offsetHeight * 0.45;
            const fadeEnd = cover.offsetHeight;

            let progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
            progress = Math.max(0, Math.min(progress, 1));

            const opacity = 0.12 + (0.88 * progress);
            aboutHeading.style.opacity = opacity;
        }
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    // Navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {

            const target = link.getAttribute('href') || '';
            const goingHome =
                target === '#home' ||
                target === '' ||
                target === 'index.html';

            if (goingHome) {
                if (isHomePage) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            } else {
                body.classList.add('scrolled');
            }
        });
    });

    // Reveal content
    document.querySelectorAll('.reveal').forEach(element => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            },
            { threshold: 0.25 }
        );

        observer.observe(element);
    });

    // Active navigation
    const sections = document.querySelectorAll('main [id]');

    if (sections.length) {
        const navLinks = document.querySelectorAll('.nav-links a');

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(link => link.classList.remove('active'));

                        document
                            .querySelectorAll(`.nav-links a[href="#${entry.target.id}"]`)
                            .forEach(link => link.classList.add('active'));
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach(section => observer.observe(section));
    }

});