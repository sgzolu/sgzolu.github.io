// Contact Form Functionality
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.isSubmitting = false;
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.bindEvents();
        this.setupValidation();
        this.initCharacterCounter();
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Enhanced interactions
        this.setupFieldInteractions();
    }

    setupFieldInteractions() {
        // Focus animations
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            if (input) {
                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        group.classList.remove('focused');
                    }
                });
                
                // Check if already has value on load
                if (input.value) {
                    group.classList.add('focused');
                }
            }
        });
    }

    setupValidation() {
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[A-Za-z\s'-]+$/,
                message: 'Please enter a valid first name'
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s-']+$/,
                message: 'Please enter a valid last name'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            subject: {
                required: true,
                message: 'Please select a subject'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Message must be between 10 and 1000 characters'
            }
        };
    }

    initCharacterCounter() {
        const messageField = document.getElementById('message');
        const charCount = document.getElementById('charCount');
        
        if (messageField && charCount) {
            messageField.addEventListener('input', () => {
                const count = messageField.value.length;
                charCount.textContent = count;
                
                // Update color based on character count
                if (count > 900) {
                    charCount.style.color = '#e74c3c';
                } else if (count > 800) {
                    charCount.style.color = '#f39c12';
                } else {
                    charCount.style.color = '#888';
                }
            });
        }
    }

    validateField(field) {
        const fieldName = field.name;
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;

        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Pattern validation
        else if (value && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message;
        }
        
        // Length validation
        else if (value && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `Minimum ${rules.minLength} characters required`;
        }
        
        else if (value && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = `Maximum ${rules.maxLength} characters allowed`;
        }

        // Update field appearance
        this.updateFieldValidation(field, isValid, errorMessage);
        
        return isValid;
    }

    updateFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        
        // Remove existing validation classes
        formGroup.classList.remove('field-valid', 'field-error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.field-error-message');
        if (existingError) {
            existingError.remove();
        }

        if (field.value.trim()) {
            if (isValid) {
                formGroup.classList.add('field-valid');
                field.style.borderColor = '#27ae60';
            } else {
                formGroup.classList.add('field-error');
                field.style.borderColor = '#e74c3c';
                
                // Add error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error-message';
                errorDiv.textContent = errorMessage;
                formGroup.appendChild(errorDiv);
            }
        } else {
            field.style.borderColor = '#e9ecef';
        }
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('field-error');
        
        const errorMessage = formGroup.querySelector('.field-error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
        
        if (!field.value.trim()) {
            field.style.borderColor = '#e9ecef';
            formGroup.classList.remove('field-valid');
        }
    }

    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit() {
        if (this.isSubmitting) return;

        // Validate form
        if (!this.validateForm()) {
            this.showMessage('Please correct the errors above', 'error');
            return;
        }

        this.isSubmitting = true;
        this.setSubmitButtonState(true);

        try {
            // Collect form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());
            
            // Add timestamp and additional info
            data.timestamp = new Date().toISOString();
            data.userAgent = navigator.userAgent;
            data.referrer = document.referrer;

            // Simulate form submission (replace with actual endpoint)
            const result = await this.submitForm(data);
            
            if (result.success) {
                this.handleSubmitSuccess(data);
            } else {
                throw new Error(result.message || 'Submission failed');
            }

        } catch (error) {
            this.handleSubmitError(error);
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonState(false);
        }
    }

    async submitForm(data) {
        // Only send the fields your API expects
        const payload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            affiliation: data.affiliation || '',
            subject: data.subject,
            message: data.message,
            website: data.website || '' // honeypot
        };

        const res = await fetch('https://api.YOUR_DOMAIN/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const json = await res.json().catch(() => ({}));
        return { success: res.ok && json.ok, message: json.error || json.message };
    }

    handleSubmitSuccess(data) {
        // Show success message
        this.showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
        
        // Reset form
        this.form.reset();
        
        // Clear validation states
        this.form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('field-valid', 'field-error', 'focused');
            const errorMsg = group.querySelector('.field-error-message');
            if (errorMsg) errorMsg.remove();
        });
        
        // Reset field borders
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.style.borderColor = '#e9ecef';
        });
        
        // Reset character counter
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = '#888';
        }

        // Track successful submission
        this.trackFormSubmission(data);
        
        // Optional: Show celebration animation
        this.showCelebrationAnimation();
    }

    handleSubmitError(error) {
        console.error('Form submission error:', error);
        this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    }

    setSubmitButtonState(isLoading) {
        const submitBtn = this.form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            submitBtn.style.opacity = '0.7';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.style.opacity = '1';
        }
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('formMessage');
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    trackFormSubmission(data) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                form_name: 'contact_form',
                subject: data.subject
            });
        }

        // Save to localStorage for analytics
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push({
            timestamp: data.timestamp,
            subject: data.subject,
            hasNewsletter: data.newsletter === 'on'
        });
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    }

    showCelebrationAnimation() {
        // Create confetti-like animation
        const celebration = document.createElement('div');
        celebration.className = 'celebration-animation';
        celebration.innerHTML = '🎉';
        
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            z-index: 10000;
            pointer-events: none;
            animation: celebrate 2s ease-out forwards;
        `;
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 2000);
    }
}

// Contact page enhancements
class ContactPageEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactItemAnimations();
        this.setupInfoCardInteractions();
        this.setupResponseTimeDisplay();
    }

    setupContactItemAnimations() {
        const contactItems = document.querySelectorAll('.contact-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        contactItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.5s ease';
            observer.observe(item);
        });
    }

    setupInfoCardInteractions() {
        const infoCards = document.querySelectorAll('.info-card');
        
        infoCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupResponseTimeDisplay() {
        // Display current time in user's timezone
        const responseCard = document.querySelector('.response-card');
        if (responseCard) {
            const timeDisplay = document.createElement('div');
            timeDisplay.className = 'current-time-display';
            timeDisplay.style.cssText = `
                margin-top: 15px;
                font-size: 14px;
                color: #666;
                font-style: italic;
            `;
            
            const updateTime = () => {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-GB', {
                    timeZone: 'Europe/London',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                const isBusinessHours = now.getUTCHours() >= 9 && now.getUTCHours() < 17;
                const status = isBusinessHours ? '🟢 Online' : '🟡 Offline';
                
                timeDisplay.innerHTML = `Current time in St Andrews: ${timeString} GMT ${status}`;
            };
            
            updateTime();
            setInterval(updateTime, 60000); // Update every minute
            
            responseCard.appendChild(timeDisplay);
        }
    }
}

// Utility functions for contact form
const ContactUtils = {
    // Format phone numbers
    formatPhoneNumber: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{4})(\d{6})$/);
        if (match) {
            return `+${match[1]} (0)${match[2]} ${match[3]}`;
        }
        return phone;
    },

    // Validate email domain
    validateEmailDomain: (email) => {
        const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        const domain = email.split('@')[1]?.toLowerCase();
        return domain && (commonDomains.includes(domain) || domain.includes('.edu') || domain.includes('.ac.'));
    },

    // Get user's timezone
    getUserTimezone: () => {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
};

// Initialize contact functionality
document.addEventListener('DOMContentLoaded', () => {
    window.contactForm = new ContactFormManager();
    window.contactEnhancer = new ContactPageEnhancer();
});

// Add CSS for contact form enhancements
const addContactStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        /* Form Field States */
        .form-group.focused label {
            color: #000;
            transform: translateY(-2px);
            transition: all 0.2s ease;
        }

        .form-group.field-valid input,
        .form-group.field-valid select,
        .form-group.field-valid textarea {
            border-color: #27ae60 !important;
            box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
        }

        .form-group.field-error input,
        .form-group.field-error select,
        .form-group.field-error textarea {
            border-color: #e74c3c !important;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        }

        .field-error-message {
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .field-error-message::before {
            content: '⚠️';
            font-size: 10px;
        }

        /* Submit Button Loading */
        .submit-btn {
            transition: all 0.3s ease;
        }

        .submit-btn:disabled {
            cursor: not-allowed;
        }

        /* Celebration Animation */
        @keyframes celebrate {
            0% {
                transform: translate(-50%, -50%) scale(0) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(0) rotate(360deg);
                opacity: 0;
            }
        }

        /* Enhanced Interactions */
        .contact-item {
            transition: all 0.3s ease;
        }

        .info-card {
            transition: all 0.3s ease;
        }

        /* Character Counter Animation */
        .character-count {
            transition: color 0.3s ease;
        }

        /* Form Focus Effects */
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            transform: translateY(-1px);
        }

        /* Success Message Animation */
        .form-message.success {
            animation: successPulse 0.5s ease;
        }

        @keyframes successPulse {
            0% { transform: scale(0.95); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }

        /* Current Time Display */
        .current-time-display {
            animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* Mobile Enhancements */
        @media (max-width: 768px) {
            .celebration-animation {
                font-size: 2rem !important;
            }
        }
    `;
    
    document.head.appendChild(style);
};

// Add styles when script loads
addContactStyles();