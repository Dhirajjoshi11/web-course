const filterButtons = document.querySelectorAll('[data-filter]');
for (const button of filterButtons) {
    button.addEventListener('click', () => {
        for (const other of filterButtons) {
            other.setAttribute(
                'aria-pressed',
                String(other === button)
            );
        }
        const filter = button.dataset.filter;
        const cards = document.querySelectorAll('.menu-grid li');
        for (const card of cards) {
            const category = card.dataset.category;

            card.hidden = !(filter === 'all' || category === filter);
        }
        const sections = document.querySelectorAll('.menu-section');

        for (const section of sections) {
            const visibleItems = section.querySelectorAll(
                '.menu-grid li:not([hidden])'
            );

            section.hidden = visibleItems.length === 0;
        }
        const visibleCards = document.querySelectorAll(
            '.menu-grid li:not([hidden])'
        );
        const menuStatus = document.querySelector('#menu-status');

        menuStatus.textContent =
            `Showing ${visibleCards.length} of ${cards.length} menu items.`;
    });
}
function showError(field, message) {
    document.querySelector(`#${field.id}-error`)
        .textContent = message;

    field.setAttribute('aria-invalid', 'true');
}

function clearError(field) {
    document.querySelector(`#${field.id}-error`)
        .textContent = '';

    field.removeAttribute('aria-invalid');
}
function messageFor(field) {
    const validity = field.validity;
    const label = field.labels[0].textContent;

    if (validity.valueMissing) {
        return `${label} is required.`;
    }

    if (validity.typeMismatch) {
        return `Please enter a valid ${label.toLowerCase()}.`;
    }

    return `Please check your ${label.toLowerCase()}.`;
}

const cakeRequestForm = document.querySelector('#cake-request-form');
if (cakeRequestForm) {
    cakeRequestForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formStatus = document.querySelector('#form-status');

        let firstInvalid = null;
        const fields = cakeRequestForm.querySelectorAll('[required]');

        for (const field of fields) {
            if (field.validity.valid) {
                clearError(field);
            } else {
                showError(field, messageFor(field));
                firstInvalid ??= field;
            }
        }
        if (firstInvalid) {
            formStatus.textContent = 'Please correct the errors in the form.';
            firstInvalid.focus();
            return;
        }

        formStatus.textContent = 'Request is ready.';
    });
    cakeRequestForm.addEventListener('input', (event) => {
        const field = event.target;

        if (
            field.getAttribute('aria-invalid') === 'true' &&
            field.validity.valid
        ) {
            clearError(field);
        }

        // Save the form draft in the browser
        const formData = Object.fromEntries(
            new FormData(cakeRequestForm)
        );

        localStorage.setItem(
            'cake-request-draft',
            JSON.stringify(formData)
        );
    });
    const savedDraft = localStorage.getItem('cake-request-draft');

    if (savedDraft) {
        const formData = JSON.parse(savedDraft);

        for (const [name, value] of Object.entries(formData)) {
            const field = cakeRequestForm.elements[name];

            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = value === 'on';
                } else {
                    field.value = value;
                }
            }
        }
    }
}
