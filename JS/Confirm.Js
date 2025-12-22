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
        completeAllSteps();
        document.getElementById('confirmationEmail').textContent = data.email;
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    } else {
        alert('Error: No reservation data found. Please start over.');
        window.location.href = 'Reserve_Now.html';
    }
});

// Automated function for food package
const packagePrices = {
    "Classic Kamayan": 2500,
    "Deluxe Fiesta": 4500,
    "Premium Celebration": 6800
};

const editPackageInput = document.getElementById('editPackage');
const autoPrice = document.getElementById('autoPrice');
const selectedPackageEl = document.getElementById('selectedPackage');
const packagePriceEl = document.getElementById('packagePrice');


function normalizePackageName(name) {
    return name
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

editPackageInput.addEventListener('input', function () {
    const normalized = normalizePackageName(this.value);

    if (packagePrices[normalized] !== undefined) {
        autoPrice.textContent = packagePrices[normalized];
    } else {
        autoPrice.textContent = '0';
    }
});

function editFoodPackage() {
    const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};

    editPackageInput.value = reservationData.foodPackage || '';
    autoPrice.textContent = reservationData.packagePrice || '0';

    document.getElementById('foodPackageView').style.display = 'none';
    document.getElementById('foodPackageEdit').style.display = 'block';
}

function saveFoodPackage() {
    const selectedPackage = normalizePackageName(editPackageInput.value);

    if (!packagePrices[selectedPackage]) {
        alert("Please enter a valid package name!");
        return;
    }

    const price = packagePrices[selectedPackage];
    const reservationData = {
        ...(JSON.parse(localStorage.getItem('reservationData')) || {}),
        foodPackage: selectedPackage,
        packagePrice: price
    };

    localStorage.setItem('reservationData', JSON.stringify(reservationData));
    selectedPackageEl.textContent = selectedPackage;
    packagePriceEl.textContent = `₱ ${price.toLocaleString()}`;

    document.getElementById('foodPackageView').style.display = 'block';
    document.getElementById('foodPackageEdit').style.display = 'none';
}

// Cancel button
function cancelEditFoodPackage() {
    const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};

    selectedPackageEl.textContent = reservationData.foodPackage || "-";
    packagePriceEl.textContent = reservationData.packagePrice
        ? `₱ ${reservationData.packagePrice.toLocaleString()}`
        : "-";

    document.getElementById('foodPackageView').style.display = 'block';
    document.getElementById('foodPackageEdit').style.display = 'none';
}

// On page load 
document.addEventListener('DOMContentLoaded', () => {
    const reservationData = JSON.parse(localStorage.getItem('reservationData'));

    if (reservationData) {
        selectedPackageEl.textContent = reservationData.foodPackage || "-";
        packagePriceEl.textContent = reservationData.packagePrice
            ? `₱ ${reservationData.packagePrice.toLocaleString()}`
            : "-";
    }
});

// Edit function For pencil icons

// Customer Information Edit Functions
function editCustomerInfo() {
    const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};

    // Populate edit fields
    document.getElementById('editName').value = reservationData.fullName || '';
    document.getElementById('editEmail').value = reservationData.email || '';
    document.getElementById('editPhone').value = reservationData.phoneNumber || '';
    document.getElementById('editGuests').value = reservationData.numGuests || '';
    document.getElementById('editOccasion').value = reservationData.specialOccasion || '';
    document.getElementById('editRequests').value = reservationData.specialRequests || '';

    // Toggle view/edit
    document.getElementById('customerInfoView').style.display = 'none';
    document.getElementById('customerInfoEdit').style.display = 'block';
}

function saveCustomerInfo() {
    const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};

    // Get edited values
    reservationData.fullName = document.getElementById('editName').value;
    reservationData.email = document.getElementById('editEmail').value;
    reservationData.phoneNumber = document.getElementById('editPhone').value;
    reservationData.numGuests = document.getElementById('editGuests').value;
    reservationData.specialOccasion = document.getElementById('editOccasion').value;
    reservationData.specialRequests = document.getElementById('editRequests').value;

    // Save to localStorage
    localStorage.setItem('reservationData', JSON.stringify(reservationData));

    // Update display
    document.getElementById('summaryName').textContent = reservationData.fullName;
    document.getElementById('summaryEmail').textContent = reservationData.email;
    document.getElementById('summaryPhone').textContent = reservationData.phoneNumber;
    document.getElementById('summaryGuests').textContent = reservationData.numGuests;
    document.getElementById('summaryOccasion').textContent = reservationData.specialOccasion || '-';
    document.getElementById('summaryRequests').textContent = reservationData.specialRequests || '-';

    // Toggle back to view
    document.getElementById('customerInfoView').style.display = 'block';
    document.getElementById('customerInfoEdit').style.display = 'none';
}

function cancelEditCustomerInfo() {
    // Just toggle back without saving
    document.getElementById('customerInfoView').style.display = 'block';
    document.getElementById('customerInfoEdit').style.display = 'none';
}

// Reservation Details Edit Functions
function editReservationDetails() {
    const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};

    document.getElementById('editDate').value = reservationData.date || '';
    document.getElementById('editTimeStart').value = reservationData.timeStart || '';
    document.getElementById('editTimeEnd').value = reservationData.timeEnd || '';

    document.getElementById('reservationDetailsView').style.display = 'none';
    document.getElementById('reservationDetailsEdit').style.display = 'block';
}

function saveReservationDetails() {
    const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};

    reservationData.date = document.getElementById('editDate').value;
    reservationData.timeStart = document.getElementById('editTimeStart').value;
    reservationData.timeEnd = document.getElementById('editTimeEnd').value;

    localStorage.setItem('reservationData', JSON.stringify(reservationData));

    // Update both displays
    const timeDisplay = `${reservationData.timeStart} → ${reservationData.timeEnd}`;
    document.getElementById('detailsDate').textContent = reservationData.date;
    document.getElementById('detailsTime').textContent = timeDisplay;
    document.getElementById('summaryDate').textContent = reservationData.date;
    document.getElementById('summaryTime').textContent = timeDisplay;

    document.getElementById('reservationDetailsView').style.display = 'block';
    document.getElementById('reservationDetailsEdit').style.display = 'none';
}

function cancelEditReservationDetails() {
    document.getElementById('reservationDetailsView').style.display = 'block';
    document.getElementById('reservationDetailsEdit').style.display = 'none';
}

// Food Package Edit Functions
function editFoodPackage() {
    const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};

    document.getElementById('editPackage').value = reservationData.foodPackage || '';

    document.getElementById('foodPackageView').style.display = 'none';
    document.getElementById('foodPackageEdit').style.display = 'block';
}

function saveFoodPackage() {
    const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};
    const selectedPackage = document.getElementById('editPackage').value;

    // Extract price from package string 
    let price = '';
    if (selectedPackage.includes('Basic')) price = '500';
    else if (selectedPackage.includes('Premium')) price = '800';
    else if (selectedPackage.includes('Deluxe')) price = '1200';

    reservationData.foodPackage = selectedPackage.split(' - ')[0];
    reservationData.packagePrice = price;

    localStorage.setItem('reservationData', JSON.stringify(reservationData));

    document.getElementById('selectedPackage').textContent = reservationData.foodPackage;
    document.getElementById('packagePrice').textContent = reservationData.packagePrice ? `₱ ${reservationData.packagePrice}` : '-';

    document.getElementById('foodPackageView').style.display = 'block';
    document.getElementById('foodPackageEdit').style.display = 'none';
}

function cancelEditFoodPackage() {
    document.getElementById('foodPackageView').style.display = 'block';
    document.getElementById('foodPackageEdit').style.display = 'none';
}