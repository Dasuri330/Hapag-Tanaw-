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

// Function to complete all stepper steps with checkmark
function completeAllSteps() {
    steps.forEach((step, index) => {
        step.classList.add('completed');
        step.classList.remove('active');

        // Replace the number with a checkmark for the last step
        if (index === steps.length - 1) {
            const stepCircle = step.querySelector('.step-circle');
            stepCircle.innerHTML = '<i class="bi bi-check"></i>';
        }
    });

    // Make all lines active/completed
    stepLines.forEach(line => {
        line.classList.add('active');
    });
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

        // Save selected package info
        localStorage.setItem('selectedPackage', selectedPackage);
        localStorage.setItem('selectedPrice', selectedPrice);


        updateStepper(2);

        // Redirect to payment page
        window.location.href = 'Payment.html';
    });
});


// Confirm Page function

function confirmCancel() {
    localStorage.removeItem("reservationData");
    window.location.href = "index.html";
}

function goToHome() {
    localStorage.removeItem("reservationData");
    window.location.href = "index.html";
}
function confirmCancel() {
    localStorage.removeItem("reservationData");
    window.location.href = "index.html";
}

function goToHome() {
    localStorage.removeItem("reservationData");
    window.location.href = "index.html";
}
// Retrieve stored data from Reserve_Now.html and populate summary
const data = JSON.parse(localStorage.getItem('reservationData'));
if (data) {
    document.getElementById("summaryName").textContent = data.fullName;
    document.getElementById("summaryEmail").textContent = data.email;
    document.getElementById("summaryPhone").textContent = data.phoneNumber;
    document.getElementById("summaryDate").textContent = data.date;
    document.getElementById("summaryTime").textContent = `${data.timeStart} → ${data.timeEnd}`;
    document.getElementById("summaryGuests").textContent = data.numGuests;
    document.getElementById("summaryOccasion").textContent = data.specialOccasion || "-";
    document.getElementById("summaryRequests").textContent = data.specialRequests || "-";

    document.getElementById("detailsDate").textContent = data.date;
    document.getElementById("detailsTime").textContent = `${data.timeStart} → ${data.timeEnd}`;
    document.getElementById("selectedPackage").textContent = data.foodPackage || "-";
    document.getElementById("packagePrice").textContent = data.packagePrice ? `₱ ${data.packagePrice}` : "-";
    document.getElementById("paymentMethod").textContent = data.paymentMethod || "-";
    document.getElementById("referenceNumber").textContent = data.referenceNumber || "-";
}

// Confirm Reservation Button Handler
document.getElementById('confirmReservationBtn').addEventListener('click', function () {
    const data = JSON.parse(localStorage.getItem('reservationData'));
    if (data && data.email) {
        // Set the email in the success modal
        document.getElementById('confirmationEmail').textContent = data.email;

        // Show the success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    } else {
        alert('Error: No reservation data found. Please start over.');
        window.location.href = 'Reserve_Now.html';
    }
});
