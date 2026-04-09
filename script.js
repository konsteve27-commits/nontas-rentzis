document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ΑΥΤΟΜΑΤΗ ΔΗΜΙΟΥΡΓΙΑ LIGHTBOX ΜΕΣΩ JS --- //
    const galleryItems = document.querySelectorAll('.media-item img');

    // Ελέγχουμε αν η σελίδα έχει εικόνες και αν δεν υπάρχει ήδη το lightbox στο HTML
    if (galleryItems.length > 0 && !document.getElementById('lightbox')) {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox">
                <span class="close">&times;</span>
                <span class="prev">&#10094;</span>
                <img class="lightbox-content" id="lightbox-img">
                <span class="next">&#10095;</span>
                <div id="caption"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    // --- 2. ΛΕΙΤΟΥΡΓΙΑ LIGHTBOX --- //
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;

    function updateLightbox() {
        if (!lightboxImg) return;
        lightboxImg.src = galleryItems[currentIndex].src;
        
        // Εμφάνιση/Απόκρυψη βελών στα άκρα (κατάργηση κυκλικής εναλλαγής)
        if (prevBtn) prevBtn.style.visibility = (currentIndex === 0) ? 'hidden' : 'visible';
        if (nextBtn) nextBtn.style.visibility = (currentIndex === galleryItems.length - 1) ? 'hidden' : 'visible';
    }

    function openLightbox(index) {
        if (!lightbox) return;
        lightbox.style.display = 'flex';
        currentIndex = index;
        updateLightbox();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.style.display = 'none';
    }

    function showNext() {
        if (!lightbox || currentIndex >= galleryItems.length - 1) return;
        currentIndex++;
        updateLightbox();
    }

    function showPrev() {
        if (!lightbox || currentIndex <= 0) return;
        currentIndex--;
        updateLightbox();
    }

    // Προσθήκη events στις εικόνες
    if (galleryItems.length > 0) {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });
    }

    // Προσθήκη events στα κουμπιά
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    if (lightbox) {
        // Κλείσιμο αν πατηθεί οπουδήποτε εκτός από την εικόνα και τα βελάκια
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg && e.target !== prevBtn && e.target !== nextBtn) {
                closeLightbox();
            }
        });

        // Swipe λειτουργία για τα κινητά
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        lightbox.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});

        function handleSwipe() {
            const threshold = 50; // Ελάχιστη απόσταση swipe
            if (touchEndX < touchStartX - threshold) {
                showNext(); // Swipe αριστερά (επόμενο)
            }
            if (touchEndX > touchStartX + threshold) {
                showPrev(); // Swipe δεξιά (προηγούμενο)
            }
        }
    }

    // Υποστήριξη πλοήγησης με το πληκτρολόγιο
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        }
    });

    // --- 3. ΚΩΔΙΚΑΣ ΓΙΑ ΤΟ HEADER (SCROLL DIRECTION) ΚΑΙ HAMBURGER MENU --- //
    const header = document.getElementById('main-header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('main-nav');

    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                if (currentScrollY < 0) {
                    ticking = false;
                    return;
                }

                if (Math.abs(currentScrollY - lastScrollY) < 5) {
                    ticking = false;
                    return;
                }

                const headerHeight = header.offsetHeight;

                if (currentScrollY <= headerHeight) {
                    header.classList.remove('header-slim', 'header-hidden');
                } else {
                    if (currentScrollY < lastScrollY) {
                        header.classList.add('header-slim');
                        header.classList.remove('header-hidden');
                    } else {
                        header.classList.remove('header-slim');
                        header.classList.add('header-hidden');

                        if (navMenu && navMenu.classList.contains('active')) {
                            hamburger.classList.remove('active');
                            navMenu.classList.remove('active');
                        }
                    }
                }
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    });

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});