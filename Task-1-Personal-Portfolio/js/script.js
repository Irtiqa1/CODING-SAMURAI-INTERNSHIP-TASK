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
                }
            });
        });
    }

    animateScrollTo(target) {
        const targetPosition = target.offsetTop - 80;
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
        
        // Add micro-interaction feedback
        this.createRippleEffect(clickedLink);
    }

    createRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.4);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            width: ${size}px;
            height: ${size}px;
            left: ${-size/2 + rect.width/2}px;
            top: ${-size/2 + rect.height/2}px;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode === element) {
                element.removeChild(ripple);
            }
        }, 600);
    }

    // Modern header effects with performance
    setupHeaderEffects() {
        let ticking = false;
        
        const updateHeader = () => {
            const header = document.querySelector('header');
            const scrollY = window.scrollY;
            
            if (scrollY > 50) {
                header.classList.add('scrolled');
                header.style.setProperty('--header-bg', 'rgba(255, 255, 255, 0.95)');
                header.style.setProperty('--header-blur', 'blur(20px)');
            } else {
                header.classList.remove('scrolled');
                header.style.setProperty('--header-bg', 'transparent');
                header.style.setProperty('--header-blur', 'blur(0px)');
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
        const scrollPosition = window.scrollY + 100;

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
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Add transition for smooth theme change
        document.documentElement.style.setProperty('--theme-transition', 'all 0.3s ease');
        setTimeout(() => {
            document.documentElement.style.setProperty('--theme-transition', 'none');
        }, 300);
    }

    // Modern mobile menu
    setupMobileMenu() {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = '<span></span><span></span><span></span>';
        toggle.setAttribute('aria-label', 'Toggle menu');
        
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(toggle);
            
            toggle.addEventListener('click', () => {
                document.body.classList.toggle('menu-open');
                toggle.classList.toggle('active');
            });
            
            // Close menu when clicking on links
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    document.body.classList.remove('menu-open');
                    toggle.classList.remove('active');
                });
            });
        }
    }

    // UI enhancements
    setupUIEnhancements() {
        this.createScrollToTop();
        this.setupHoverEffects();
        this.addEnhancedStyles();
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
        // Add hover effects to project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleCardHover(e, card));
            card.addEventListener('mouseleave', () => this.handleCardLeave(card));
        });
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
        
        
    }

    // Add all necessary CSS styles
    addEnhancedStyles() {
        const styles = `
            /* Modern CSS Variables */
            :root {
                --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                --error-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                --header-bg: transparent;
                --header-blur: blur(0px);
                --theme-transition: none;
            }

            .dark {
                --primary-bg: #0f172a;
                --text-primary: #e2e8f0;
            }

            /* Smooth transitions */
            * {
                transition: color var(--theme-transition), background-color var(--theme-transition);
            }

            /* Modern Animations */
            @keyframes fadeUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            /* Animation Classes */
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }

            .animate-on-scroll.animated {
                opacity: 1;
                transform: translateY(0);
            }

            .fadeUp.animated { animation: fadeUp 0.6s ease-out; }
            .slideInRight.animated { animation: slideInRight 0.6s ease-out; }

            /* Theme Toggle */
            .theme-toggle {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 3.5rem;
                height: 3.5rem;
                border-radius: 50%;
                background: var(--primary-gradient);
                border: none;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .theme-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 35px rgba(0,0,0,0.2);
            }

            .theme-icon {
                position: absolute;
                transition: all 0.3s ease;
                font-size: 1.2rem;
            }

            .dark .theme-icon.sun { opacity: 0; transform: rotate(90deg); }
            .dark .theme-icon.moon { opacity: 1; transform: rotate(0); }
            .theme-icon.sun { opacity: 1; transform: rotate(0); }
            .theme-icon.moon { opacity: 0; transform: rotate(-90deg); }

            /* Scroll to Top */
            .scroll-to-top {
                position: fixed;
                bottom: 2rem;
                left: 2rem;
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                background: var(--success-gradient);
                border: none;
                color: white;
                cursor: pointer;
                box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                z-index: 1000;
                opacity: 0;
                transform: translateY(100px);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-size: 1.2rem;
                font-weight: bold;
            }

            .scroll-to-top.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .scroll-to-top:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }

            /* Mobile Menu */
            .mobile-menu-toggle {
                display: none;
                flex-direction: column;
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
                z-index: 1001;
            }

            .mobile-menu-toggle span {
                width: 25px;
                height: 2px;
                background: currentColor;
                margin: 3px 0;
                transition: all 0.3s ease;
                transform-origin: center;
            }

            .mobile-menu-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }

            .mobile-menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }

            .mobile-menu-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(6px, -6px);
            }

            /* Header Effects */
            header {
                background: var(--header-bg);
                backdrop-filter: var(--header-blur);
                transition: all 0.3s ease;
            }

            /* Notifications */
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: white;
                color: #333;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                z-index: 10000;
                max-width: 400px;
                border-left: 4px solid #667eea;
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification.success { border-left-color: #10b981; }
            .notification.error { border-left-color: #ef4444; }
            .notification.warning { border-left-color: #f59e0b; }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex: 1;
            }

            .notification-icon {
                font-size: 1.2rem;
                font-weight: bold;
            }

            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 2rem;
                height: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            }

            .notification-close:hover {
                background: rgba(0,0,0,0.1);
            }

            /* Form Enhancements */
            .form-group {
                position: relative;
                margin-bottom: 1.5rem;
            }

            .form-group.success input,
            .form-group.success textarea {
                border-color: #10b981;
                box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
            }

            .form-group.error input,
            .form-group.error textarea {
                border-color: #ef4444;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }

            .error-message {
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                position: absolute;
                bottom: -1.25rem;
                left: 0;
            }

            .btn-loader {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .loader-spinner {
                width: 1.25rem;
                height: 1.25rem;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Project Card Hover Effects */
            .project-card {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .project-card:hover {
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            }

            /* Skill Progress Animation */
            .skill-progress {
                transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: flex;
                }

                .theme-toggle,
                .scroll-to-top {
                    bottom: 1rem;
                    width: 3rem;
                    height: 3rem;
                }

                .theme-toggle { right: 1rem; }
                .scroll-to-top { left: 1rem; }

                .notification {
                    right: 1rem;
                    left: 1rem;
                    max-width: none;
                }
            }

            /* Performance Optimizations */
            .will-change {
                will-change: transform, opacity;
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
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