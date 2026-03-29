document.addEventListener('DOMContentLoaded', () => {
    // 1. Δυναμική δημιουργία του Lightbox (αν δεν υπάρχει ήδη)
    if (!document.getElementById('lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="close">&times;</span>
            <span class="prev">&#10094;</span>
            <img class="lightbox-content" id="lightbox-img">
            <span class="next">&#10095;</span>
        `;
        document.body.appendChild(lightbox);
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // 2. Επιλογή εικόνων: Προσθέσαμε το '.media-section img' για τη σελίδα της Μικρασίας
    const images = document.querySelectorAll('.card img, .portrait-img, .media-item img, .media-section img');
    let currentIndex = 0;

    // 3. Λειτουργία Ανοίγματος
    images.forEach((img, index) => {
        img.style.cursor = "zoom-in";
        img.addEventListener('click', () => {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
            currentIndex = index;
            document.body.style.overflow = 'hidden';
        });
    });

    // 4. Λειτουργία Κλεισίματος
    const closeLightbox = () => {
        lightbox.style.display = "none";
        document.body.style.overflow = 'auto';
    };

    lightbox.querySelector('.close').onclick = closeLightbox;

    // 5. Λειτουργία Περιήγησης
    const showImage = (index) => {
        if (index >= images.length) currentIndex = 0;
        else if (index < 0) currentIndex = images.length - 1;
        else currentIndex = index;
        lightboxImg.src = images[currentIndex].src;
    };

    lightbox.querySelector('.next').onclick = (e) => { e.stopPropagation(); showImage(currentIndex + 1); };
    lightbox.querySelector('.prev').onclick = (e) => { e.stopPropagation(); showImage(currentIndex - 1); };

    lightbox.onclick = (e) => {
        if (e.target === lightbox) closeLightbox();
    };

    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === "flex") {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") showImage(currentIndex + 1);
            if (e.key === "ArrowLeft") showImage(currentIndex - 1);
        }
    });
});