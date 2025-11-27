fetch('../utils/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;

        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            document.querySelectorAll('.nav-menu li a:not(.dropdown-toggle)').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        const dropdownToggle = document.querySelector('.dropdown-toggle');
        const dropdown = document.querySelector('.dropdown');

        if (dropdownToggle && dropdown) {
            dropdownToggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }

        setActiveMenu();
    })
    .catch(error => console.error('Error loading navbar:', error));

fetch('../utils/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;

        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                alert(`Terima kasih! Email ${email} telah berhasil didaftarkan untuk newsletter.`);
                newsletterForm.reset();
            });
        }
    })
    .catch(error => console.error('Error loading footer:', error));

function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu li a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.parentElement.classList.add('active');
        }
    });
}

// ada tambahan untuk slider 
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    initializeSlider();
});

function initializeSlider() {
    const slider = document.getElementById('imageSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const counter = document.getElementById('sliderCounter');
    const galleryBtn = document.getElementById('sliderGalleryBtn');

    if (!slider || !prevBtn || !nextBtn) return;

    const slideWidth = 270;
    let currentPosition = 0;

    function updateCounter() {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        const scrollPercentage = Math.round((slider.scrollLeft / maxScroll) * 100);

        if (counter) {
            counter.textContent = `Scroll: ${scrollPercentage}%`;
        }

        if (galleryBtn) {
            if (scrollPercentage >= 80) {
                galleryBtn.classList.add('show');
            } else {
                galleryBtn.classList.remove('show');
            }
        }

        prevBtn.disabled = slider.scrollLeft <= 0;
        nextBtn.disabled = slider.scrollLeft >= maxScroll - 10;
    }

    prevBtn.addEventListener('click', () => {
        slider.scrollBy({
            left: -slideWidth * 3,
            behavior: 'smooth'
        });
        setTimeout(updateCounter, 300);
    });

    nextBtn.addEventListener('click', () => {
        slider.scrollBy({
            left: slideWidth * 3,
            behavior: 'smooth'
        });
        setTimeout(updateCounter, 300);
    });

    slider.addEventListener('scroll', updateCounter);

    updateCounter();

    slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
}

window.addEventListener("scroll", reveal);

function reveal() {
    const reveals = document.querySelectorAll(".reveal");

    reveals.forEach(el => {
        let windowHeight = window.innerHeight;
        let elementTop = el.getBoundingClientRect().top;
        let elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            el.classList.add("active");
        }
    });
}

reveal();

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const yearFilter = document.getElementById('yearFilter');
    const newsItems = document.querySelectorAll('.news-item');

    if (searchInput) {
        searchInput.addEventListener('input', filterNews);
    }

    if (yearFilter) {
        yearFilter.addEventListener('change', filterNews);
    }

    function filterNews() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedYear = yearFilter ? yearFilter.value : '';

        newsItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const content = item.querySelector('p').textContent.toLowerCase();
            const date = item.querySelector('.news-date').textContent;

            const matchesSearch = title.includes(searchTerm) || content.includes(searchTerm);
            const matchesYear = selectedYear === '' || date.includes(selectedYear);

            if (matchesSearch && matchesYear) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    const pageLinks = document.querySelectorAll('.page-link:not(.prev):not(.next)');

    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            pageLinks.forEach(l => l.classList.remove('active'));

            link.classList.add('active');

            scrollToNewsSection();
        });
    });

    const prevBtn = document.querySelector('.page-link.prev');
    const nextBtn = document.querySelector('.page-link.next');

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentActive = document.querySelector('.page-link.active');
            const prevPage = currentActive.previousElementSibling;

            if (prevPage && !prevPage.classList.contains('prev')) {
                pageLinks.forEach(l => l.classList.remove('active'));
                prevPage.classList.add('active');
                scrollToNewsSection();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentActive = document.querySelector('.page-link.active');
            const nextPage = currentActive.nextElementSibling;

            if (nextPage && !nextPage.classList.contains('page-dots') && !nextPage.classList.contains('next')) {
                pageLinks.forEach(l => l.classList.remove('active'));
                nextPage.classList.add('active');
                scrollToNewsSection();
            }
        });
    }

    function scrollToNewsSection() {
        const newsSection = document.querySelector('.news-list-section');
        if (newsSection) {
            const offset = 80;
            const elementPosition = newsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    const contactBtn = document.querySelector('.btn-feedback');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            window.location.href = 'feedback.html';
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    newsItems.forEach(item => {
        observer.observe(item);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const tagGroups = document.querySelectorAll('.news-tags, .penelitian-tags');

    tagGroups.forEach(group => {
        const isPenelitian = group.classList.contains('penelitian-tags');
        const tags = group.querySelectorAll(isPenelitian ? '.penelitian-tag' : '.news-tag');
        const maxVisible = 2;

        if (tags.length > maxVisible) {
            tags.forEach((tag, i) => {
                if (i >= maxVisible) tag.style.display = 'none';
            });

            const moreTag = document.createElement('span');
            moreTag.classList.add('more');
            moreTag.classList.add(isPenelitian ? 'penelitian-tag' : 'news-tag');
            moreTag.textContent = `+${tags.length - maxVisible}`;
            group.appendChild(moreTag);
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".grid-item");
    const btn = document.getElementById("loadMoreBtn");
    const limit = 6;

    items.forEach((item, index) => {
        if (index >= limit) {
            item.style.display = "none";
        }
    });

    btn.addEventListener("click", () => {
        items.forEach(item => item.style.display = "block");
        btn.style.display = "none";
    });
});

// tambahan js untuk gallery 
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galleryGrid = document.getElementById('galleryGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');

    let currentIndex = 0;
    let allImages = [];

    // tambahkan foto-foto lainnya di sini
    const additionalImages = [
        { src: '../assets/gambar/rs.jpg', alt: 'Research Space' },
        { src: '../assets/gambar/stopContact.jpeg', alt: 'Stop Kontak' },
        { src: '../assets/gambar/rak2.jpeg', alt: 'Rak' },
    ];

    let imagesLoaded = false;

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            if (!imagesLoaded && additionalImages.length > 0) {
                loadMoreImages();
                imagesLoaded = true;

                loadMoreBtn.querySelector('.btn-text').textContent = 'Semua Foto Dimuat';
                loadMoreBtn.querySelector('i').className = 'fas fa-check';
                loadMoreBtn.disabled = true;

                setTimeout(() => {
                    loadMoreContainer.classList.add('hidden');
                }, 2000);
            } else if (additionalImages.length === 0) {
                loadMoreContainer.classList.add('hidden');
            }
        });
    }

    if (additionalImages.length === 0 && loadMoreContainer) {
        loadMoreContainer.classList.add('hidden');
    }

    function loadMoreImages() {
        additionalImages.forEach((imageData, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.style.opacity = '0';
            galleryItem.style.transform = 'scale(0.8)';

            galleryItem.innerHTML = `
                <img src="${imageData.src}" alt="${imageData.alt}" loading="lazy">
                <div class="gallery-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            `;

            galleryGrid.appendChild(galleryItem);

            setTimeout(() => {
                galleryItem.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                galleryItem.style.opacity = '1';
                galleryItem.style.transform = 'scale(1)';
            }, index * 80);

            const img = galleryItem.querySelector('img');
            galleryItem.addEventListener('click', () => {
                updateImagesList();
                currentIndex = allImages.indexOf(img);
                openLightbox(img.src);
            });
        });

        updateImagesList();
    }

    function updateImagesList() {
        allImages = Array.from(document.querySelectorAll('.gallery-item img'));
    }

    updateImagesList();

    document.querySelectorAll('.gallery-item').forEach((item) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            currentIndex = allImages.indexOf(img);
            openLightbox(img.src);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
            lightboxImg.src = allImages[currentIndex].src;
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % allImages.length;
            lightboxImg.src = allImages[currentIndex].src;
        });
    }

    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                lightboxPrev.click();
            } else if (e.key === 'ArrowRight') {
                lightboxNext.click();
            }
        }
    });

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.gallery-item').forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
        observer.observe(item);
    });
});
