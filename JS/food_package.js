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

    // Add modal to body if it doesn't exist
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
        case 'Payment.html':
            return 2;
        case 'Confirm.html':
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

// Package selection afterwards redirect to payment
const packageButtons = document.querySelectorAll('.select-btn');

packageButtons.forEach(button => {
    button.addEventListener('click', function () {
        const selectedPackage = this.getAttribute('data-package');
        const selectedPrice = this.getAttribute('data-price');

        // Get existing reservation data from Reserve_Now.html
        const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};

        // Add package info to reservation data
        reservationData.foodPackage = selectedPackage;
        reservationData.packagePrice = selectedPrice || 'Varies';

        // Save updated reservation data back to localStorage
        localStorage.setItem('reservationData', JSON.stringify(reservationData));

        console.log('Package saved to reservationData:', reservationData); 

        // Update stepper before redirect
        updateStepper(2);

        // Redirect to payment page
        window.location.href = 'Payment.html';
    });
});

//Cancel button function
function confirmCancel() {
    localStorage.removeItem('reservationData');
    window.location.href = 'index.html';
}