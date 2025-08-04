document.addEventListener('DOMContentLoaded', () => {
  const emailForm = document.getElementById('emailForm');
  const modal = document.getElementById('confirmationModal');
  const confirmBtn = document.getElementById('confirmBtn');
  const editBtn = document.getElementById('editBtn');
  const resetBtn = document.getElementById('resetBtn');
  const modalEmail = document.getElementById('modalEmail');
  const modalFirstName = document.getElementById('modalFirstName');
  const modalLastName = document.getElementById('modalLastName');

  let currentFormData = {};

  if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const firstNameInput = this.elements['firstName'];
      const lastNameInput = this.elements['lastName'];
      const emailInput = this.elements['email'];

      currentFormData = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
      };

      // Populate modal
      modalEmail.textContent = currentFormData.email;
      modalFirstName.textContent = currentFormData.firstName;
      modalLastName.textContent = currentFormData.lastName;

      // Show modal
      modal.style.display = 'block';
    });
  }

  if (modal) {
    confirmBtn.addEventListener('click', () => {
      // Save data to localStorage
      let entries = [];
      try {
        entries = JSON.parse(localStorage.getItem('entries')) || [];
      } catch (error) {
        console.error('Error parsing localStorage entries:', error);
        entries = [];
      }
      entries.push(currentFormData);
      localStorage.setItem('entries', JSON.stringify(entries));

      // Clear the form
      emailForm.reset();
      // Hide modal
      modal.style.display = 'none';
      // Refocus the email field (assuming email is the first field typically)
      if (emailForm.elements['email']) {
        emailForm.elements['email'].focus();
      }
      currentFormData = {}; // Clear stored form data
    });

    editBtn.addEventListener('click', () => {
      // Just hide the modal, form retains its values
      modal.style.display = 'none';
      // Optionally, focus the first field that had data or the first field in general
      if (emailForm.elements['email']) {
         emailForm.elements['email'].focus();
      }
    });

    resetBtn.addEventListener('click', () => {
      // Clear the form
      emailForm.reset();
      // Refocus the email field
      if (emailForm.elements['email']) {
        emailForm.elements['email'].focus();
      }
      currentFormData = {}; // Clear stored form data
    });

    // Close modal if user clicks outside of the modal content (optional)
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
        // Decide if form should be reset or retain data.
        // For now, let's assume "Edit" behavior (retain data)
        if (emailForm.elements['email']) {
           emailForm.elements['email'].focus();
        }
      }
    });
  }
});
