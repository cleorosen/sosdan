// JavaScript functionality for SOS Brigade website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize visitor counter
    initGlobalVisitorCounter();
    
    // Set up enter link
    const enterLink = document.querySelector('.enter-link');
    if (enterLink) {
        enterLink.addEventListener('click', function(e) {
            // Allow normal link navigation to occur
            // Without preventDefault(), the link will navigate to its href target
        });
    }
});

// Global visitor counter functionality
function initGlobalVisitorCounter() {
    // Use a site-wide key for session tracking to ensure consistency across pages
    const SESSION_COUNTER_KEY = 'sos_brigade_visit_counted';
    
    // Only count the visit if it hasn't been counted in this browser session
    // This ensures users aren't counted multiple times as they browse different pages
    const sessionCounted = sessionStorage.getItem(SESSION_COUNTER_KEY);
    
    if (!sessionCounted) {
        // First visit in this session - increment the counter on the server
        incrementCounterOnServer();
        
        // Mark this session as counted to prevent recounting on other pages
        sessionStorage.setItem(SESSION_COUNTER_KEY, 'true');
        
        // Also store the timestamp for potential expiry checking
        sessionStorage.setItem(SESSION_COUNTER_KEY + '_time', Date.now());
    }
    
    // Always fetch the current count to show accurate numbers
    fetchVisitorCount();
    
    // Update the counter periodically
    setInterval(fetchVisitorCount, CONFIG.COUNTER_REFRESH_INTERVAL || 300000);
}

// Increment counter on server
function incrementCounterOnServer() {
    // Make a POST request to the counter API
    fetch(CONFIG.COUNTER_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Use cache: 'no-cache' to prevent caching of this request
        cache: 'no-cache'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to increment counter');
        }
        return response.json();
    })
    .then(data => {
        // Update the counter with the returned count
        updateCounterDisplay(data.count);
    })
    .catch(error => {
        console.error('Error incrementing counter:', error);
        // Fall back to local counting if server is unavailable
        useFallbackCounter(true);
    });
}

// Fetch visitor count from server
function fetchVisitorCount() {
    // Make a GET request to the counter API
    fetch(CONFIG.COUNTER_API_URL, {
        // Use cache: 'no-cache' to always get fresh count
        cache: 'no-cache'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch counter');
        }
        return response.json();
    })
    .then(data => {
        // Update the counter with the returned count
        updateCounterDisplay(data.count);
    })
    .catch(error => {
        console.error('Error fetching count:', error);
        // Fall back to local counting if server is unavailable
        useFallbackCounter(false);
    });
}

// Fallback counter when the API is unavailable
function useFallbackCounter(increment) {
    // Use a site-wide key for localStorage to ensure consistency
    const LOCAL_COUNTER_KEY = 'sos_brigade_visitor_count';
    
    // Determine which fallback method to use
    const fallbackMode = CONFIG.COUNTER_FALLBACK_MODE || 'local';
    
    if (fallbackMode === 'local') {
        // Use localStorage for counting
        let count = parseInt(localStorage.getItem(LOCAL_COUNTER_KEY) || '1');
        
        if (increment) {
            // Only increment if this is a new session visit (using same session check as main function)
            count++;
            localStorage.setItem(LOCAL_COUNTER_KEY, count.toString());
        }
        
        updateCounterDisplay(count);
    } else if (fallbackMode === 'simulate') {
        // Use a simulated increasing counter
        const SIMULATE_COUNTER_KEY = 'sos_brigade_simulated_count';
        const baseCount = parseInt(localStorage.getItem(SIMULATE_COUNTER_KEY) || '10000');
        const newCount = increment ? baseCount + 1 : baseCount;
        localStorage.setItem(SIMULATE_COUNTER_KEY, newCount.toString());
        updateCounterDisplay(newCount);
    }
}

// Update the counter display with the current count
function updateCounterDisplay(count) {
    // Convert count to string and pad with leading zeros
    const countString = count.toString().padStart(8, '0');
    const digits = document.querySelectorAll('.digit');
    const counterValue = document.getElementById('counter-value');
    
    // Update the counter digits display
    for (let i = 0; i < 8; i++) {
        if (i < digits.length) {
            digits[i].textContent = countString[i];
        }
    }
    
    // Update the English counter value
    if (counterValue) {
        counterValue.textContent = countString;
    }
}
