document.addEventListener('DOMContentLoaded', function() {
    initGlobalVisitorCounter();
    
    const enterLink = document.querySelector('.enter-link');
    if (enterLink) {
        enterLink.addEventListener('click', function(e) {
        });
    }
});

function initGlobalVisitorCounter() {
    const SESSION_COUNTER_KEY = 'sos_brigade_visit_counted';
    
    const sessionCounted = sessionStorage.getItem(SESSION_COUNTER_KEY);
    
    if (!sessionCounted) {
        incrementCounterOnServer();
        
        sessionStorage.setItem(SESSION_COUNTER_KEY, 'true');
        
        sessionStorage.setItem(SESSION_COUNTER_KEY + '_time', Date.now());
    }
    
    fetchVisitorCount();
    
    setInterval(fetchVisitorCount, CONFIG.COUNTER_REFRESH_INTERVAL || 300000);
}

function incrementCounterOnServer() {
    fetch(CONFIG.COUNTER_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-cache'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to increment counter');
        }
        return response.json();
    })
    .then(data => {
        updateCounterDisplay(data.count);
    })
    .catch(error => {
        console.error('Error incrementing counter:', error);
        useFallbackCounter(true);
    });
}

function fetchVisitorCount() {
    fetch(CONFIG.COUNTER_API_URL, {
        cache: 'no-cache'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch counter');
        }
        return response.json();
    })
    .then(data => {
        updateCounterDisplay(data.count);
    })
    .catch(error => {
        console.error('Error fetching count:', error);
        useFallbackCounter(false);
    });
}

function useFallbackCounter(increment) {
    const LOCAL_COUNTER_KEY = 'sos_brigade_visitor_count';
    
    const fallbackMode = CONFIG.COUNTER_FALLBACK_MODE || 'local';
    
    if (fallbackMode === 'local') {
        let count = parseInt(localStorage.getItem(LOCAL_COUNTER_KEY) || '1');
        
        if (increment) {
            count++;
            localStorage.setItem(LOCAL_COUNTER_KEY, count.toString());
        }
        
        updateCounterDisplay(count);
    } else if (fallbackMode === 'simulate') {
        const SIMULATE_COUNTER_KEY = 'sos_brigade_simulated_count';
        const baseCount = parseInt(localStorage.getItem(SIMULATE_COUNTER_KEY) || '10000');
        const newCount = increment ? baseCount + 1 : baseCount;
        localStorage.setItem(SIMULATE_COUNTER_KEY, newCount.toString());
        updateCounterDisplay(newCount);
    }
}

function updateCounterDisplay(count) {
    const countString = count.toString().padStart(8, '0');
    const digits = document.querySelectorAll('.digit');
    const counterValue = document.getElementById('counter-value');
    
    for (let i = 0; i < 8; i++) {
        if (i < digits.length) {
            digits[i].textContent = countString[i];
        }
    }
    
    if (counterValue) {
        counterValue.textContent = countString;
    }
}
