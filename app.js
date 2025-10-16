// ============================================
// GESTION DE LA NAVIGATION ACTIVE ET SMOOTH SCROLL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Navigation active
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Activer "Accueil" en haut de page
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const accueilLink = document.querySelector('.nav-links a[href="#accueil"]');
            if (accueilLink) accueilLink.classList.add('active');
        }
    }
    
    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // ============================================
    // CARROUSEL / SLIDER
    // ============================================

    const sliderData = [
        {
            image: './assets/slider/bg1.jpg',
            title: 'WEBAGENCY : L\'AGENCE DE TOUS VOS PROJETS!',
            description: 'Vous avez un projet web? La Webagency vous aide à le réaliser.'
        },
        {
            image: './assets/slider/bg2.jpg',
            title: 'DES SOLUTIONS INNOVANTES',
            description: 'Notre équipe crée des solutions web sur mesure pour votre entreprise.'
        }
    ];

    let currentSlideIndex = 0;
    let autoPlayInterval;

    function changeSlide(direction) {
        const heroImage = document.querySelector('.hero-image');
        const heroContent = document.querySelector('.hero-content');
        
        if (!heroImage || sliderData.length <= 1) return;
        
        // Calcul du nouvel index
        currentSlideIndex = (currentSlideIndex + direction + sliderData.length) % sliderData.length;
        
        const slide = sliderData[currentSlideIndex];
        
        // Transition
        heroImage.style.opacity = '0';
        
        setTimeout(() => {
            heroImage.src = slide.image;
            heroImage.alt = slide.title;
            
            if (heroContent) {
                const titleElement = heroContent.querySelector('h1');
                const descriptionElement = heroContent.querySelector('p');
                
                if (titleElement) {
                    titleElement.innerHTML = slide.title.replace('WEBAGENCY', '<span class="logo-name">WEBAGENCY</span>');
                }
                if (descriptionElement) {
                    descriptionElement.textContent = slide.description;
                }
            }
            
            heroImage.style.opacity = '1';
        }, 500);
        
        updateIndicators();
    }

    function goToSlide(index) {
        if (index >= 0 && index < sliderData.length) {
            const direction = index > currentSlideIndex ? 1 : -1;
            currentSlideIndex = index - direction;
            changeSlide(direction);
        }
    }

    function updateIndicators() {
        const indicators = document.querySelectorAll('.slider-dot');
        indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlideIndex);
        });
    }

    function createIndicators() {
        if (sliderData.length <= 1) return;
        
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'slider-indicators';
        
        sliderData.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                goToSlide(index);
                stopAutoPlay();
                setTimeout(startAutoPlay, 10000);
            });
            indicatorsContainer.appendChild(dot);
        });
        
        document.querySelector('.hero-section').appendChild(indicatorsContainer);
    }

    function startAutoPlay() {
        if (sliderData.length > 1) {
            autoPlayInterval = setInterval(() => {
                changeSlide(1);
            }, 5000);
        }
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function initCarousel() {
        const prevArrow = document.querySelector('.slider-arrow.prev');
        const nextArrow = document.querySelector('.slider-arrow.next');
        const heroSection = document.querySelector('.hero-section');
        
        // Créer les indicateurs
        if (sliderData.length > 1) {
            createIndicators();
        }
        
        // Événements des flèches
        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                changeSlide(-1);
                stopAutoPlay();
                setTimeout(startAutoPlay, 10000);
            });
        }
        
        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                changeSlide(1);
                stopAutoPlay();
                setTimeout(startAutoPlay, 10000);
            });
        }
        
        // Pause au survol
        if (heroSection) {
            heroSection.addEventListener('mouseenter', stopAutoPlay);
            heroSection.addEventListener('mouseleave', startAutoPlay);
        }
        
        // Navigation clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                changeSlide(-1);
                stopAutoPlay();
                setTimeout(startAutoPlay, 10000);
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
                stopAutoPlay();
                setTimeout(startAutoPlay, 10000);
            }
        });
        
        // Pause quand la page n'est pas visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        });
        
        // Démarrer l'auto-play
        startAutoPlay();
    }

    // ============================================
    // FILTRES PORTFOLIO
    // ============================================

    function initPortfolioFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Retirer active de tous les boutons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Ajouter active au bouton cliqué
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filtrer les projets
                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ============================================
    // INITIALISATION
    // ============================================

    // Initialiser le carrousel
    initCarousel();
    
    // Initialiser les filtres portfolio
    initPortfolioFilters();
});

// ============================================
// GESTION DU RESPONSIVE MANUEL
// ============================================

function handleResize() {
    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.hero-image');
    
    if (window.innerWidth < 768) {
        // Mobile
        if (heroSection) {
            heroSection.style.height = '50vh';
            heroSection.style.minHeight = '350px';
        }
        if (heroImage) {
            heroImage.style.objectPosition = 'center center';
        }
    } else if (window.innerWidth < 1024) {
        // Tablette
        if (heroSection) {
            heroSection.style.height = '60vh';
            heroSection.style.minHeight = '400px';
        }
    } else {
        // Desktop
        if (heroSection) {
            heroSection.style.height = '80vh';
            heroSection.style.minHeight = '600px';
        }
    }
}

// Écouter le redimensionnement
window.addEventListener('resize', handleResize);

// Initialiser au chargement
window.addEventListener('load', handleResize);

// ============================================
// POLYFILL POURObject-fit POUR IE/EDGE ANCIENS
// ============================================

if ('objectFit' in document.documentElement.style === false) {
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('.hero-image, .portfolio-image img');
        images.forEach(function(image) {
            const src = image.src;
            image.style.backgroundImage = 'url(' + src + ')';
            image.style.backgroundSize = 'cover';
            image.style.backgroundPosition = 'center';
            image.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'' + image.width + '\' height=\'' + image.height + '\'%3E%3C/svg%3E';
        });
    });
}