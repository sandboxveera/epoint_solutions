// ===== ePointSolutions - Website JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCountUp();
    initSmoothScroll();
    initActiveNavHighlight();
    initQuoteModal();
});

// ===== Navbar Scroll Effect =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        menu.classList.toggle('open');
        document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('open');
            menu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) {
            toggle.classList.remove('open');
            menu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// ===== Scroll Animations (Intersection Observer) =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for elements in the same parent
                const siblings = entry.target.parentElement.querySelectorAll('.animate-in');
                let delay = 0;
                siblings.forEach((sibling, i) => {
                    if (sibling === entry.target) {
                        delay = i * 100;
                    }
                });

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ===== Count-Up Animation =====
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    animateCounter(counter, target);
                });
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Active Nav Highlight =====
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

// ===== Quote Modal =====
let currentStep = 1;

// Service name to radio value mapping
const serviceMap = {
    'Website & Software Development': 'Website & Software Development',
    'Computer Sales & Service': 'Computer Sales & Service',
    'Printer & Xerox Machine': 'Printer & Xerox Machine',
    'Networking Solutions': 'Networking Solutions'
};

let preselectedService = null;

// Opens the quote modal (called from service card buttons)
function openQuoteModal(serviceName) {
    const overlay = document.getElementById('quoteOverlay');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Reset to step 1
    goToStep(1);

    // Pre-select the service if provided
    preselectedService = null;
    if (serviceName && serviceMap[serviceName]) {
        preselectedService = serviceName;
        const radios = document.querySelectorAll('input[name="quoteService"]');
        radios.forEach(radio => {
            if (radio.value === serviceMap[serviceName]) {
                radio.checked = true;
            }
        });

        // Show banner & hide service grid
        document.getElementById('preselectedBanner').style.display = 'flex';
        document.getElementById('preselectedName').textContent = serviceName;
        document.getElementById('serviceSelectGroup').style.display = 'none';
    } else {
        // No pre-selection — show grid, hide banner
        document.getElementById('preselectedBanner').style.display = 'none';
        document.getElementById('serviceSelectGroup').style.display = 'block';
    }
}

function closeQuoteModal() {
    const overlay = document.getElementById('quoteOverlay');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function initQuoteModal() {
    const overlay = document.getElementById('quoteOverlay');
    const closeBtn = document.getElementById('quoteClose');

    // Close button
    closeBtn.addEventListener('click', closeQuoteModal);

    // Close on overlay click (outside modal)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeQuoteModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            closeQuoteModal();
        }
    });

    // Step navigation
    document.getElementById('btnStep1Next').addEventListener('click', () => {
        if (validateStep1()) {
            goToStep(2);
        }
    });

    // "Change" button on pre-selected service banner
    document.getElementById('preselectedChange').addEventListener('click', () => {
        document.getElementById('preselectedBanner').style.display = 'none';
        document.getElementById('serviceSelectGroup').style.display = 'block';
        preselectedService = null;
    });

    document.getElementById('btnStep2Back').addEventListener('click', () => {
        goToStep(1);
    });

    document.getElementById('btnStep2Next').addEventListener('click', () => {
        if (validateStep2()) {
            populateReview();
            goToStep(3);
        }
    });

    document.getElementById('btnStep3Back').addEventListener('click', () => {
        goToStep(2);
    });

    // Send buttons
    document.getElementById('btnSendWhatsApp').addEventListener('click', sendViaWhatsApp);
    document.getElementById('btnSendEmail').addEventListener('click', sendViaEmail);

    // Clear error on input
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorEl = input.parentElement.querySelector('.form-error');
            if (errorEl) errorEl.classList.remove('show');
        });
    });
}

function goToStep(step) {
    currentStep = step;

    // Update steps visibility
    document.querySelectorAll('.quote-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`quoteStep${step}`).classList.add('active');

    // Update progress indicators
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach(ps => {
        const psStep = parseInt(ps.getAttribute('data-step'));
        ps.classList.remove('active', 'completed');
        if (psStep === step) {
            ps.classList.add('active');
        } else if (psStep < step) {
            ps.classList.add('completed');
        }
    });

    // Update progress lines
    const line1 = document.getElementById('progressLine1');
    const line2 = document.getElementById('progressLine2');
    line1.style.width = step >= 2 ? '100%' : '0%';
    line2.style.width = step >= 3 ? '100%' : '0%';

    // Scroll modal to top
    document.getElementById('quoteModal').scrollTop = 0;
}

function validateStep1() {
    let isValid = true;
    const name = document.getElementById('quoteName');
    const phone = document.getElementById('quotePhone');

    // Validate name
    if (!name.value.trim()) {
        showFieldError(name, 'Please enter your name');
        isValid = false;
    }

    // Validate phone
    if (!phone.value.trim()) {
        showFieldError(phone, 'Please enter your phone number');
        isValid = false;
    } else if (!/^[\d\s\-\+\(\)]{7,15}$/.test(phone.value.trim())) {
        showFieldError(phone, 'Please enter a valid phone number');
        isValid = false;
    }

    return isValid;
}

function validateStep2() {
    let isValid = true;
    const service = document.querySelector('input[name="quoteService"]:checked');
    const details = document.getElementById('quoteDetails');

    // Validate service selection
    if (!service) {
        // Highlight the service grid
        document.querySelector('.service-select-grid').style.outline = '2px solid #ef4444';
        document.querySelector('.service-select-grid').style.outlineOffset = '4px';
        document.querySelector('.service-select-grid').style.borderRadius = '16px';
        setTimeout(() => {
            document.querySelector('.service-select-grid').style.outline = 'none';
        }, 3000);
        isValid = false;
    }

    // Validate requirements
    if (!details.value.trim()) {
        showFieldError(details, 'Please describe your requirements');
        isValid = false;
    }

    return isValid;
}

function showFieldError(inputEl, message) {
    inputEl.classList.add('error');

    // Create or show error message
    let errorEl = inputEl.parentElement.querySelector('.form-error');
    if (!errorEl) {
        errorEl = document.createElement('p');
        errorEl.className = 'form-error show';
        errorEl.textContent = message;
        inputEl.parentElement.appendChild(errorEl);
    } else {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }

    // Shake animation
    inputEl.style.animation = 'none';
    inputEl.offsetHeight; // trigger reflow
    inputEl.style.animation = '';

    // Focus the field
    inputEl.focus();
}

function populateReview() {
    const name = document.getElementById('quoteName').value.trim();
    const phone = document.getElementById('quotePhone').value.trim();
    const email = document.getElementById('quoteEmail').value.trim();
    const service = document.querySelector('input[name="quoteService"]:checked');
    const budget = document.getElementById('quoteBudget').value;
    const details = document.getElementById('quoteDetails').value.trim();

    document.getElementById('reviewName').textContent = name;
    document.getElementById('reviewPhone').textContent = phone;
    document.getElementById('reviewEmail').textContent = email || 'Not provided';
    document.getElementById('reviewService').textContent = service ? service.value : '—';
    document.getElementById('reviewBudget').textContent = budget || 'Not specified';
    document.getElementById('reviewDetails').textContent = details;
}

function getFormData() {
    return {
        name: document.getElementById('quoteName').value.trim(),
        phone: document.getElementById('quotePhone').value.trim(),
        email: document.getElementById('quoteEmail').value.trim(),
        service: document.querySelector('input[name="quoteService"]:checked')?.value || '',
        budget: document.getElementById('quoteBudget').value || 'Not specified',
        details: document.getElementById('quoteDetails').value.trim()
    };
}

function sendViaWhatsApp() {
    const data = getFormData();

    const message = `Hi ePointSolutions! 👋

I'd like to get a quote for your services.

*📋 My Details:*
• Name: ${data.name}
• Phone: ${data.phone}
• Email: ${data.email || 'Not provided'}

*🛠️ Service Required:*
${data.service}

*💰 Budget:*
${data.budget}

*📝 Requirements:*
${data.details}

Looking forward to hearing from you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919080133317?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    closeQuoteModal();
    resetForm();
}

function sendViaEmail() {
    const data = getFormData();

    const subject = `Quote Request: ${data.service} - ${data.name}`;
    const body = `Hi ePointSolutions,

I'd like to get a quote for your services.

My Details:
- Name: ${data.name}
- Phone: ${data.phone}
- Email: ${data.email || 'Not provided'}

Service Required: ${data.service}

Budget: ${data.budget}

Requirements:
${data.details}

Looking forward to hearing from you!

Best regards,
${data.name}`;

    // Open Gmail compose directly in browser
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=epointsolutions001@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, '_blank');

    // Delay closing so the browser has time to open the new tab
    setTimeout(() => {
        closeQuoteModal();
        resetForm();
    }, 500);
}

function resetForm() {
    document.getElementById('quoteName').value = '';
    document.getElementById('quotePhone').value = '';
    document.getElementById('quoteEmail').value = '';
    document.getElementById('quoteBudget').value = '';
    document.getElementById('quoteDetails').value = '';
    
    const radios = document.querySelectorAll('input[name="quoteService"]');
    radios.forEach(radio => radio.checked = false);

    // Reset error states
    document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.form-error').forEach(el => el.remove());

    // Reset to step 1
    goToStep(1);
}

// Make openQuoteModal available globally (called from onclick in HTML)
window.openQuoteModal = openQuoteModal;
