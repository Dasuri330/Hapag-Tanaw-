// Get all step elements
const steps = document.querySelectorAll('.step');
const stepLines = document.querySelectorAll('.step-line');
let currentStep = 0;

// Function to create validation modal if not already in DOM
function createValidationModal() {
    if (!document.getElementById('validationModal')) {
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
                        <p class="mb-0">Please fill in all required fields before proceeding.</p>
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
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

// Stepper update function
function updateStepper(stepIndex) {
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

    stepLines.forEach((line, index) => {
        if (index < stepIndex) line.classList.add('active');
        else line.classList.remove('active');
    });
}

// Determine current page step
function getCurrentPageStep() {
    const page = window.location.pathname.split('/').pop();
    switch (page) {
        case 'Reserve_Now.html': return 0;
        case 'food_package.html': return 1;
        case 'payment.html': return 2;
        case 'confirm.html': return 3;
        default: return 0;
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    // Stepper
    currentStep = getCurrentPageStep();
    updateStepper(currentStep);

    // Create validation modal
    createValidationModal();

    // Set minimum date
    const dateInput = document.getElementById("dateInput");
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Time picker elements
    const hourStart = document.getElementById('hourSelectStart');
    const minuteStart = document.getElementById('minuteSelectStart');
    const hourEnd = document.getElementById('hourSelectEnd');
    const minuteEnd = document.getElementById('minuteSelectEnd');
    const amBtnStart = document.getElementById('amBtnStart');
    const pmBtnStart = document.getElementById('pmBtnStart');
    const amBtnEnd = document.getElementById('amBtnEnd');
    const pmBtnEnd = document.getElementById('pmBtnEnd');
    const displayTimeRange = document.getElementById('displayTimeRange');
    const timeValueStart = document.getElementById('timeValueStart');
    const timeValueEnd = document.getElementById('timeValueEnd');

    let selectedPeriodStart = 'AM';
    let selectedPeriodEnd = 'PM';

    function updateDisplay() {
        let start = hourStart.value && minuteStart.value ? `${hourStart.value}:${minuteStart.value} ${selectedPeriodStart}` : '-- : -- --';
        let end = hourEnd.value && minuteEnd.value ? `${hourEnd.value}:${minuteEnd.value} ${selectedPeriodEnd}` : '-- : -- --';
        displayTimeRange.innerHTML = `${start} <span class="time-range-arrow">→</span> ${end}`;

        // Validate
        if (hourStart.value && minuteStart.value && hourEnd.value && minuteEnd.value) {
            const result = validateTimeRange(hourStart.value, minuteStart.value, selectedPeriodStart, hourEnd.value, minuteEnd.value, selectedPeriodEnd);
            if (!result.valid) {
                displayTimeRange.style.borderColor = '#dc3545';
                showTimeValidationModal(result.message);
                if (result.clearEnd) { hourEnd.value = ''; minuteEnd.value = ''; }
                timeValueStart.value = '';
                timeValueEnd.value = '';
            } else {
                displayTimeRange.style.borderColor = '#D27D2D';
                timeValueStart.value = result.start24;
                timeValueEnd.value = result.end24;
            }
        }
    }

    function validateTimeRange(hStart, mStart, periodStart, hEnd, mEnd, periodEnd) {
        let hs = parseInt(hStart), he = parseInt(hEnd);
        if (periodStart === 'PM' && hs !== 12) hs += 12;
        if (periodStart === 'AM' && hs === 12) hs = 0;
        if (periodEnd === 'PM' && he !== 12) he += 12;
        if (periodEnd === 'AM' && he === 12) he = 0;
        const startMin = hs * 60 + parseInt(mStart);
        const endMin = he * 60 + parseInt(mEnd);
        const minTime = 10 * 60, maxTime = 21 * 60;
        if (startMin < minTime || startMin > maxTime) return { valid: false, message: 'Start time must be between 10:00 AM and 9:00 PM', clearEnd: false };
        if (endMin < minTime || endMin > maxTime) return { valid: false, message: 'End time must be between 10:00 AM and 9:00 PM', clearEnd: true };
        if (endMin <= startMin) return { valid: false, message: 'End time must be after start time', clearEnd: true };
        return { valid: true, start24: `${String(hs).padStart(2, '0')}:${mStart}`, end24: `${String(he).padStart(2, '0')}:${mEnd}` };
    }

    function showTimeValidationModal(message) {
        const modalHTML = `
        <div class="modal fade" id="timeValidationModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title"><i class="bi bi-clock-fill me-2"></i>Invalid Time Range</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body"><p>${message}</p></div>
                    <div class="modal-footer"><button type="button" class="btn btn-custom" data-bs-dismiss="modal">Okay</button></div>
                </div>
            </div>
        </div>`;
        const existing = document.getElementById('timeValidationModal');
        if (existing) existing.remove();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        new bootstrap.Modal(document.getElementById('timeValidationModal')).show();
    }

    // Period buttons
    if (amBtnStart) amBtnStart.addEventListener('click', () => { selectedPeriodStart = 'AM'; amBtnStart.classList.add('active'); pmBtnStart.classList.remove('active'); updateDisplay(); });
    if (pmBtnStart) pmBtnStart.addEventListener('click', () => { selectedPeriodStart = 'PM'; pmBtnStart.classList.add('active'); amBtnStart.classList.remove('active'); updateDisplay(); });
    if (amBtnEnd) amBtnEnd.addEventListener('click', () => { selectedPeriodEnd = 'AM'; amBtnEnd.classList.add('active'); pmBtnEnd.classList.remove('active'); updateDisplay(); });
    if (pmBtnEnd) pmBtnEnd.addEventListener('click', () => { selectedPeriodEnd = 'PM'; pmBtnEnd.classList.add('active'); amBtnEnd.classList.remove('active'); updateDisplay(); });

    if (hourStart) hourStart.addEventListener('change', updateDisplay);
    if (minuteStart) minuteStart.addEventListener('change', updateDisplay);
    if (hourEnd) hourEnd.addEventListener('change', updateDisplay);
    if (minuteEnd) minuteEnd.addEventListener('change', updateDisplay);

    // Next button 
    const nextButton = document.getElementById('nextBtn');
    if (nextButton) {
        nextButton.addEventListener('click', function (e) {
            e.preventDefault();
            const form = document.querySelector("form");
            let isValid = true;

            // Validate required inputs
            const requiredInputs = form.querySelectorAll("input[required], select[required]");
            requiredInputs.forEach(input => {
                if (!input.value) {
                    isValid = false;
                    input.classList.add("is-invalid");
                } else {
                    input.classList.remove("is-invalid");
                }
            });

            // Validate time fields
            if (!timeValueStart.value || !timeValueEnd.value) {
                isValid = false;
                displayTimeRange.style.borderColor = '#dc3545';
            }

            if (!isValid) {
                new bootstrap.Modal(document.getElementById('validationModal')).show();
                return;
            }

            // Save data to localStorage
            const formData = {
                fullName: document.getElementById("fullName").value,
                email: document.getElementById("email").value,
                phoneNumber: document.getElementById("phoneNumber").value,
                date: document.getElementById("dateInput").value,
                timeStart: timeValueStart.value,
                timeEnd: timeValueEnd.value,
                numGuests: document.getElementById("numGuests").value,
                specialOccasion: document.getElementById("specialOccasion").value || "",
                specialRequests: document.getElementById("specialRequests").value || ""
            };

            localStorage.setItem("reservationData", JSON.stringify(formData));
            console.log("Reservation data saved:", formData);

            // Navigate to next page
            window.location.href = "food_package.html";
        });
    }

    // Cancel modal
    const cancelModalEl = document.getElementById('cancelModal');
    let cancelModal = cancelModalEl ? new bootstrap.Modal(cancelModalEl) : null;

    window.showCancelModal = function (e) {
        e.preventDefault();
        if (cancelModal) cancelModal.show();
    }

    window.confirmCancel = function () {
        localStorage.removeItem("reservationData");
        window.location.href = 'index.html';
    }
});