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
        case 'Gcash.html':
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
    // Select the button
    const nextBtn = document.getElementById('nextBtn');

    nextBtn.addEventListener('click', function (event) {
        // Get the input fields
        const email = document.getElementById('email').value.trim();

        // Check if any field is empty
        if (!name || !email) {
            event.preventDefault(); 
            alert('Please fill in all required fields!'); 
        }
    });
}