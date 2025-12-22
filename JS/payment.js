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

// Validate reference numbers
function isValidGcashRef(ref) {
    const refStr = String(ref).replace(/\D/g, '');
    return refStr.length === 13;
}

function isValidMayaRef(ref) {
    const refStr = String(ref).trim();
    const mayaPattern = /^[A-Za-z0-9]{12}$/; 
    return mayaPattern.test(refStr);
}


// Payment method buttons

/* Credit/Debit Card
const creditCardBtn = document.getElementById('creditCardBtn');
if (creditCardBtn) {
    creditCardBtn.addEventListener('click', () => {
        const creditCardModal = new bootstrap.Modal(document.getElementById('creditCardModal'));
        creditCardModal.show();
    });
}*/

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
// Maya reference auto all caps
const mayaInput = document.getElementById('mayaReferenceNumber');

if (mayaInput) {
    mayaInput.addEventListener('input', function () {
        this.value = this.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .slice(0, 12);
    });
}


/*Bank Transfer - show modal
document.addEventListener('DOMContentLoaded', () => {
    const banktransferBtn = document.getElementById('banktransferbtn');
    const banktransfermodalEl = document.getElementById('banktransfermodal');

    if (banktransferBtn && banktransfermodalEl) {
        const banktransfermodal = new bootstrap.Modal(banktransfermodalEl, {
            backdrop: 'static',
            keyboard: true
        });

        banktransferBtn.addEventListener('click', (e) => {
            e.preventDefault();
            banktransfermodal.show();
        });

        const okBtn = banktransfermodalEl.querySelector('.btn-primary');
        if (okBtn) {
            okBtn.addEventListener('click', (e) => {
                e.preventDefault();
                banktransfermodal.hide();
            });
        }
    }
});*/

// Restrict GCash reference number input to 13 digits only
const referenceNumberInput = document.getElementById('gcashReferenceNumber');

if (referenceNumberInput) {
    // Prevent input beyond 13 digits and allow only numbers
    referenceNumberInput.addEventListener('input', function (e) {
        // Remove any non-digit characters
        let value = e.target.value.replace(/\D/g, '');

        // Limit to 13 digits
        if (value.length > 13) {
            value = value.slice(0, 13);
        }

        e.target.value = value;
    });

    // Prevent paste of invalid content
    referenceNumberInput.addEventListener('paste', function (e) {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData('text');
        const digitsOnly = pastedData.replace(/\D/g, '').slice(0, 13);
        e.target.value = digitsOnly;
    });

    // Prevent non-numeric keys 
    referenceNumberInput.addEventListener('keypress', function (e) {
        // Allow backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)) {
            return;
        }

        // Ensure that it is a number and stop the keypress if not
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
            (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

// Save GCash reference number
const confirmGcashBtn = document.getElementById('confirmGcashBtn');
if (confirmGcashBtn) {
    confirmGcashBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const referenceNumber = referenceNumberInput.value;

        // Remove previous error message
        let errorEl = document.getElementById('gcashRefError');
        if (errorEl) errorEl.remove();

        if (!referenceNumber) {
            errorEl = document.createElement('div');
            errorEl.id = 'gcashRefError';
            errorEl.className = 'text-danger mt-1';
            errorEl.textContent = 'Please enter reference number';
            referenceNumberInput.insertAdjacentElement('afterend', errorEl);
            return;
        }

        if (!isValidGcashRef(referenceNumber)) {
            errorEl = document.createElement('div');
            errorEl.id = 'gcashRefError';
            errorEl.className = 'text-danger mt-1';
            errorEl.textContent = 'GCash reference number must be exactly 13 digits';
            referenceNumberInput.insertAdjacentElement('afterend', errorEl);
            return;
        }

        const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};
        reservationData.referenceNumber = referenceNumber;
        localStorage.setItem('reservationData', JSON.stringify(reservationData));

        window.location.href = 'Confirm.html';
    });
}

// Restrict Maya reference number input to 12 alphanumeric characters only
const mayaReferenceNumberInput = document.getElementById('mayaReferenceNumber');

if (mayaReferenceNumberInput) {
    // Prevent input beyond 12 characters and allow only alphanumeric
    mayaReferenceNumberInput.addEventListener('input', function (e) {
        // Remove any non-alphanumeric characters (keep letters and numbers only)
        let value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');

        // Limit to 12 characters
        if (value.length > 12) {
            value = value.slice(0, 12);
        }

        // Convert to uppercase (Maya reference numbers are typically uppercase)
        e.target.value = value.toUpperCase();
    });

    // Prevent paste of invalid content
    mayaReferenceNumberInput.addEventListener('paste', function (e) {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData('text');
        const alphanumericOnly = pastedData.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
        e.target.value = alphanumericOnly.toUpperCase();
    });

    // Prevent non-alphanumeric keys
    mayaReferenceNumberInput.addEventListener('keypress', function (e) {
        // Allow backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)) {
            return;
        }

        // Get the character code
        const charCode = e.which || e.keyCode;
        const char = String.fromCharCode(charCode);

        // Allow only alphanumeric characters 
        if (!/[a-zA-Z0-9]/.test(char)) {
            e.preventDefault();
        }
    });
}

// Save Maya reference number
const confirmMayaBtn = document.getElementById('confirmMayaBtn');
if (confirmMayaBtn) {
    confirmMayaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const referenceNumber = mayaReferenceNumberInput.value;

        // Remove previous error message
        let errorEl = document.getElementById('mayaRefError');
        if (errorEl) errorEl.remove();

        if (!referenceNumber) {
            errorEl = document.createElement('div');
            errorEl.id = 'mayaRefError';
            errorEl.className = 'text-danger mt-1';
            errorEl.textContent = 'Please enter reference number';
            mayaReferenceNumberInput.insertAdjacentElement('afterend', errorEl);
            return;
        }

        if (!isValidMayaRef(referenceNumber)) {
            errorEl = document.createElement('div');
            errorEl.id = 'mayaRefError';
            errorEl.className = 'text-danger mt-1';
            errorEl.textContent = 'Maya reference number must be exactly 12 alphanumeric characters';
            mayaReferenceNumberInput.insertAdjacentElement('afterend', errorEl);
            return;
        }

        const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};
        reservationData.referenceNumber = referenceNumber;
        localStorage.setItem('reservationData', JSON.stringify(reservationData));

        window.location.href = 'Confirm.html';

    });
}
/*Save Bank Transfer payment
const confirmBankBtn = document.getElementById('confirmBankBtn');
if (confirmBankBtn) {
    confirmBankBtn.addEventListener('click', function (e) {
        e.preventDefault();

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

        const banktransfermodalEl = document.getElementById('banktransfermodal');
        const banktransfermodal = bootstrap.Modal.getInstance(banktransfermodalEl);
        banktransfermodal.hide();

        updateStepper(3);
        window.location.href = 'Confirm.html';
    });
}*/

// Display data function
window.addEventListener('DOMContentLoaded', () => {
    const reservationData = JSON.parse(localStorage.getItem('reservationData')) || {};
    const displayRef = document.getElementById('displayReferenceNumber');
    if (reservationData.referenceNumber && displayRef) {
        displayRef.textContent = reservationData.referenceNumber;
    }
});

// Save payment method helper
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
