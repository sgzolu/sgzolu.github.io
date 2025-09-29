// Navigation functionality for the academic website
class NavigationManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        this.setActiveNavigation();
        this.bindEvents();
        this.handleScrollEffects();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        
        // Handle different possible file names
        if (page === '' || page === 'index.html') return 'index.html';
        if (page.includes('research')) return 'research.html';
        if (page.includes('notes')) return 'notes.html';
        if (page.includes('contact')) return 'contact.html';
        
        return page;
    }

    setActiveNavigation() {
        // Remove all active classes
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Set active class based on current page
        const pageMap = {
            'index.html': 'index.html',
            'research.html': 'research.html',
            'notes.html': 'notes.html',
            'contact.html': 'contact.html'
        };

        const targetPage = pageMap[this.currentPage];
        if (targetPage) {
            const activeLink = document.querySelector(`a[href="${targetPage}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    bindEvents() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navigation link hover effects
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', this.handleNavHover);
            link.addEventListener('mouseleave', this.handleNavLeave);
        });

        // Mobile menu toggle (if needed for future mobile navigation)
        this.handleMobileNavigation();
    }

    handleNavHover(e) {
        if (!e.target.classList.contains('active')) {
            e.target.style.transform = 'translateY(-2px)';
        }
    }

    handleNavLeave(e) {
        if (!e.target.classList.contains('active')) {
            e.target.style.transform = 'translateY(0)';
        }
    }

    handleScrollEffects() {
        let lastScrollTop = 0;
        const nav = document.querySelector('.main-nav');
        
        if (!nav) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class for styling
            if (scrollTop > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Hide/show navigation on scroll (optional)
            if (Math.abs(lastScrollTop - scrollTop) <= 5) return;
            
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                nav.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                nav.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    handleMobileNavigation() {
        // Mobile navigation toggle functionality
        const createMobileToggle = () => {
            const nav = document.querySelector('.main-nav ul');
            if (!nav) return;

            // Create mobile toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'mobile-nav-toggle';
            toggleBtn.innerHTML = '☰';
            toggleBtn.setAttribute('aria-label', 'Toggle navigation');
            
            // Insert toggle button
            const navContainer = document.querySelector('.main-nav .container');
            if (navContainer) {
                navContainer.insertBefore(toggleBtn, nav);
            }

            // Toggle functionality
            toggleBtn.addEventListener('click', () => {
                nav.classList.toggle('mobile-open');
                toggleBtn.classList.toggle('active');
                toggleBtn.innerHTML = nav.classList.contains('mobile-open') ? '✕' : '☰';
            });

            // Close mobile nav when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !toggleBtn.contains(e.target)) {
                    nav.classList.remove('mobile-open');
                    toggleBtn.classList.remove('active');
                    toggleBtn.innerHTML = '☰';
                }
            });

            // Close mobile nav on window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    nav.classList.remove('mobile-open');
                    toggleBtn.classList.remove('active');
                    toggleBtn.innerHTML = '☰';
                }
            });
        };

        // Create mobile toggle if on mobile
        if (window.innerWidth <= 768) {
            createMobileToggle();
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            const existingToggle = document.querySelector('.mobile-nav-toggle');
            if (window.innerWidth <= 768 && !existingToggle) {
                createMobileToggle();
            } else if (window.innerWidth > 768 && existingToggle) {
                existingToggle.remove();
                document.querySelector('.main-nav ul').classList.remove('mobile-open');
            }
        });
    }

    // Method to programmatically navigate
    navigateTo(page) {
        if (this.currentPage !== page) {
            window.location.href = page;
        }
    }

    // Method to update navigation state
    updateNavigation(newPage) {
        this.currentPage = newPage;
        this.setActiveNavigation();
    }
}

// Utility functions for navigation
const NavigationUtils = {
    // Smooth scroll to element
    scrollToElement: (elementId, offset = 0) => {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Get current scroll position
    getScrollPosition: () => {
        return window.pageYOffset || document.documentElement.scrollTop;
    },

    // Add scroll-based animations
    initScrollAnimations: () => {
        const animateElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
};

// Page-specific navigation handlers
const PageHandlers = {
    // Handle home page section navigation
    initHomePage: () => {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        if (sections.length === 0) return;

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                
                // Hide all sections
                sections.forEach(section => section.classList.remove('active'));
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                
                // Show target section
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    link.classList.add('active');
                }
            });
        });
    },

    // Handle research page functionality
    initResearchPage: () => {
        // Add any research page specific navigation
        const publicationLinks = document.querySelectorAll('.pub-link');
        publicationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.textContent === 'PDF' || link.textContent === 'DOI') {
                    e.preventDefault();
                    // Handle PDF/DOI links - could open in new tab or show modal
                    console.log('Opening:', link.textContent);
                }
            });
        });
    },

    // Handle notes page functionality
    initNotesPage: () => {
        // Notes page functionality is handled by notes.js
        // This could include additional navigation features
    },

    // Handle contact page functionality  
    initContactPage: () => {
        // Contact page functionality is handled by contact.js
        // This could include additional navigation features
    }
};

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main navigation
    const navigation = new NavigationManager();
    
    // Initialize scroll animations
    NavigationUtils.initScrollAnimations();
    
    // Initialize page-specific handlers
    const currentPage = navigation.getCurrentPage();
    switch (currentPage) {
        case 'index.html':
            PageHandlers.initHomePage();
            break;
        case 'research.html':
            PageHandlers.initResearchPage();
            break;
        case 'notes.html':
            PageHandlers.initNotesPage();
            break;
        case 'contact.html':
            PageHandlers.initContactPage();
            break;
    }

    // Make navigation available globally
    window.navigation = navigation;
    window.NavigationUtils = NavigationUtils;
});

// Add CSS for mobile navigation and scroll effects
const addNavigationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile Navigation Styles */
        .mobile-nav-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 5px;
            color: #333;
        }

        @media (max-width: 768px) {
            .mobile-nav-toggle {
                display: block;
                margin-bottom: 15px;
            }

            .main-nav ul {
                display: none;
                flex-direction: column;
                gap: 10px;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                z-index: 1000;
            }

            .main-nav ul.mobile-open {
                display: flex;
            }

            .main-nav {
                position: relative;
            }
        }

        /* Scroll Effects */
        .main-nav {
            transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .main-nav.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }

        /* Animation Classes */
        [data-animate] {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        [data-animate].animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        /* Navigation Hover Effects */
        .nav-link {
            position: relative;
            transition: transform 0.2s ease;
        }

        .nav-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -5px;
            left: 50%;
            background-color: #000;
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }

        .nav-link:hover::after {
            width: 100%;
        }

        .nav-link.active::after {
            width: 100%;
        }
    `;
    
    document.head.appendChild(style);
};

// Add styles when script loads
addNavigationStyles();