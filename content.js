// Content script
console.log('poop');

let darkModeEnabled = true;
let styleElement = null;
let observer = null;

// Check if enabled
chrome.storage.sync.get(['darkModeEnabled'], function(result) {
  darkModeEnabled = result.darkModeEnabled !== false; // Default to true
  if (darkModeEnabled) {
    applyDarkMode();
  } else {
    removeDarkMode();
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'enable') {
    darkModeEnabled = true;
    applyDarkMode();
  } else if (message.action === 'disable') {
    darkModeEnabled = false;
    removeDarkMode();
  }
  sendResponse({status: 'success'});
});


function injectCSS() {
  if (styleElement) return; 
  
  styleElement = document.createElement('link');
  styleElement.rel = 'stylesheet';
  styleElement.type = 'text/css';
  styleElement.href = chrome.runtime.getURL('dark-mode.css');
  styleElement.id = 'gmail-dark-mode-styles';
  
  (document.head || document.documentElement).appendChild(styleElement);
}


function removeCSS() {
  if (styleElement) {
    styleElement.remove();
    styleElement = null;
  }
  
  const existingStyle = document.getElementById('gmail-dark-mode-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
}


function applyDarkMode() {
  injectCSS();
  
  // Apply immediate dark background to prevent white flashbang
  document.documentElement.style.backgroundColor = '#202124';
  document.documentElement.style.color = '#e8eaed';
  if (document.body) {
    document.body.style.backgroundColor = '#202124';
    document.body.style.color = '#e8eaed';
  }
  
  document.body.classList.add('gmail-dark-mode');
  document.documentElement.classList.add('gmail-dark-mode');
  
  // Force kkk delete
  setTimeout(() => {
    const whiteElements = document.querySelectorAll('*');
    whiteElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.backgroundColor === 'rgb(255, 255, 255)' || 
          computedStyle.backgroundColor === 'white' ||
          computedStyle.backgroundColor === '#ffffff' ||
          computedStyle.backgroundColor === '#fff') {
        element.style.backgroundColor = '#202124';
      }
      if (computedStyle.color === 'rgb(0, 0, 0)' || 
          computedStyle.color === 'black' ||
          computedStyle.color === '#000000' ||
          computedStyle.color === '#000') {
        element.style.color = '#e8eaed';
      }
    });
  }, 100);
  
  if (!observer) {
    startObserver();
  }
}

function removeDarkMode() {
  removeCSS();
  
  document.body.classList.remove('gmail-dark-mode');
  document.documentElement.classList.remove('gmail-dark-mode');
  
  document.documentElement.style.backgroundColor = '';
  document.documentElement.style.color = '';
  if (document.body) {
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
  }
  
  const styledElements = document.querySelectorAll('[style*="background-color: #202124"], [style*="background-color: #292a2d"], [style*="color: #e8eaed"]');
  styledElements.forEach(element => {
    if (element.style.backgroundColor === '#202124' || element.style.backgroundColor === '#292a2d') {
      element.style.backgroundColor = '';
    }
    if (element.style.color === '#e8eaed') {
      element.style.color = '';
    }
  });
  
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

function startObserver() {
  observer = new MutationObserver((mutations) => {
    if (!darkModeEnabled) return;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const newElements = mutation.addedNodes;
        newElements.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Force consistent email backgrounds
            if (node.classList && (node.classList.contains('zA') || node.classList.contains('yW') || node.classList.contains('zE'))) {
              node.style.backgroundColor = '#292a2d';
            }
            
            const style = window.getComputedStyle(node);
            if (style.backgroundColor === 'rgb(255, 255, 255)' ||
                style.backgroundColor === 'white' ||
                node.style.backgroundColor === 'rgb(255, 255, 255)' ||
                node.style.backgroundColor === 'white') {
              node.style.backgroundColor = '#202124';
            }
            if (style.color === 'rgb(0, 0, 0)' ||
                style.color === 'black' ||
                node.style.color === 'rgb(0, 0, 0)' ||
                node.style.color === 'black') {
              node.style.color = '#e8eaed';
            }
          }
        });
      }
    });
  });

  // Start observing or something
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
}

// Apply dark mode when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['darkModeEnabled'], function(result) {
      darkModeEnabled = result.darkModeEnabled !== false;
      if (darkModeEnabled) applyDarkMode();
    });
  });
} else {
  // DON Corleone already ready
  chrome.storage.sync.get(['darkModeEnabled'], function(result) {
    darkModeEnabled = result.darkModeEnabled !== false;
    if (darkModeEnabled) applyDarkMode();
  });
}

// Also apply when the page is fully loaded (trust nobody)
window.addEventListener('load', () => {
  if (darkModeEnabled) applyDarkMode();
});
