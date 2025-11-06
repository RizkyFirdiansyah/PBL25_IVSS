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