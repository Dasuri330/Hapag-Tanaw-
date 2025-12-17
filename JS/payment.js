// Stepper function
const steps = document.querySelectorAll('.step');
let currentStep = 0;

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

    const stepLines = document.querySelectorAll('.step-line');
    stepLines.forEach((line, index) => {
        if (index < stepIndex) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
}

function getCurrentPageStep() {
    const currentPage = window.location.pathname.split('/').pop();

    switch (currentPage) {
        case 'Reserve_Now.html': return 0;
        case 'food_package.html': return 1;
        case 'Payment.html': return 2;
        case 'Gcash.html': return 2;
        case 'Maya.html': return 2;
        case 'Confirm.html': return 3;
        default: return 0;
    }
}

currentStep = getCurrentPageStep();
updateStepper(currentStep);


//Payment method buttons

// Credit/Debit Card
const creditCardBtn = document.getElementById('creditCardBtn');
if (creditCardBtn) {
    creditCardBtn.addEventListener('click', () => {
        const creditCardModal = new bootstrap.Modal(document.getElementById('creditCardModal'));
        creditCardModal.show();
    });
}

// GCash
const gcashBtn = document.getElementById('gcashBtn');
if (gcashBtn) {
    gcashBtn.addEventListener('click', () => {
        const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};
        reservationData.paymentMethod = 'GCash';
        localStorage.setItem('reservationData', JSON.stringify(reservationData));
        window.location.href = 'Gcash.html';
    });
}

// Maya
const mayaBtn = document.getElementById('mayaBtn');
if (mayaBtn) {
    mayaBtn.addEventListener('click', () => {
        const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};
        reservationData.paymentMethod = 'Maya';
        localStorage.setItem('reservationData', JSON.stringify(reservationData));
        window.location.href = 'Maya.html';
    });
}

// Bank Transfer - show modal
document.addEventListener('DOMContentLoaded', () => {
    const banktransferBtn = document.getElementById('banktransferbtn');
    const banktransfermodalEl = document.getElementById('banktransfermodal');

    if (banktransferBtn && banktransfermodalEl) {
        // Initialize the modal once
        const banktransfermodal = new bootstrap.Modal(banktransfermodalEl, {
            backdrop: 'static',
            keyboard: true
        });

        // Show modal on button click
        banktransferBtn.addEventListener('click', (e) => {
            e.preventDefault();
            banktransfermodal.show();
        });

        // Handle OK button click to close modal safely
        const okBtn = banktransfermodalEl.querySelector('.btn-primary');
        if (okBtn) {
            okBtn.addEventListener('click', (e) => {
                e.preventDefault();
                banktransfermodal.hide();
            });
        }
    }
});

// Save GCash reference number
const confirmGcashBtn = document.getElementById('confirmGcashBtn');
if (confirmGcashBtn) {
    confirmGcashBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const referenceNumber = document.getElementById('gcashReferenceNumber').value;
        if (!referenceNumber) {
            alert('Please enter reference number');
            return;
        }

        const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};
        reservationData.referenceNumber = referenceNumber;
        localStorage.setItem('reservationData', JSON.stringify(reservationData));

        window.location.href = 'Confirm.html';
    });
}

// Save Maya reference number
const confirmMayaBtn = document.getElementById('confirmMayaBtn');
if (confirmMayaBtn) {
    confirmMayaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const referenceNumber = document.getElementById('mayaReferenceNumber').value;
        if (!referenceNumber) {
            alert('Please enter reference number');
            return;
        }

        const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};
        reservationData.referenceNumber = referenceNumber;
        localStorage.setItem('reservationData', JSON.stringify(reservationData));

        window.location.href = 'Confirm.html';
    });
}

// Save Bank Transfer payment
const confirmBankBtn = document.getElementById('confirmBankBtn');
if (confirmBankBtn) {
    confirmBankBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Optional: get bank account/reference input if any
        const bankAccountNumberEl = document.getElementById('bankAccountNumber');
        const bankAccountNumber = bankAccountNumberEl ? bankAccountNumberEl.value : '';

        if (bankAccountNumberEl && !bankAccountNumber) {
            alert('Please enter your bank account/reference number');
            return;
        }

        const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};
        reservationData.paymentMethod = 'Bank Transfer';
        if (bankAccountNumber) reservationData.bankAccountNumber = bankAccountNumber;
        localStorage.setItem('reservationData', JSON.stringify(reservationData));

        // Close modal
        const banktransfermodalEl = document.getElementById('banktransfermodal');
        const banktransfermodal = bootstrap.Modal.getInstance(banktransfermodalEl);
        banktransfermodal.hide();

        // Move to confirmation page
        updateStepper(3);
        window.location.href = 'Confirm.html';
    });
}

//Display data function
window.addEventListener('DOMContentLoaded', () => {
    const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};
    const displayRef = document.getElementById('displayReferenceNumber');
    if (reservationData.referenceNumber && displayRef) {
        displayRef.textContent = reservationData.referenceNumber;
    }
});

function savePaymentMethod(paymentMethod) {
    const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};
    reservationData.paymentMethod = paymentMethod;
    localStorage.setItem('reservationData', JSON.stringify(reservationData));

    console.log('Payment method saved:', reservationData);

    updateStepper(3);
    window.location.href = 'Confirm.html';
}

// Cancel
function confirmCancel() {
    localStorage.removeItem('reservationData');
    window.location.href = 'index.html';
}
