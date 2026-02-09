document.addEventListener('DOMContentLoaded', () => {
    const galleryTrack = document.querySelector('.gallery-track');
    const lightbox = document.querySelector('.gallery-lightbox');
    const lightboxImage = document.querySelector('.gallery-lightbox-image');
    const lightboxCaption = document.querySelector('.gallery-lightbox-caption');
    const closeButton = document.querySelector('.gallery-close');

    if (!galleryTrack || !lightbox || !lightboxImage || !lightboxCaption || !closeButton) {
        return;
    }

    // Helper to disable right-click and dragging
    const protectImage = (img) => {
        img.addEventListener('contextmenu', (e) => e.preventDefault());
        img.addEventListener('dragstart', (e) => e.preventDefault());
        
        // CSS protections for mobile (iOS/Android)
        img.style.webkitTouchCallout = 'none'; // Disable iOS long-press menu
        img.style.userSelect = 'none';         // specific for turning off selection
        img.style.webkitUserSelect = 'none';   // for Safari/Chrome
    };

    // Protect the lightbox image
    protectImage(lightboxImage);

    const openLightbox = (source, caption, altText) => {
        lightboxImage.src = source;
        lightboxImage.alt = altText || caption || 'Gallery photo';
        lightboxCaption.textContent = caption || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        closeButton.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.src = '';
        lightboxImage.alt = '';
        lightboxCaption.textContent = '';
    };

    const buildGallery = (items) => {
        galleryTrack.innerHTML = '';
        const fragment = document.createDocumentFragment();

        const addItems = () => {
            items.forEach((item) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'gallery-item';
                button.dataset.full = item.full || item.src;
                button.dataset.caption = item.caption || '';

                const image = document.createElement('img');
                image.src = item.src;
                image.alt = item.alt || item.caption || 'Gallery photo';
                
                // Protect thumbnail
                protectImage(image);
                
                button.appendChild(image);
                fragment.appendChild(button);
            });
        };

        addItems();
        addItems();
        galleryTrack.appendChild(fragment);
    };

    galleryTrack.addEventListener('click', (event) => {
        const item = event.target.closest('.gallery-item');
        if (!item) return;
        const image = item.querySelector('img');
        const source = item.getAttribute('data-full') || image?.src;
        const caption = item.getAttribute('data-caption') || image?.alt || '';
        const altText = image?.alt || caption;
        if (source) {
            openLightbox(source, caption, altText);
        }
    });

    const sourcePath = galleryTrack.dataset.source;
    if (!sourcePath) {
        return;
    }

    fetch(sourcePath)
        .then((response) => response.json())
        .then((items) => {
            if (!Array.isArray(items) || items.length === 0) {
                return;
            }
            buildGallery(items);
        })
        .catch(() => {
            return;
        });

    closeButton.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeLightbox();
        }
    });
});
