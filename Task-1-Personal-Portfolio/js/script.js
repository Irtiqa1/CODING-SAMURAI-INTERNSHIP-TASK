// Modern Portfolio Script with Enhanced Performance
class PortfolioAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupHeaderEffects();
        this.setupFormHandling();
        this.setupIntersectionObserver();
        this.setupThemeSystem();
        this.setupMobileMenu();
        this.setupUIEnhancements();
        
        // Initialize animations after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeAnimations());
        } else {
            this.initializeAnimations();
        }
    }

    // Mobile Menu Setup - COMPLETELY FIXED
    setupMobileMenu() {
        console.log('Setting up mobile menu...');
        
        // First, remove ALL existing toggle buttons to prevent duplicates
        const allToggles = document.querySelectorAll('.mobile-toggle, .mobile-menu-toggle, .menu-toggle, .hamburger, .hamburger-menu');
        allToggles.forEach(toggle => {
            console.log('Removing duplicate toggle:', toggle);
            toggle.remove();
        });
        
        // Remove any existing overlays
        const existingOverlays = document.querySelectorAll('.nav-overlay');
        existingOverlays.forEach(overlay => {
            console.log('Removing duplicate overlay:', overlay);
            overlay.remove();
        });
        
        // Create SINGLE mobile toggle button
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-toggle';
        mobileToggle.innerHTML = '<span></span><span></span><span></span>';
        mobileToggle.setAttribute('aria-label', 'Toggle menu');
        mobileToggle.setAttribute('type', 'button');
        
        // Create SINGLE overlay
        const navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        
        // Add to DOM
        const nav = document.querySelector('nav');
        if (nav) {
            nav.appendChild(mobileToggle);
            console.log('Mobile toggle added to nav');
        }
        document.body.appendChild(navOverlay);
        console.log('Nav overlay added to body');
        
        // Toggle functionality
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('Mobile toggle clicked');
            this.toggleMobileMenu();
        });
        
        // Close menu when clicking overlay
        navOverlay.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Overlay clicked - closing menu');
            this.closeMobileMenu();
        });
        
        // Close menu when clicking nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                console.log('Nav link clicked - closing menu');
                this.closeMobileMenu();
            });
        });
        
        // Close menu when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-toggle')) {
                    console.log('Clicked outside - closing menu');
                    this.closeMobileMenu();
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                console.log('Escape key pressed - closing menu');
                this.closeMobileMenu();
            }
        });

        console.log('Mobile menu setup complete');
    }

    toggleMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelector('.nav-links');
        const navOverlay = document.querySelector('.nav-overlay');
        
        console.log('Toggle mobile menu called');
        console.log('Mobile toggle:', mobileToggle);
        console.log('Nav links:', navLinks);
        console.log('Nav overlay:', navOverlay);
        
        if (mobileToggle && navLinks && navOverlay) {
            const isActive = mobileToggle.classList.contains('active');
            console.log('Is menu active:', isActive);
            
            if (isActive) {
                this.closeMobileMenu();
            } else {
                mobileToggle.classList.add('active');
                navLinks.classList.add('active');
                navOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                console.log('Menu opened successfully');
            }
        } else {
            console.error('Mobile menu elements not found:');
            console.error('Toggle:', mobileToggle);
            console.error('Nav links:', navLinks);
            console.error('Overlay:', navOverlay);
        }
    }

    closeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelector('.nav-links');
        const navOverlay = document.querySelector('.nav-overlay');
        
        console.log('Close mobile menu called');
        
        if (mobileToggle && navLinks && navOverlay) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Menu closed successfully');
        }
    }

    // Modern smooth scrolling with performance optimization
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    this.animateScrollTo(target);
                    this.activateNavLink(link);
                    
                    // Close mobile menu if open
                    if (window.innerWidth <= 768) {
                        this.closeMobileMenu();
                    }
                }
            });
        });
    }

    animateScrollTo(target) {
        const headerHeight = window.innerWidth <= 768 ? 70 : 80;
        const targetPosition = target.offsetTop - headerHeight;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let startTime = null;

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const animation = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeProgress = easeOutCubic(progress);

            window.scrollTo(0, startPosition + distance * easeProgress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    activateNavLink(clickedLink) {
        // Remove active class from all links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to clicked link with animation
        clickedLink.classList.add('active');
    }

    // Modern header effects with performance
    setupHeaderEffects() {
        let ticking = false;
        
        const updateHeader = () => {
            const header = document.querySelector('header');
            const scrollY = window.scrollY;
            
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            this.updateActiveSection();
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = window.innerWidth <= 768 ? 100 : 120;
        const scrollPosition = window.scrollY + headerHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.setActiveNavLink(sectionId);
            }
        });
    }

    setActiveNavLink(sectionId) {
        const links = document.querySelectorAll('.nav-links a');
        
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Modern form handling with real-time validation
    setupFormHandling() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    validateField(field) {
        const group = field.closest('.form-group');
        const value = field.value.trim();

        if (!value) {
            this.showFieldError(group, 'This field is required');
            return false;
        }

        if (field.type === 'email' && !this.isValidEmail(value)) {
            this.showFieldError(group, 'Please enter a valid email');
            return false;
        }

        this.showFieldSuccess(group);
        return true;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showFieldError(group, message) {
        group.classList.add('error');
        group.classList.remove('success');
        
        let errorMsg = group.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            group.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }

    showFieldSuccess(group) {
        group.classList.add('success');
        group.classList.remove('error');
        
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.textContent = '';
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Validate all fields
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Please fix the errors before submitting.', 'error');
            return;
        }

        // Show loading state
        submitBtn.innerHTML = `
            <div class="btn-loader">
                <div class="loader-spinner"></div>
                <span>Sending...</span>
            </div>
        `;
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            
            // Reset form styles
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success');
            });
            
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // Modern intersection observer for animations
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe all animatable elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        const animationType = element.dataset.animation || 'fadeUp';
        
        element.classList.add('animated', animationType);
        
        // Special animations for specific elements
        if (element.classList.contains('skill-item')) {
            this.animateSkillBar(element);
        }
        
        if (element.classList.contains('stat-item')) {
            this.animateCounter(element);
        }
    }

    animateSkillBar(skillItem) {
        const progressBar = skillItem.querySelector('.skill-progress');
        const percentage = skillItem.dataset.percentage;
        
        if (progressBar && percentage) {
            setTimeout(() => {
                progressBar.style.width = `${percentage}%`;
            }, 300);
        }
    }

    animateCounter(statItem) {
        const numberElement = statItem.querySelector('.stat-number');
        const target = parseInt(numberElement.dataset.count);
        const suffix = numberElement.dataset.suffix || '';
        
        let current = 0;
        const increment = target / 30;
        const duration = 1500;
        const stepTime = duration / 30;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            numberElement.textContent = Math.floor(current) + suffix;
        }, stepTime);
    }

    // Modern theme system
    setupThemeSystem() {
        // Detect system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        // Set initial theme
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        }
        
        // Create theme toggle
        this.createThemeToggle();
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        });
    }

    createThemeToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
    }

    toggleTheme() {
        // Add transition for smooth theme change
        document.documentElement.style.setProperty('--theme-transition', 'all 0.3s ease');
        setTimeout(() => {
            document.documentElement.style.setProperty('--theme-transition', 'none');
        }, 300);
    }

    // UI enhancements
    setupUIEnhancements() {
        this.createScrollToTop();
        this.setupHoverEffects();
        this.addEnhancedStyles();
        this.fixMobileLayouts();
    }

    createScrollToTop() {
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.innerHTML = '↑';
        button.setAttribute('aria-label', 'Scroll to top');
        
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(button);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });
    }

    setupHoverEffects() {
        // Add hover effects to project cards (desktop only)
        if (window.innerWidth > 768) {
            document.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('mousemove', (e) => this.handleCardHover(e, card));
                card.addEventListener('mouseleave', () => this.handleCardLeave(card));
            });
        }
    }

    handleCardHover(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = (x - centerX) / 25;
        const rotateX = (centerY - y) / 25;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    handleCardLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }

    // Fix mobile layouts
    fixMobileLayouts() {
        // Ensure hero text stays in one line on mobile
        this.fixHeroText();
        
        // Fix experience section layout for mobile
        this.fixExperienceLayout();
        
        // Handle touch events for mobile
        this.setupTouchEvents();
    }

    fixHeroText() {
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle && window.innerWidth <= 768) {
            // Ensure the name stays together
            heroTitle.innerHTML = heroTitle.innerHTML.replace('Irtiqa Sami', '<span class="name-keep-together">Irtiqa Sami</span>');
        }
    }

    fixExperienceLayout() {
        if (window.innerWidth <= 768) {
            // Add mobile-specific classes to experience cards
            document.querySelectorAll('.experience-card').forEach(card => {
                card.classList.add('mobile-experience-card');
            });
            
            // Fix timeline layout
            const timeline = document.querySelector('.experience-timeline');
            if (timeline) {
                timeline.classList.add('mobile-timeline');
            }
        }
    }

    setupTouchEvents() {
        // Add touch-friendly interactions
        document.querySelectorAll('.project-card, .skill-item, .experience-card').forEach(item => {
            item.addEventListener('touchstart', () => {
                item.classList.add('touch-active');
            });
            
            item.addEventListener('touchend', () => {
                setTimeout(() => {
                    item.classList.remove('touch-active');
                }, 150);
            });
        });
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${this.getNotificationIcon(type)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">×</button>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '⚠',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || 'ℹ';
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Initialize all animations
    initializeAnimations() {
        // Add animation classes to elements
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('animate-on-scroll');
            section.dataset.animation = 'fadeUp';
        });
        
        document.querySelectorAll('.project-card, .skill-item, .experience-card').forEach(el => {
            el.classList.add('animate-on-scroll');
            el.dataset.animation = 'fadeUp';
        });
        
        // Start intersection observer
        this.setupIntersectionObserver();
        
        // Initialize mobile-specific fixes
        this.fixMobileLayouts();
    }

    // Add all necessary CSS styles
    addEnhancedStyles() {
        const styles = `
            /* Mobile-specific fixes */
            .name-keep-together {
                display: inline-block;
                white-space: nowrap;
            }

            /* Mobile experience card fixes */
            .mobile-experience-card {
                margin-bottom: 2rem;
            }

            .mobile-timeline::before {
                left: 25px !important;
            }

            /* Touch interactions */
            .touch-active {
                transform: scale(0.98);
                transition: transform 0.1s ease;
            }

            /* Ensure mobile navigation works */
            .nav-links.active {
                right: 0 !important;
            }

            .nav-overlay.active {
                opacity: 1 !important;
                visibility: visible !important;
            }

            .mobile-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px) !important;
            }

            .mobile-toggle.active span:nth-child(2) {
                opacity: 0 !important;
                transform: translateX(-10px) !important;
            }

            .mobile-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(6px, -6px) !important;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Initialize the portfolio animations
new PortfolioAnimations();

// Export for global access if needed
window.Portfolio = new PortfolioAnimations();