document.addEventListener('DOMContentLoaded', () => {
  const emailForm = document.getElementById('emailForm');

  if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const firstNameInput = this.elements['firstName'];
      const lastNameInput = this.elements['lastName'];
      const emailInput = this.elements['email'];

      const firstName = firstNameInput.value;
      const lastName = lastNameInput.value;
      const email = emailInput.value;

      // Get existing entries or initialize array
      let entries = [];
      try {
        entries = JSON.parse(localStorage.getItem('entries')) || [];
      } catch (error) { // Changed 'e' to 'error' for clarity
        console.error('Error parsing localStorage entries:', error); // Added a console log for the error
        entries = [];
      }
      entries.push({ firstName, lastName, email });
      localStorage.setItem('entries', JSON.stringify(entries));

      // Clear the form and refocus the first name field
      this.reset();
      firstNameInput.focus();
    });
  }
});
