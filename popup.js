// Popup script

document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const statusMessage = document.getElementById('statusMessage');
  const refreshBtn = document.getElementById('refreshBtn');
  
  // Load saved state
  chrome.storage.sync.get(['darkModeEnabled'], function(result) {
    const isEnabled = result.darkModeEnabled !== false; 
    updateToggleState(isEnabled);
  });
  
  darkModeToggle.addEventListener('click', function() {
    const isCurrentlyActive = darkModeToggle.classList.contains('active');
    const newState = !isCurrentlyActive;
    
    // Save state
    chrome.storage.sync.set({darkModeEnabled: newState});
    
    // Update UI
    updateToggleState(newState);
    
    chrome.tabs.query({url: "*://mail.google.com/*"}, function(tabs) {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: newState ? 'enable' : 'disable'
        }).catch(() => {
          // Ooga booga, tab might not have content script loaded yet
        });
      });
    });
    
    showToggleFeedback(newState);
  });
  
  // Refresh button 
  refreshBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      
      if (currentTab.url.includes('mail.google.com')) {
        const refreshText = refreshBtn.querySelector('span');
        const originalText = refreshText.textContent;
        refreshText.textContent = 'Refreshing...';
        refreshBtn.style.backgroundColor = '#1a73e8';
        
        chrome.tabs.reload(currentTab.id);
        
        setTimeout(() => {
          refreshText.textContent = 'Refreshed!';
          refreshBtn.style.backgroundColor = '#4caf50';
          
          setTimeout(() => {
            refreshText.textContent = originalText;
            refreshBtn.style.backgroundColor = '#3c4043';
          }, 1500);
        }, 500);
        
        // Close popup after refresh
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        // Not on Gmail
        const refreshText = refreshBtn.querySelector('span');
        const originalText = refreshText.textContent;
        refreshText.textContent = 'Open Gmail first';
        refreshBtn.style.backgroundColor = '#f44336';
        
        setTimeout(() => {
          refreshText.textContent = originalText;
          refreshBtn.style.backgroundColor = '#3c4043';
        }, 2000);
      }
    });
  });
  
  function updateToggleState(isEnabled) {
    if (isEnabled) {
      darkModeToggle.classList.add('active');
      statusMessage.className = 'status enabled fade-in';
      statusMessage.textContent = '✅ Dark mode is active';
    } else {
      darkModeToggle.classList.remove('active');
      statusMessage.className = 'status disabled fade-in';
      statusMessage.textContent = '❌ Dark mode is disabled';
    }
  }
  
  function showToggleFeedback(isEnabled) {
    // Add a goofy animation to show the change
    statusMessage.style.transform = 'scale(1.05)';
    setTimeout(() => {
      statusMessage.style.transform = 'scale(1)';
    }, 200);
    
    // Update status with animation
    statusMessage.classList.add('fade-in');
    setTimeout(() => {
      statusMessage.classList.remove('fade-in');
    }, 300);
  }
});
