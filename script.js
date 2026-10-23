/**
 * ==============================================================================
 * Google Developer Groups (GDG) Event - Client Logic & Form Controller
 * ==============================================================================
 */

// ==============================================================================
// 1. [CONFIGURABLE]: Event Details & Configuration
// Non-experts can modify the target date and event parameters here:
// ==============================================================================
const EVENT_CONFIG = {
  // Target Event Date (Format: YYYY-MM-DDTHH:MM:SS)
  targetDate: new Date('2026-11-14T09:30:00+05:30'),
  
  // Calendar Details
  title: 'GDG DevFest 2026: Building with AI & Cloud',
  location: 'Tech Innovation Auditorium, Campus One (or Online Livestream)',
  description: 'Join Google Developer Groups for DevFest 2026! Talks, workshops, and networking on AI, Cloud, Web, and Mobile.',
  startDateISO: '20261114T040000Z', // 9:30 AM IST in UTC
  endDateISO: '20261114T120000Z',   // 5:30 PM IST in UTC

  // Backend Integration Endpoint (Optional)
  // To send form submissions to Google Sheets, Formspree, or your API, paste the URL below:
  // e.g.: 'https://formspree.io/f/YOUR_FORM_ID' or 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
  backendEndpointUrl: ''
};

// ==============================================================================
// 2. DOM Elements Selection
// ==============================================================================
const siteHeader = document.getElementById('siteHeader');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const addToCalBtn = document.getElementById('addToCalBtn');

// Countdown Elements
const cdDays = document.getElementById('cdDays');
const cdHours = document.getElementById('cdHours');
const cdMins = document.getElementById('cdMins');
const cdSecs = document.getElementById('cdSecs');

// Form & Modal Elements
const regForm = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalDoneBtn = document.getElementById('modalDoneBtn');

// Modal Pass Fields
const passName = document.getElementById('passName');
const passEmail = document.getElementById('passEmail');
const passOrg = document.getElementById('passOrg');
const passTrack = document.getElementById('passTrack');
const passId = document.getElementById('passId');

// ==============================================================================
// 3. Countdown Timer Logic
// ==============================================================================
function initCountdown() {
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = EVENT_CONFIG.targetDate.getTime() - now;

    if (distance <= 0) {
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMins) cdMins.textContent = '00';
      if (cdSecs) cdSecs.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMins) cdMins.textContent = String(minutes).padStart(2, '0');
    if (cdSecs) cdSecs.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ==============================================================================
// 4. Form Validation & Helper Functions
// ==============================================================================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateField(fieldId, errorId, validatorFn) {
  const inputEl = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  if (!inputEl || !errorEl) return true;

  const isValid = validatorFn(inputEl);
  if (!isValid) {
    inputEl.classList.add('is-invalid');
    inputEl.setAttribute('aria-invalid', 'true');
    errorEl.classList.add('visible');
  } else {
    inputEl.classList.remove('is-invalid');
    inputEl.removeAttribute('aria-invalid');
    errorEl.classList.remove('visible');
  }
  return isValid;
}

function attachLiveValidation() {
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const orgInput = document.getElementById('organization');
  const roleSelect = document.getElementById('role');
  const termsCheckbox = document.getElementById('agreeTerms');

  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      validateField('fullName', 'nameError', el => el.value.trim().length >= 2);
    });
    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('is-invalid')) {
        validateField('fullName', 'nameError', el => el.value.trim().length >= 2);
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      validateField('email', 'emailError', el => EMAIL_REGEX.test(el.value.trim()));
    });
    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('is-invalid')) {
        validateField('email', 'emailError', el => EMAIL_REGEX.test(el.value.trim()));
      }
    });
  }

  if (orgInput) {
    orgInput.addEventListener('blur', () => {
      validateField('organization', 'orgError', el => el.value.trim().length >= 2);
    });
    orgInput.addEventListener('input', () => {
      if (orgInput.classList.contains('is-invalid')) {
        validateField('organization', 'orgError', el => el.value.trim().length >= 2);
      }
    });
  }

  if (roleSelect) {
    roleSelect.addEventListener('change', () => {
      validateField('role', 'roleError', el => el.value !== '');
    });
  }

  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
      validateField('agreeTerms', 'termsError', el => el.checked);
    });
  }
}

// ==============================================================================
// 5. Form Submission Handler
// ==============================================================================
function initFormHandler() {
  if (!regForm) return;

  regForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Run complete validation check
    const isNameValid = validateField('fullName', 'nameError', el => el.value.trim().length >= 2);
    const isEmailValid = validateField('email', 'emailError', el => EMAIL_REGEX.test(el.value.trim()));
    const isOrgValid = validateField('organization', 'orgError', el => el.value.trim().length >= 2);
    const isRoleValid = validateField('role', 'roleError', el => el.value !== '');
    const isTermsValid = validateField('agreeTerms', 'termsError', el => el.checked);

    const isFormValid = isNameValid && isEmailValid && isOrgValid && isRoleValid && isTermsValid;

    if (!isFormValid) {
      // Smooth scroll to the first invalid field
      const firstInvalidField = regForm.querySelector('.is-invalid');
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidField.focus();
      }
      return;
    }

    // Capture Form Data
    const formData = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      organization: document.getElementById('organization').value.trim(),
      role: document.getElementById('role').value,
      experience: document.getElementById('experience').value,
      track: document.getElementById('track').value,
      attendanceMode: document.getElementById('attendanceMode').value,
      accommodations: document.getElementById('accommodations').value.trim() || 'None',
      submittedAt: new Date().toISOString()
    };

    // UI Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      // ========================================================================
      // BACKEND CONNECTION:
      // If a backend endpoint is provided, post the JSON data:
      // ========================================================================
      if (EVENT_CONFIG.backendEndpointUrl && EVENT_CONFIG.backendEndpointUrl.trim() !== '') {
        await fetch(EVENT_CONFIG.backendEndpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      } else {
        // Simulated network latency for local/static operation
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Generate a realistic GDG attendee pass ID
      const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
      const generatedPassId = `GDG-${new Date().getFullYear()}-${randomTicketNum}`;

      // Populate Digital Ticket Pass
      if (passName) passName.textContent = formData.fullName;
      if (passEmail) passEmail.textContent = formData.email;
      if (passOrg) passOrg.textContent = formData.organization;
      if (passTrack) passTrack.textContent = formData.track;
      if (passId) passId.textContent = generatedPassId;

      // Show Confirmation Modal
      openModal();

      // Reset form fields
      regForm.reset();

    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an issue processing your registration. Please try again.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

// ==============================================================================
// 6. Modal Controls & Keyboard Accessibility
// ==============================================================================
function openModal() {
  if (!successModal) return;
  successModal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
  if (modalDoneBtn) modalDoneBtn.focus();
}

function closeModal() {
  if (!successModal) return;
  successModal.classList.remove('active');
  document.body.style.overflow = '';
}

function initModalEvents() {
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);

  // Close when clicking on backdrop
  if (successModal) {
    successModal.addEventListener('click', function (e) {
      if (e.target === successModal) {
        closeModal();
      }
    });
  }

  // Close on Escape key press
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && successModal && successModal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ==============================================================================
// 7. Add to Google Calendar Helper
// ==============================================================================
function initCalendarButton() {
  if (!addToCalBtn) return;

  addToCalBtn.addEventListener('click', function () {
    const googleCalUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalUrl.searchParams.set('action', 'TEMPLATE');
    googleCalUrl.searchParams.set('text', EVENT_CONFIG.title);
    googleCalUrl.searchParams.set('dates', `${EVENT_CONFIG.startDateISO}/${EVENT_CONFIG.endDateISO}`);
    googleCalUrl.searchParams.set('details', EVENT_CONFIG.description);
    googleCalUrl.searchParams.set('location', EVENT_CONFIG.location);

    window.open(googleCalUrl.toString(), '_blank', 'noopener,noreferrer');
  });
}

// ==============================================================================
// 8. Mobile Navigation & Scroll Header
// ==============================================================================
function initNavigation() {
  // Mobile menu toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function () {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('mobile-open');
    });

    // Close menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header scroll shadow effect
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });
}

// ==============================================================================
// 9. Application Initialization
// ==============================================================================
document.addEventListener('DOMContentLoaded', function () {
  initCountdown();
  attachLiveValidation();
  initFormHandler();
  initModalEvents();
  initCalendarButton();
  initNavigation();
});
