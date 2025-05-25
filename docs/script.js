document.addEventListener('DOMContentLoaded', () => {
  const emailForm = document.getElementById('emailForm');
  const downloadLink = document.getElementById('download-csv-link');

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

  if (downloadLink) {
    downloadLink.addEventListener('click', (event) => {
      event.preventDefault();
      downloadCSV();
    });
  }
});

// Download CSV logic
function downloadCSV() {
  let entries = [];
  try {
    entries = JSON.parse(localStorage.getItem('entries')) || [];
  } catch (error) {
    console.error('Error parsing localStorage entries for CSV download:', error);
    entries = [];
  }
  if (entries.length === 0) {
    alert('No entries to download.');
    return;
  }
  const header = ['First Name', 'Last Name', 'Email'];
  const rows = entries.map(e => [e.firstName, e.lastName, e.email]);
  const csvContent = [header, ...rows]
    .map(row => row.map(field => `"${(field || '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'entries.csv');
  a.style.visibility = 'hidden';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
