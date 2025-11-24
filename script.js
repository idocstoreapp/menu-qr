// Navegación entre secciones
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const menuSections = document.querySelectorAll('.menu-section');
    
    // Función para cambiar de sección
    function switchSection(sectionId) {
        // Ocultar todas las secciones
        menuSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Scroll suave al inicio de la sección
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
        
        // Actualizar botones de navegación
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === sectionId) {
                btn.classList.add('active');
            }
        });
    }
    
    // Event listeners para los botones de navegación
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            switchSection(sectionId);
        });
    });
    
    // Animaciones al hacer scroll (AOS - Animate On Scroll)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // Observar todos los items del menú
    const menuItems = document.querySelectorAll('.menu-item[data-aos]');
    menuItems.forEach(item => {
        observer.observe(item);
    });
    
    // Efecto parallax suave en el header
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.5)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Animación de entrada para el logo
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.style.animation = 'fadeInDown 1s ease-out';
    }
    
    // Efecto de hover mejorado para items del menú
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });
    
    // Lazy loading mejorado para imágenes
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // Fallback para navegadores que no soportan lazy loading nativo
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    // Animación de carga inicial
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease-in';
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Efecto de partículas doradas al hacer hover en items (opcional, sutil)
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const content = this.querySelector('.item-content');
            if (content) {
                content.style.transition = 'all 0.3s ease';
            }
        });
    });
    
    // Smooth scroll para navegación interna
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Detectar cambios de sección y actualizar URL (sin recargar)
    function updateURL(sectionId) {
        if (history.pushState) {
            const newURL = window.location.pathname + '#' + sectionId;
            window.history.pushState({ section: sectionId }, '', newURL);
        }
    }
    
    // Cargar sección desde hash en URL
    window.addEventListener('load', function() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            switchSection(hash);
        }
    });
    
    // Manejar botón de retroceso del navegador
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.section) {
            switchSection(e.state.section);
        }
    });
    
    // Agregar actualización de URL al cambiar sección
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            updateURL(sectionId);
        });
    });
    
    // Efecto de brillo en el título de sección al aparecer
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInDown 0.8s ease-out';
            }
        });
    }, { threshold: 0.5 });
    
    sectionTitles.forEach(title => {
        titleObserver.observe(title);
    });
    
    // Animación de entrada escalonada para items del menú
    function animateMenuItems() {
        const activeSection = document.querySelector('.menu-section.active');
        if (activeSection) {
            const items = activeSection.querySelectorAll('.menu-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    item.style.transition = 'all 0.6s ease-out';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 50);
            });
        }
    }
    
    // Observar cambios en las secciones activas
    const sectionObserver = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('active')) {
                    animateMenuItems();
                }
            }
        });
    });
    
    menuSections.forEach(section => {
        sectionObserver.observe(section, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
    
    // Inicializar animaciones en la sección activa por defecto
    setTimeout(() => {
        animateMenuItems();
    }, 500);
});

// Función para agregar efecto de partículas doradas (opcional)
function createGoldenParticles(element) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#D4AF37';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.opacity = '0.8';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${2 + Math.random() * 2}s ease-in-out infinite`;
        element.style.position = 'relative';
        element.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
}

