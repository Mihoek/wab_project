// Sélecteurs globaux
const preloader = document.querySelector('.preloader');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.header');

// Préchargeur
window.addEventListener('load', () => {
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 300);
});

// Navigation responsive
function toggleMenu() {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

menuToggle.addEventListener('click', toggleMenu);

// Fermer le menu lors du clic sur un lien
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Gestion du menu lors du redimensionnement
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// Navigation sticky avec gestion du scroll
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Validation et gestion des formulaires
// Utilitaire de validation d'email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Gestion du formulaire de recherche
const searchForm = document.querySelector('.search-form');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const destination = searchForm.querySelector('input[type="text"]').value;
        const date = searchForm.querySelector('input[type="date"]').value;
        const travelers = searchForm.querySelector('select').value;

        if (!destination || !date || !travelers) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        console.log('Recherche:', { destination, date, travelers });
    });
}

// Gestion de la newsletter
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (!isValidEmail(email)) {
            alert('Veuillez entrer une adresse email valide');
            return;
        }

        alert('Merci de votre inscription !');
        newsletterForm.reset();
    });
}

// Animation des statistiques
function animateValue(element, start, end, duration) {
    let current = start;
    const increment = (end - start) / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.round(current);
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        }
    }, 16);
}

const stats = document.querySelectorAll('.stat-number');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const value = parseInt(target.textContent);
            animateValue(target, 0, value, 2000);
            observer.unobserve(target);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => observer.observe(stat));

// Gestion des modals d'authentification
const loginButton = document.querySelector('a[href="login.html"]');
const signupButton = document.querySelector('a[href="register.html"]');
const loginModal = document.querySelector('.login-modal');
const signupModal = document.querySelector('.signup-modal');
const closeButtons = document.querySelectorAll('.close-modal');
const authForms = document.querySelectorAll('.auth-form');

let modalTimeout;

// Fonctions de gestion des modals
function showModal(modal) {
    clearTimeout(modalTimeout);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Événements des modals
loginButton?.addEventListener('mouseenter', () => modalTimeout = setTimeout(() => showModal(loginModal), 500));
signupButton?.addEventListener('mouseenter', () => modalTimeout = setTimeout(() => showModal(signupModal), 500));

closeButtons.forEach(button => {
    button.addEventListener('click', () => hideModal(button.closest('.auth-modal')));
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('auth-modal')) {
        hideModal(e.target);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.auth-modal.active').forEach(hideModal);
    }
});

// Gestion des formulaires d'authentification
authForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validation des champs
        const inputs = form.querySelectorAll('input');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                const formGroup = input.closest('.form-group');
                formGroup.classList.add('error');
                
                if (!formGroup.querySelector('.error-message')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Ce champ est requis';
                    formGroup.appendChild(errorMessage);
                }
            }
        });

        // Validation des mots de passe pour l'inscription
        if (form.closest('.signup-modal')) {
            const password = form.querySelector('#signup-password');
            const confirmPassword = form.querySelector('#signup-password-confirm');
            
            if (password.value !== confirmPassword.value) {
                isValid = false;
                const formGroup = confirmPassword.closest('.form-group');
                formGroup.classList.add('error');
                
                const errorMessage = formGroup.querySelector('.error-message') || document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Les mots de passe ne correspondent pas';
                formGroup.appendChild(errorMessage);
            }
        }

        if (isValid) {
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Chargement...';

            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                hideModal(form.closest('.auth-modal'));
                
                alert(form.closest('.login-modal') ? 
                    'Connexion réussie !' : 
                    'Inscription réussie ! Veuillez vérifier votre email.');
            }, 1500);
        }
    });

    // Gestion des erreurs en temps réel
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const formGroup = input.closest('.form-group');
            formGroup.classList.remove('error');
            const errorMessage = formGroup.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
});

// Empêcher la fermeture du modal au survol du contenu
document.querySelectorAll('.modal-content').forEach(content => {
    content.addEventListener('mouseenter', () => clearTimeout(modalTimeout));
});