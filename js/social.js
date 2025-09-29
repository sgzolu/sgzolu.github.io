// Social Media Integration and Functionality
class SocialMediaManager {
    constructor() {
        this.socialLinks = {
            twitter: 'https://x.com/sg_zolu',
            linkedin: 'https://www.linkedin.com/in/george-sato99/',
            youtube: 'https://www.youtube.com/@cachalot-w',
            instagram: 'https://www.instagram.com/sg_zolu/'
        };
        
        this.init();
    }

    init() {
        this.bindSocialEvents();
        this.initSocialAnimations();
        this.setupSocialTracking();
    }

    bindSocialEvents() {
        // Handle social media button clicks
        document.querySelectorAll('.social-media-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialClick(button);
            });

            // Add enhanced hover effects
            button.addEventListener('mouseenter', () => {
                this.handleSocialHover(button, true);
            });

            button.addEventListener('mouseleave', () => {
                this.handleSocialHover(button, false);
            });
        });
    }

    handleSocialClick(button) {
        const platform = button.getAttribute('data-platform');
        const url = this.socialLinks[platform];

        if (url) {
            // Track the click (analytics)
            this.trackSocialClick(platform);
            
            // Open in new tab
            window.open(url, '_blank', 'noopener,noreferrer');
            
            // Add click animation
            this.addClickAnimation(button);
        } else {
            // Show coming soon message for unlinked platforms
            this.showToast(`${platform.charAt(0).toUpperCase() + platform.slice(1)} profile coming soon!`);
        }
    }

    handleSocialHover(button, isHovering) {
        const platform = button.getAttribute('data-platform');
        
        if (isHovering) {
            // Add platform-specific hover effects
            this.addPlatformHoverEffect(button, platform);
            
            // Show tooltip
            this.showTooltip(button, platform);
        } else {
            // Remove tooltip
            this.hideTooltip(button);
        }
    }

    addPlatformHoverEffect(button, platform) {
        // Enhanced hover animations based on platform
        const animations = {
            twitter: () => {
                button.style.transform = 'scale(1.15) rotate(5deg)';
                button.style.boxShadow = '0 8px 25px rgba(29, 161, 242, 0.4)';
            },
            linkedin: () => {
                button.style.transform = 'scale(1.15) rotate(-3deg)';
                button.style.boxShadow = '0 8px 25px rgba(10, 102, 194, 0.4)';
            },
            youtube: () => {
                button.style.transform = 'scale(1.15)';
                button.style.boxShadow = '0 8px 25px rgba(229, 45, 39, 0.4)';
            },
            instagram: () => {
                button.style.transform = 'scale(1.15) rotate(2deg)';
                button.style.boxShadow = '0 8px 25px rgba(225, 48, 108, 0.4)';
            }
        };

        if (animations[platform]) {
            animations[platform]();
        }
    }

    addClickAnimation(button) {
        // Add ripple effect on click
        const ripple = document.createElement('span');
        ripple.className = 'click-ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        
        button.appendChild(ripple);
        
        // Animate ripple
        setTimeout(() => {
            ripple.style.transform = 'translate(-50%, -50%) scale(1)';
            ripple.style.opacity = '0';
        }, 0);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    showTooltip(button, platform) {
        const tooltip = document.createElement('div');
        tooltip.className = 'social-tooltip';
        tooltip.textContent = this.getTooltipText(platform);
        
        document.body.appendChild(tooltip);
        
        const rect = button.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        // Store reference for cleanup
        button._tooltip = tooltip;
        
        // Animate in
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 0);
    }

    hideTooltip(button) {
        if (button._tooltip) {
            button._tooltip.classList.remove('show');
            setTimeout(() => {
                if (button._tooltip && button._tooltip.parentNode) {
                    button._tooltip.parentNode.removeChild(button._tooltip);
                }
                button._tooltip = null;
            }, 200);
        }
    }

    getTooltipText(platform) {
        const tooltips = {
            twitter: 'Follow on Twitter',
            linkedin: 'Connect on LinkedIn',
            youtube: 'Subscribe on YouTube',
            instagram: 'Follow on Instagram'
        };
        return tooltips[platform] || `Visit ${platform}`;
    }

    initSocialAnimations() {
        // Staggered animation for social buttons on page load
        const buttons = document.querySelectorAll('.social-media-button');
        buttons.forEach((button, index) => {
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                button.style.transition = 'all 0.4s ease';
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    }

    setupSocialTracking() {
        // Basic analytics tracking for social media interactions
        this.socialStats = {
            clicks: {},
            hovers: {},
            session: Date.now()
        };

        // Load existing stats from localStorage
        const saved = localStorage.getItem('socialStats');
        if (saved) {
            this.socialStats = { ...this.socialStats, ...JSON.parse(saved) };
        }
    }

    trackSocialClick(platform) {
        if (!this.socialStats.clicks[platform]) {
            this.socialStats.clicks[platform] = 0;
        }
        this.socialStats.clicks[platform]++;
        
        // Save to localStorage
        localStorage.setItem('socialStats', JSON.stringify(this.socialStats));
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_click', {
                platform: platform,
                page: window.location.pathname
            });
        }

        console.log(`Social click tracked: ${platform}`);
    }

    showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'social-toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 0);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    // Method to update social links
    updateSocialLinks(newLinks) {
        this.socialLinks = { ...this.socialLinks, ...newLinks };
    }

    // Method to get social stats
    getSocialStats() {
        return this.socialStats;
    }
}

// Social sharing functionality
class SocialSharing {
    constructor() {
        this.init();
    }

    init() {
        this.setupShareButtons();
    }

    setupShareButtons() {
        // Create share buttons for content (like research papers or blog posts)
        const shareableContent = document.querySelectorAll('[data-shareable]');
        
        shareableContent.forEach(content => {
            this.addShareButton(content);
        });
    }

    addShareButton(element) {
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-btn';
        shareBtn.innerHTML = '📤 Share';
        shareBtn.title = 'Share this content';
        
        shareBtn.addEventListener('click', () => {
            this.openShareModal(element);
        });
        
        element.appendChild(shareBtn);
    }

    openShareModal(element) {
        const title = element.getAttribute('data-title') || document.title;
        const url = element.getAttribute('data-url') || window.location.href;
        const text = element.getAttribute('data-text') || title;
        
        if (navigator.share) {
            // Use native sharing if available
            navigator.share({
                title: title,
                text: text,
                url: url
            }).catch(console.error);
        } else {
            // Custom share modal
            this.showShareModal(title, url, text);
        }
    }

    showShareModal(title, url, text) {
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <h3>Share this content</h3>
                <div class="share-options">
                    <button onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}', '_blank')" class="share-option twitter">
                        Twitter
                    </button>
                    <button onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}', '_blank')" class="share-option linkedin">
                        LinkedIn
                    </button>
                    <button onclick="navigator.clipboard.writeText('${url}')" class="share-option copy">
                        Copy Link
                    </button>
                </div>
                <button class="close-share">&times;</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.close-share').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Initialize social media functionality
document.addEventListener('DOMContentLoaded', () => {
    window.socialManager = new SocialMediaManager();
    window.socialSharing = new SocialSharing();
});

// Add CSS styles for social functionality
const addSocialStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        /* Click Ripple Effect */
        .click-ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            pointer-events: none;
            transition: all 0.6s ease;
        }

        /* Social Tooltip */
        .social-tooltip {
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateY(5px);
            transition: all 0.2s ease;
            pointer-events: none;
            white-space: nowrap;
        }

        .social-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: #333;
        }

        .social-tooltip.show {
            opacity: 1;
            transform: translateY(0);
        }

        /* Social Toast */
        .social-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        }

        .social-toast.show {
            opacity: 1;
            transform: translateX(0);
        }

        /* Share Button */
        .share-btn {
            background: #f8f9fa;
            border: 1px solid #ddd;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            margin-top: 10px;
            transition: all 0.2s ease;
        }

        .share-btn:hover {
            background: #e9ecef;
            border-color: #adb5bd;
        }

        /* Share Modal */
        .share-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .share-modal-content {
            background: white;
            padding: 30px;
            border-radius: 8px;
            position: relative;
            max-width: 400px;
            width: 90%;
        }

        .share-modal h3 {
            margin-bottom: 20px;
            text-align: center;
        }

        .share-options {
            display: flex;
            gap: 10px;
            justify-content: center;
        }

        .share-option {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .share-option.twitter {
            background: #1da1f2;
            color: white;
        }

        .share-option.linkedin {
            background: #0077b5;
            color: white;
        }

        .share-option.copy {
            background: #28a745;
            color: white;
        }

        .share-option:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .close-share {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }

        .close-share:hover {
            color: #333;
        }

        /* Enhanced Social Button Animations */
        .social-media-button {
            position: relative;
            overflow: hidden;
        }

        .social-media-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }

        .social-media-button:hover::before {
            left: 100%;
        }

        @media (max-width: 480px) {
            .social-tooltip {
                font-size: 11px;
                padding: 6px 10px;
            }
            
            .share-modal-content {
                padding: 20px;
            }
            
            .share-options {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(style);
};

// Add styles when script loads
addSocialStyles();