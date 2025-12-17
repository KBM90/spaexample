// ========================================
// ÉVASION SAÏDIA - DAY SPA WEBSITE
// JavaScript Functionality
// ========================================

// ========================================
// MOBILE MENU TOGGLE
// ========================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a nav link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ========================================
// SMOOTH SCROLLING & ACTIVE NAV LINKS
// ========================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        link.classList.add('active');

        // Smooth scroll to section
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ========================================
// SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}, observerOptions);

// Observe all fade-in elements
const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

// ========================================
// THEME TOGGLE (DARK/LIGHT MODE)
// ========================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-toggle-icon');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ========================================
// BOOKING FORM VALIDATION & SUBMISSION
// ========================================
const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');
const whatsappBtn = document.getElementById('whatsappBtn');

// Set minimum date to today
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Form validation
function validateForm() {
    let isValid = true;

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Validate Full Name
    const nameGroup = document.getElementById('fullName').parentElement;
    if (fullName === '' || fullName.length < 2) {
        nameGroup.classList.add('error');
        isValid = false;
    } else {
        nameGroup.classList.remove('error');
    }

    // Validate Phone Number (basic validation)
    const phoneGroup = document.getElementById('phone').parentElement;
    const phoneRegex = /^[0-9\s\-\+\(\)]{8,}$/;
    if (!phoneRegex.test(phone)) {
        phoneGroup.classList.add('error');
        isValid = false;
    } else {
        phoneGroup.classList.remove('error');
    }

    // Validate Service Selection
    const serviceGroup = document.getElementById('service').parentElement;
    if (service === '') {
        serviceGroup.classList.add('error');
        isValid = false;
    } else {
        serviceGroup.classList.remove('error');
    }

    // Validate Date
    const dateGroup = document.getElementById('date').parentElement;
    if (date === '') {
        dateGroup.classList.add('error');
        isValid = false;
    } else {
        dateGroup.classList.remove('error');
    }

    // Validate Time
    const timeGroup = document.getElementById('time').parentElement;
    if (time === '') {
        timeGroup.classList.add('error');
        isValid = false;
    } else {
        timeGroup.classList.remove('error');
    }

    return isValid;
}

// Form submission handler
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
        showMessage('Please fill in all required fields correctly.', 'error');
        return;
    }

    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        notes: document.getElementById('notes').value.trim(),
        timestamp: new Date().toISOString()
    };

    // Save to LocalStorage
    saveBooking(formData);

    // Show success message
    showMessage('Booking submitted successfully! We will contact you shortly to confirm your appointment.', 'success');

    // Reset form
    setTimeout(() => {
        bookingForm.reset();
        formMessage.classList.remove('show');
    }, 5000);
});

// Save booking to LocalStorage
function saveBooking(bookingData) {
    // Get existing bookings or initialize empty array
    let bookings = JSON.parse(localStorage.getItem('spaBookings')) || [];

    // Add new booking
    bookings.push(bookingData);

    // Save back to LocalStorage
    localStorage.setItem('spaBookings', JSON.stringify(bookings));

    console.log('Booking saved:', bookingData);
}

// WhatsApp booking handler
whatsappBtn.addEventListener('click', () => {
    if (!validateForm()) {
        showMessage('Please fill in all required fields correctly before booking via WhatsApp.', 'error');
        return;
    }

    // Get form data
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const notes = document.getElementById('notes').value.trim();

    // Format WhatsApp message
    let message = `🌸 *Évasion Saïdia - Booking Request*\n\n`;
    message += `👤 *Name:* ${fullName}\n`;
    message += `📞 *Phone:* ${phone}\n`;
    message += `✨ *Service:* ${service}\n`;
    message += `📅 *Date:* ${date}\n`;
    message += `🕐 *Time:* ${time}\n`;

    if (notes) {
        message += `📝 *Notes:* ${notes}\n`;
    }

    message += `\nThank you! Looking forward to my appointment. 🌿`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp number (remove spaces and dashes)
    const whatsappNumber = '212666531404';

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Save booking to LocalStorage
    const formData = {
        fullName,
        phone,
        service,
        date,
        time,
        notes,
        timestamp: new Date().toISOString(),
        method: 'WhatsApp'
    };
    saveBooking(formData);
});

// Show form message
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `message ${type} show`;

    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========================================
// EMAIL BOOKING (MAILTO FALLBACK)
// ========================================
function createEmailBooking() {
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const notes = document.getElementById('notes').value.trim();

    const subject = encodeURIComponent('Spa Booking Request - Évasion Saïdia');
    let body = `Name: ${fullName}\n`;
    body += `Phone: ${phone}\n`;
    body += `Service: ${service}\n`;
    body += `Date: ${date}\n`;
    body += `Time: ${time}\n`;

    if (notes) {
        body += `Notes: ${notes}\n`;
    }

    const encodedBody = encodeURIComponent(body);
    const mailtoLink = `mailto:info@evasionsaidia.com?subject=${subject}&body=${encodedBody}`;

    return mailtoLink;
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }

    lastScroll = currentScroll;
});

// ========================================
// UTILITY: GET ALL BOOKINGS FROM LOCALSTORAGE
// ========================================
function getAllBookings() {
    return JSON.parse(localStorage.getItem('spaBookings')) || [];
}

// ========================================
// UTILITY: CLEAR ALL BOOKINGS (FOR TESTING)
// ========================================
function clearAllBookings() {
    localStorage.removeItem('spaBookings');
    console.log('All bookings cleared');
}

// ========================================
// CONSOLE HELPER MESSAGES
// ========================================
console.log('%c🌸 Évasion Saïdia - Day Spa Website', 'color: #C8E6C9; font-size: 20px; font-weight: bold;');
console.log('%cUtility Functions Available:', 'color: #F8BBD0; font-size: 14px; font-weight: bold;');
console.log('- getAllBookings() - View all saved bookings');
console.log('- clearAllBookings() - Clear all bookings from storage');

// ========================================
// LANGUAGE SUPPORT (READY FOR EXTENSION)
// ========================================
// This structure is ready for multi-language support
// You can extend this with translation objects for French, Arabic, and English

const translations = {
    en: {
        hero_subtitle: 'Welcome to',
        hero_tagline: 'Relax. Renew. Rejuvenate.',
        book_now: 'Book Appointment',
        our_services: 'Our Services'
    },
    fr: {
        hero_subtitle: 'Bienvenue à',
        hero_tagline: 'Détendez-vous. Renouvelez-vous. Rajeunissez.',
        book_now: 'Réserver',
        our_services: 'Nos Services'
    },
    ar: {
        hero_subtitle: 'مرحبا بكم في',
        hero_tagline: 'استرخي. تجددي. انتعشي.',
        book_now: 'احجز الآن',
        our_services: 'خدماتنا'
    }
};

// Function to change language (ready for implementation)
function changeLanguage(lang) {
    // This function can be extended to change all text content
    // based on the selected language
    console.log(`Language changed to: ${lang}`);
    // Implementation would update all data-lang attributes
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Évasion Saïdia website loaded successfully');

    // Add any initialization code here
    // For example, loading saved preferences, etc.
});
