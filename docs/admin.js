document.addEventListener('DOMContentLoaded', function() {
  const tableBody = document.querySelector('#entries-table tbody');
  const pageTitle = document.querySelector('#heading');

  let allEntries = [];
  let currentPage = 1;
  let entriesPerPage = 20; // Default value, will be configurable

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

  function deleteEntry(originalIndex) {
    console.log('Attempting to delete entry at original index:', originalIndex); // For debugging
    if (originalIndex >= 0 && originalIndex < allEntries.length) {
      allEntries.splice(originalIndex, 1);
      saveEntries(allEntries);
      // Recalculate total pages and adjust currentPage if it's now out of bounds
      const totalPages = entriesPerPage === 0 ? 1 : Math.ceil(allEntries.length / entriesPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
      } else if (allEntries.length === 0) {
        currentPage = 1; // Reset to page 1 if no entries left
      }
      loadEntries(); // Reload all entries and refresh display
    } else {
      console.error('Invalid original index for deletion:', originalIndex);
    }
  }

  function updateTitleWithCount(count) {
    if (pageTitle) {
      pageTitle.textContent = `${count} Stored Entries`; // Kept original wording
    }
  }

  function displayPage() {
    tableBody.innerHTML = ''; // Clear existing table rows

    if (allEntries.length === 0) {
      const row = tableBody.insertRow();
      const cell = row.insertCell();
      cell.setAttribute('colspan', '4');
      cell.textContent = 'No entries found.';
      cell.style.textAlign = 'center';
      return; // Exit early
    }

    let entriesToDisplay = [];
    if (entriesPerPage === 0) { // "All" selected
      entriesToDisplay = allEntries;
    } else {
      const startIndex = (currentPage - 1) * entriesPerPage;
      const endIndex = startIndex + entriesPerPage;
      entriesToDisplay = allEntries.slice(startIndex, endIndex);
    }

    entriesToDisplay.forEach((entry, indexOnPage) => {
      const originalIndex = (entriesPerPage === 0) ? indexOnPage : (currentPage - 1) * entriesPerPage + indexOnPage;
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
      deleteButton.onclick = function() {
        // Pass the original index from the allEntries array
        deleteEntry(originalIndex);
      };
      actionCell.appendChild(deleteButton);
    });
  }

  function loadEntries() {
    allEntries = getStoredEntries();
    updateTitleWithCount(allEntries.length); // Update title with total count

    // Reset current page if it's out of bounds (e.g., after deleting all items on the last page)
    const totalPages = entriesPerPage === 0 ? 1 : Math.ceil(allEntries.length / entriesPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (allEntries.length === 0) {
        currentPage = 1; // Default to page 1 if no entries
    }

    displayPage(); // Display the current page
    setupPaginationControls(); // Setup or update pagination controls
  }

  function setupPaginationControls() {
    const controlsContainer = document.getElementById('pagination-controls');
    if (!controlsContainer) return;
    controlsContainer.innerHTML = ''; // Clear existing controls

    if (allEntries.length === 0 && entriesPerPage !== 0) { // Don't show controls if no entries unless "All" is selected (which might show "0 entries")
        // Optionally, hide controls container or show a specific message if no entries.
        // For now, if allEntries is empty, displayPage shows "No entries found", and controls will be minimal or not shown.
        // If entriesPerPage is 0 (All), we might still want to show the selector.
    }

    const totalPages = entriesPerPage === 0 ? 1 : Math.ceil(allEntries.length / entriesPerPage);

    // Entries per page selector
    const perPageLabel = document.createElement('label');
    perPageLabel.textContent = 'Rows per page: ';
    perPageLabel.setAttribute('for', 'entries-per-page-select');

    const perPageSelect = document.createElement('select');
    perPageSelect.id = 'entries-per-page-select';
    const options = [20, 50, 100, 0]; // 0 for "All"
    const optionLabels = { 20: '20', 50: '50', 100: '100', 0: 'All' };

    options.forEach(num => {
      const option = document.createElement('option');
      option.value = num;
      option.textContent = optionLabels[num];
      if (num === entriesPerPage) {
        option.selected = true;
      }
      perPageSelect.appendChild(option);
    });

    perPageSelect.addEventListener('change', function(event) {
      entriesPerPage = parseInt(event.target.value, 10);
      currentPage = 1; // Reset to first page
      loadEntries();
    });

    controlsContainer.appendChild(perPageLabel);
    controlsContainer.appendChild(perPageSelect);

    // Only show page navigation if not "All" and more than one page
    if (entriesPerPage !== 0 && totalPages > 1) {
      const pageInfo = document.createElement('span');
      pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;
      pageInfo.style.margin = '0 10px'; // Add some spacing

      const prevButton = document.createElement('button');
      prevButton.textContent = 'Previous';
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          loadEntries();
        }
      });

      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next';
      nextButton.disabled = currentPage === totalPages;
      nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          loadEntries();
        }
      });

      controlsContainer.appendChild(prevButton);
      controlsContainer.appendChild(pageInfo);
      controlsContainer.appendChild(nextButton);
    } else if (entriesPerPage === 0 && allEntries.length > 0) {
      // Optionally show "Displaying all X entries" or similar if "All" is selected
      const pageInfo = document.createElement('span');
      pageInfo.textContent = ` Displaying all ${allEntries.length} entries. `;
      pageInfo.style.margin = '0 10px';
      controlsContainer.appendChild(pageInfo);
    }
     // If allEntries.length is 0, displayPage shows "No entries", and controls will just be the selector.
  }

  // Initial load of entries
  loadEntries();

  // Refresh table when the tab/window is refocused
  // Consider if full reload or just re-render is needed. Full reload is simpler for now.
  window.addEventListener('focus', loadEntries);

  function downloadAllCSV() {
    // This function should still use allEntries or getStoredEntries() directly
    // as it's "Download ALL"
    const entriesToDownload = getStoredEntries();
    if (entriesToDownload.length === 0) {
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
});
