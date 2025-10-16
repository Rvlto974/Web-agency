// ============================================
// GESTION DE LA NAVIGATION ACTIVE ET SMOOTH SCROLL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Fonction pour mettre à jour la navigation active
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
        
        // Si on est en haut de page, activer "Accueil"
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const accueilLink = document.querySelector('.nav-links a[href="#accueil"]');
            if (accueilLink) accueilLink.classList.add('active');
        }
    }
    
    // Smooth scroll pour les liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Mettre à jour l'état actif
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll smooth
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Écouter le scroll pour mettre à jour la navigation
    window.addEventListener('scroll', updateActiveNav);
    
    // Initialiser au chargement
    updateActiveNav();

    // ============================================
    // CARROUSEL / SLIDER
    // ============================================

    // Données complètes du slider (images + contenu)
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
        // Ajoutez d'autres slides ici si nécessaire
    ];

    let currentSlideIndex = 0;
    let autoPlayInterval;

    // Fonction pour changer de slide
    function changeSlide(direction) {
        const heroImage = document.querySelector('.hero-image');
        const heroContent = document.querySelector('.hero-content');
        
        if (!heroImage || sliderData.length <= 1) {
            return;
        }
        
        // Calculer le nouvel index avec modulo pour boucler
        currentSlideIndex = (currentSlideIndex + direction + sliderData.length) % sliderData.length;
        
        // Récupérer les données du slide
        const slide = sliderData[currentSlideIndex];
        
        // Effet de transition
        heroImage.style.opacity = '0';
        
        setTimeout(() => {
            // Mettre à jour l'image ET le contenu
            heroImage.src = slide.image;
            heroImage.alt = slide.title;
            
            // Mettre à jour le titre et la description
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
        
        // Mettre à jour les indicateurs si ils existent
        updateIndicators();
    }

    // Fonction pour aller directement à un slide spécifique
    function goToSlide(index) {
        if (index >= 0 && index < sliderData.length) {
            const direction = index > currentSlideIndex ? 1 : -1;
            currentSlideIndex = index - direction;
            changeSlide(direction);
        }
    }

    // Mettre à jour les indicateurs visuels
    function updateIndicators() {
        const indicators = document.querySelectorAll('.slider-indicators .slider-dot');
        indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlideIndex);
        });
    }

    // Créer les indicateurs de slide (points en bas)
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

    // Auto-play (défilement automatique toutes les 5 secondes)
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

    // Initialisation du carrousel
    function initCarousel() {
        const prevArrow = document.querySelector('.slider-arrow.prev');
        const nextArrow = document.querySelector('.slider-arrow.next');
        const heroSection = document.querySelector('.hero-section');
        
        // Créer les indicateurs si on a plusieurs slides
        if (sliderData.length > 1) {
            createIndicators();
        }
        
        // Écouter les clics sur les flèches
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
        
        // Navigation au clavier
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
                // Retirer la classe active de tous les boutons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filtrer les projets avec animation
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
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
    // INITIALISATION GÉNÉRALE
    // ============================================

    // Initialiser le carrousel
    initCarousel();
    
    // Initialiser les filtres du portfolio
    initPortfolioFilters();
});