document.addEventListener('DOMContentLoaded', function() {
  const tableBody = document.querySelector('#entries-table tbody');

  function getStoredEntries() {
    let entries = [];
    try {
      entries = JSON.parse(localStorage.getItem('entries')) || [];
    } catch (error) {
      console.error('Error retrieving entries from localStorage:', error);
      entries = []; // Ensure entries is an array
    }
    return entries;
  }

  function saveEntries(entries) {
    try {
      localStorage.setItem('entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries to localStorage:', error);
    }
  }

  function deleteEntry(index) {
    console.log('Attempting to delete entry at index:', index); // For debugging
    let entries = getStoredEntries();
    if (index >= 0 && index < entries.length) {
      entries.splice(index, 1);
      saveEntries(entries);
      loadEntries(); // Refresh the table
    } else {
      console.error('Invalid index for deletion:', index);
    }
  }

  function loadEntries() {
    const entries = getStoredEntries();
    // Clear existing table rows
    tableBody.innerHTML = ''; 

    if (entries.length === 0) {
      const row = tableBody.insertRow();
      const cell = row.insertCell();
      cell.setAttribute('colspan', '4'); // Span across all 4 columns
      cell.textContent = 'No entries found.';
      cell.style.textAlign = 'center'; // Basic styling for the message
    } else {
      entries.forEach((entry, index) => {
        const row = tableBody.insertRow();
        
        const firstNameCell = row.insertCell();
        firstNameCell.textContent = entry.firstName || '';
        
        const lastNameCell = row.insertCell();
        lastNameCell.textContent = entry.lastName || '';
        
        const emailCell = row.insertCell();
        emailCell.textContent = entry.email || '';
        
        const actionCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() { // Using onclick for simplicity here
          deleteEntry(index);
        };
        actionCell.appendChild(deleteButton);
      });
    }
  }

  // Initial load of entries
  loadEntries();

  // Refresh table when the tab/window is refocused
  window.addEventListener('focus', loadEntries);

  function downloadAllCSV() {
    const entries = getStoredEntries(); // Use existing function
    if (entries.length === 0) {
      alert('No entries to download.');
      return;
    }
    const header = ['First Name', 'Last Name', 'Email'];
    const rows = entries.map(e => [
      e.firstName || '', 
      e.lastName || '', 
      e.email || ''
    ]);
    const csvContent = [header, ...rows]
      .map(row => row.map(field => `"${(field.toString() || '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'all_entries.csv'); // Changed filename slightly for clarity
    a.style.visibility = 'hidden';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the object URL
  }

  const downloadAllButton = document.getElementById('download-all-csv');
  if (downloadAllButton) {
    downloadAllButton.addEventListener('click', downloadAllCSV);
  }

  function deleteAllEntries() {
    const confirmed = confirm('Are you sure you want to delete all entries? This action cannot be undone.');
    if (confirmed) {
      try {
        localStorage.removeItem('entries');
      } catch (error) {
        console.error('Error removing entries from localStorage:', error);
        alert('Failed to delete entries. Please check console for errors.');
        return;
      }
      loadEntries(); // Refresh the table
      alert('All entries have been deleted.');
    }
  }

  const deleteAllButton = document.getElementById('delete-all-entries');
  if (deleteAllButton) {
    deleteAllButton.addEventListener('click', deleteAllEntries);
  }

  // Make functions globally accessible if needed by other scripts or for event handlers in HTML
  // (though for this plan, event listeners will be added in subsequent steps for download/delete all)
  // window.deleteEntry = deleteEntry; // Not strictly needed if all event listeners are set up within this file
});
