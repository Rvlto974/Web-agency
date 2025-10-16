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