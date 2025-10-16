// Gestion de la navigation active et smooth scroll
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
});

// ============================================
// CARROUSEL / SLIDER
// ============================================

// Liste des images du slider
const sliderImages = [
    './assets/slider/bg1.jpg',
    './assets/slider/bg2.jpg',

    // Ajoutez d'autres images ici
];

let currentSlideIndex = 0;
let autoPlayInterval;

// Fonction pour changer de slide
function changeSlide(direction) {
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroImage || sliderImages.length <= 1) {
        return;
    }
    
    // Calculer le nouvel index
    currentSlideIndex += direction;
    
    // Boucler sur les images
    if (currentSlideIndex < 0) {
        currentSlideIndex = sliderImages.length - 1;
    } else if (currentSlideIndex >= sliderImages.length) {
        currentSlideIndex = 0;
    }
    
    // Effet de transition
    heroImage.style.opacity = '0';
    heroImage.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        heroImage.src = sliderImages[currentSlideIndex];
        heroImage.style.opacity = '1';
    }, 500);
}

// Auto-play (défilement automatique toutes les 5 secondes)
function startAutoPlay() {
    if (sliderImages.length > 1) {
        autoPlayInterval = setInterval(() => {
            changeSlide(1);
        }, 5000); // Change toutes les 5 secondes
    }
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    const prevArrow = document.querySelector('.slider-arrow.prev');
    const nextArrow = document.querySelector('.slider-arrow.next');
    const heroSection = document.querySelector('.hero-section');
    
    // Écouter les clics sur les flèches
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            changeSlide(-1);
            stopAutoPlay(); // Arrêter l'auto-play quand on clique
            setTimeout(startAutoPlay, 10000); // Redémarrer après 10 secondes
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
    
    // Démarrer l'auto-play
    startAutoPlay();
});