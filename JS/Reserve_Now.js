// Get all step elements
const steps = document.querySelectorAll('.step');
const stepLines = document.querySelectorAll('.step-line');
let currentStep = 0;

// function for dynamic modal
function createValidationModal() {
    const modalHTML = `
    <div class="modal fade" id="validationModal" tabindex="-1" aria-labelledby="validationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="validationModalLabel">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        Incomplete Information
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-0">Please fill in all required fields before proceeding to the next step.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-custom" data-bs-dismiss="modal">
                        <i class="bi bi-check-circle me-1"></i> Okay
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Add modal to body 
    if (!document.getElementById('validationModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

// Function to update stepper
function updateStepper(stepIndex) {
    // Remove active class from all steps
    steps.forEach((step, index) => {
        if (index < stepIndex) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index === stepIndex) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });

    // Update step lines
    stepLines.forEach((line, index) => {
        if (index < stepIndex) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
}

// Handle page navigation based on current page
function getCurrentPageStep() {
    const currentPage = window.location.pathname.split('/').pop();

    switch (currentPage) {
        case 'Reserve_Now.html':
            return 0;
        case 'food_package.html':
            return 1;
        case 'payment.html':
            return 2;
        case 'confirm.html':
            return 3;
        default:
            return 0;
    }
}

// Initialize stepper based on current page
currentStep = getCurrentPageStep();
updateStepper(currentStep);

// Create the validation modal
createValidationModal();

// Set minimum date to today for date input
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Custom Time Range Picker Logic
const hourSelectStart = document.getElementById('hourSelectStart');
const minuteSelectStart = document.getElementById('minuteSelectStart');
const hourSelectEnd = document.getElementById('hourSelectEnd');
const minuteSelectEnd = document.getElementById('minuteSelectEnd');
const amBtnStart = document.getElementById('amBtnStart');
const pmBtnStart = document.getElementById('pmBtnStart');
const amBtnEnd = document.getElementById('amBtnEnd');
const pmBtnEnd = document.getElementById('pmBtnEnd');
const displayTimeRange = document.getElementById('displayTimeRange');
const timeValueStart = document.getElementById('timeValueStart');
const timeValueEnd = document.getElementById('timeValueEnd');

let selectedPeriodStart = 'AM';
let selectedPeriodEnd = 'PM';

// Update display
function updateDisplay() {
    const hourStart = hourSelectStart.value;
    const minuteStart = minuteSelectStart.value;
    const hourEnd = hourSelectEnd.value;
    const minuteEnd = minuteSelectEnd.value;

    let displayStart = '-- : -- --';
    let displayEnd = '-- : -- --';

    if (hourStart && minuteStart) {
        displayStart = `${hourStart}:${minuteStart} ${selectedPeriodStart}`;
    }

    if (hourEnd && minuteEnd) {
        displayEnd = `${hourEnd}:${minuteEnd} ${selectedPeriodEnd}`;
    }

    displayTimeRange.innerHTML = `${displayStart} <span class="time-range-arrow">→</span> ${displayEnd}`;

    // Validate both times
    if (hourStart && minuteStart && hourEnd && minuteEnd) {
        const validationResult = validateTimeRange(hourStart, minuteStart, selectedPeriodStart, hourEnd, minuteEnd, selectedPeriodEnd);

        if (!validationResult.valid) {
            document.getElementById('timeDisplay').style.borderColor = '#dc3545';
            showTimeValidationModal(validationResult.message);

            // Clear invalid selection
            if (validationResult.clearEnd) {
                hourSelectEnd.value = '';
                minuteSelectEnd.value = '';
            }
            timeValueStart.value = '';
            timeValueEnd.value = '';
        } else {
            document.getElementById('timeDisplay').style.borderColor = '#D27D2D';
            timeValueStart.value = validationResult.start24;
            timeValueEnd.value = validationResult.end24;
        }
    }
}

// Validate time range
function validateTimeRange(hourStart, minuteStart, periodStart, hourEnd, minuteEnd, periodEnd) {
    // Convert to 24-hour format
    let hourStart24 = parseInt(hourStart);
    if (periodStart === 'PM' && hourStart24 !== 12) {
        hourStart24 += 12;
    } else if (periodStart === 'AM' && hourStart24 === 12) {
        hourStart24 = 0;
    }

    let hourEnd24 = parseInt(hourEnd);
    if (periodEnd === 'PM' && hourEnd24 !== 12) {
        hourEnd24 += 12;
    } else if (periodEnd === 'AM' && hourEnd24 === 12) {
        hourEnd24 = 0;
    }

    const startInMinutes = hourStart24 * 60 + parseInt(minuteStart);
    const endInMinutes = hourEnd24 * 60 + parseInt(minuteEnd);
    const minTime = 10 * 60; // 10:00 AM
    const maxTime = 21 * 60; // 9:00 PM

    // Check if start time is within operating hours
    if (startInMinutes < minTime || startInMinutes > maxTime) {
        return {
            valid: false,
            message: 'Start time must be between <strong>10:00 AM</strong> and <strong>9:00 PM</strong>.',
            clearEnd: false
        };
    }

    // Check if end time is within operating hours
    if (endInMinutes < minTime || endInMinutes > maxTime) {
        return {
            valid: false,
            message: 'End time must be between <strong>10:00 AM</strong> and <strong>9:00 PM</strong>.',
            clearEnd: true
        };
    }

    // Check if end time is after start time
    if (endInMinutes <= startInMinutes) {
        return {
            valid: false,
            message: 'End time must be <strong>after</strong> start time.',
            clearEnd: true
        };
    }

    return {
        valid: true,
        start24: `${String(hourStart24).padStart(2, '0')}:${minuteStart}`,
        end24: `${String(hourEnd24).padStart(2, '0')}:${minuteEnd}`
    };
}

// Show time validation modal
function showTimeValidationModal(message) {
    const modalHTML = `
    <div class="modal fade" id="timeValidationModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-warning text-dark">
                    <h5 class="modal-title">
                        <i class="bi bi-clock-fill me-2"></i>
                        Invalid Time Range
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-0">${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-custom" data-bs-dismiss="modal">
                        <i class="bi bi-check-circle me-1"></i> Okay
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('timeValidationModal');
    if (existingModal) {
        existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('timeValidationModal'));
    modal.show();
}

// Period button handlers for START time
if (amBtnStart) {
    amBtnStart.addEventListener('click', function () {
        selectedPeriodStart = 'AM';
        amBtnStart.classList.add('active');
        pmBtnStart.classList.remove('active');
        updateDisplay();
    });
}

if (pmBtnStart) {
    pmBtnStart.addEventListener('click', function () {
        selectedPeriodStart = 'PM';
        pmBtnStart.classList.add('active');
        amBtnStart.classList.remove('active');
        updateDisplay();
    });
}

// Period button handlers for END time
if (amBtnEnd) {
    amBtnEnd.addEventListener('click', function () {
        selectedPeriodEnd = 'AM';
        amBtnEnd.classList.add('active');
        pmBtnEnd.classList.remove('active');
        updateDisplay();
    });
}

if (pmBtnEnd) {
    pmBtnEnd.addEventListener('click', function () {
        selectedPeriodEnd = 'PM';
        pmBtnEnd.classList.add('active');
        amBtnEnd.classList.remove('active');
        updateDisplay();
    });
}

// Update on select change
if (hourSelectStart) hourSelectStart.addEventListener('change', updateDisplay);
if (minuteSelectStart) minuteSelectStart.addEventListener('change', updateDisplay);
if (hourSelectEnd) hourSelectEnd.addEventListener('change', updateDisplay);
if (minuteSelectEnd) minuteSelectEnd.addEventListener('change', updateDisplay);


// Add form validation function before allowing next
const nextButton = document.querySelector('a[href="food_package.html"]');
if (nextButton) {
    nextButton.addEventListener('click', function (e) {
        const form = document.querySelector('form');
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });

        // Check if time range is filled (hidden inputs)
        if (timeValueStart && timeValueEnd) {
            if (!timeValueStart.value || !timeValueEnd.value) {
                isValid = false;
                if (displayTimeRange) {
                    document.getElementById('timeDisplay').style.borderColor = '#dc3545';
                }
            }
        }

        if (!isValid) {
            e.preventDefault();
            // Show Bootstrap modal instead of alert
            const validationModal = new bootstrap.Modal(document.getElementById('validationModal'));
            validationModal.show();
        }
    });
}