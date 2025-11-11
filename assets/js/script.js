fetch('navbar.html')
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

fetch('footer.html')
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
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    const slideWidth = 270; 
    let currentPosition = 0;
    
    function updateCounter() {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        const scrollPercentage = Math.round((slider.scrollLeft / maxScroll) * 100);
        if (counter) {
            counter.textContent = `Scroll: ${scrollPercentage}%`;
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

// ===== TAMBAHAN JAVASCRIPT UNTUK HALAMAN BERITA =====

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

    const contactBtn = document.querySelector('.btn-contact');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            window.location.href = 'contact.html';
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
    const tagGroups = document.querySelectorAll('.news-tags');

    tagGroups.forEach(group => {
        const tags = group.querySelectorAll('.news-tag');
        const maxVisible = 2;

        if (tags.length > maxVisible) {
            tags.forEach((tag, i) => {
                if (i >= maxVisible) tag.style.display = 'none';
            });

            const moreTag = document.createElement('span');
            moreTag.classList.add('news-tag', 'more');
            moreTag.textContent = `+${tags.length - maxVisible}`;
            group.appendChild(moreTag);
        }
    });
});