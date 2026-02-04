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
const totalSlides = 5;

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
    
    // Rotating image click to pause/resume rotation for that specific project
    const rotatingImageElements = document.querySelectorAll('.rotating-image');
    rotatingImageElements.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering project card click
            const projectId = parseInt(this.getAttribute('data-project'));
            toggleProjectRotation(projectId);
        });
    });
    
    // Initialize carousel
    updateCarousel();
    
    // Initialize all project image rotations
    startAllRotations();
});

// Initialize gradients
updateGradients();

// Update navbar text color based on current section
updateNavbarColor();

// Initialize active nav link
updateActiveNavLink();
function updateNavbarColor() {
    const navbar = document.getElementById('navbar');
    const scrollTop = scrollWrapper.scrollTop;
    const viewportHeight = window.innerHeight;
    
    // Find which section is currently in view
    const projectsSection = document.getElementById('projects');
    const projectsTop = projectsSection.offsetTop;
    const projectsBottom = projectsTop + viewportHeight;
    
    // Check if projects section is visible (with some threshold for smooth transition)
    const isProjectsVisible = scrollTop >= projectsTop - viewportHeight * 0.5 && scrollTop < projectsBottom;
    
    if (isProjectsVisible) {
        navbar.classList.add('light-text');
    } else {
        navbar.classList.remove('light-text');
    }
}

// Update active navbar link based on current section
function updateActiveNavLink() {
    const scrollTop = scrollWrapper.scrollTop;
    const viewportHeight = window.innerHeight;
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Determine which section is currently in view
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + viewportHeight;
        const sectionId = section.id;
        
        // Check if section is in view (with some threshold)
        if (scrollTop >= sectionTop - viewportHeight * 0.3 && scrollTop < sectionBottom - viewportHeight * 0.3) {
            // Find and activate the corresponding nav link
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
    
    // Special case for hero section at the very top
    if (scrollTop < viewportHeight * 0.5) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#hero') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Update gradients on scroll with throttling for performance
let ticking = false;
scrollWrapper.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(function() {
            updateGradients();
            updateNavbarColor();
            updateActiveNavLink();
            ticking = false;
        });
        ticking = true;
    }
});

// Update on window resize
window.addEventListener('resize', function() {
    updateGradients();
    updateNavbarColor();
    updateActiveNavLink();
});

// Project image rotation system
const projectImages = {
    1: ['images/FlowField1.png', 'images/FlowField2.png'], // FlowField
    2: ['images/communityGraph1.png', 'images/communityGraph2.png'], // Community Graph
    3: ['images/ColorCorrect1.png', 'images/ColorCorrect2.png'], // Color-Correct
    4: ['images/MortgageCalculator1.png', 'images/MortgageCalculator2.png'], // Mortgage Calculator
    5: ['images/storymap1.png', 'images/storymap2.png'] // Spatial Analysis
};

const projectRotationStates = {
    1: { paused: false },
    2: { paused: false },
    3: { paused: false },
    4: { paused: false },
    5: { paused: false }
};

let rotationInterval = null;

function rotateProjectImages(projectId) {
    if (projectRotationStates[projectId].paused) {
        return;
    }
    const images = document.querySelectorAll(`.rotating-image[data-project="${projectId}"]`);
    const imageArray = projectImages[projectId];
    images.forEach(img => {
        const currentIndex = parseInt(img.getAttribute('data-image-index')) || 0;
        const nextIndex = (currentIndex + 1) % imageArray.length;
        img.src = imageArray[nextIndex];
        img.setAttribute('data-image-index', nextIndex);
    });
}

function rotateAllProjectImages() {
    Object.keys(projectImages).forEach(projectId => {
        rotateProjectImages(parseInt(projectId));
    });
}

function startAllRotations() {
    if (rotationInterval) {
        clearInterval(rotationInterval);
    }
    Object.keys(projectRotationStates).forEach(projectId => {
        projectRotationStates[projectId].paused = false;
    });
    rotationInterval = setInterval(rotateAllProjectImages, 2000);
}

function toggleProjectRotation(projectId) {
    const state = projectRotationStates[projectId];
    state.paused = !state.paused;
}