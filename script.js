// Gradient transition logic
const scrollWrapper = document.getElementById('scrollWrapper');
const sections = document.querySelectorAll('.scroll-section');

// Define gradient angles for each section
const gradientConfig = {
    hero: { angle: 180, colors: 'rgba(126, 166, 214, 1) 0%, rgba(255, 251, 229, 1) 90%' },
    about: { angle: 90, colors: 'rgba(126, 166, 214, 1) 0%, rgba(255, 251, 229, 1) 70%' },
    projects: { angle: null, background: '#0a1f44' }, // No gradient, solid color
    contact: { angle: 0, colors: 'rgba(126, 166, 214, 1) 0%, rgba(255, 251, 229, 1) 100%' }
};

function updateGradients() {
    const scrollTop = scrollWrapper.scrollTop;
    const viewportHeight = window.innerHeight;
    
    sections.forEach((section, index) => {
        const sectionId = section.id;
        const config = gradientConfig[sectionId];
        
        // Skip projects section (solid background)
        if (sectionId === 'projects') {
            return;
        }
        
        // Calculate section position relative to viewport
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + viewportHeight;
        
        // Determine if section is currently visible
        const isVisible = scrollTop >= sectionTop - viewportHeight && scrollTop < sectionBottom;
        
        if (isVisible) {
            // Calculate progress through the section (0 to 1)
            const sectionProgress = (scrollTop - sectionTop + viewportHeight) / (viewportHeight * 2);
            const clampedProgress = Math.max(0, Math.min(1, sectionProgress));
            
            let currentAngle = config.angle;
            
            // Calculate angle transitions between sections
            if (sectionId === 'hero') {
                // Transition from 180° to 90° as we scroll through hero section
                const nextConfig = gradientConfig.about;
                if (nextConfig.angle !== null) {
                    currentAngle = config.angle + (nextConfig.angle - config.angle) * clampedProgress;
                }
            } else if (sectionId === 'about') {
                // Transition from 90° to 0° as we scroll through about section
                const nextConfig = gradientConfig.contact;
                if (nextConfig.angle !== null) {
                    currentAngle = config.angle + (nextConfig.angle - config.angle) * clampedProgress;
                }
            } else if (sectionId === 'contact') {
                // Keep contact at 0° or transition to next if needed
                currentAngle = config.angle;
            }
            
            // Apply the gradient
            const gradient = `linear-gradient(${currentAngle}deg, ${config.colors})`;
            section.style.background = gradient;
        } else {
            // Set default gradient when not actively transitioning
            if (config.angle !== null) {
                const gradient = `linear-gradient(${config.angle}deg, ${config.colors})`;
                section.style.background = gradient;
            }
        }
    });
}

// Smooth scroll behavior for navigation
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
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

// Carousel functionality
let currentSlide = 0;
const totalSlides = 4;

function updateCarousel() {
    const slides = document.getElementById('carouselSlides');
    const dots = document.querySelectorAll('.dot');
    const cards = document.querySelectorAll('.project-card');
    
    // Move slides
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // Update cards
    cards.forEach((card, index) => {
        card.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

// Project card functionality
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    // Carousel navigation
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Project card click functionality
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            openExpandedProject(projectId);
        });
    });
    
    // Initialize carousel
    updateCarousel();
});

function openExpandedProject(projectId) {
    // Hide the carousel
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.style.display = 'none';
    
    // Show the expanded project
    const expandedProject = document.getElementById(`expandedProject${projectId}`);
    expandedProject.classList.add('active');
}

function closeExpandedProject() {
    // Hide all expanded projects
    const expandedProjects = document.querySelectorAll('.project-expanded');
    expandedProjects.forEach(project => {
        project.classList.remove('active');
    });
    
    // Show the carousel
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.style.display = 'flex';
}

// Initialize gradients
updateGradients();

// Update gradients on scroll with throttling for performance
let ticking = false;
scrollWrapper.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(function() {
            updateGradients();
            ticking = false;
        });
        ticking = true;
    }
});

// Update on window resize
window.addEventListener('resize', updateGradients);