// Firebase Configuration - COMPAT VERSION (works with CDN scripts in HTML)
const firebaseConfig = {
  apiKey: "AIzaSyDbZLx_su2RTUGnXVcxZqEroBXhjmxXy3o",
  authDomain: "secretsantagame-9f7de.firebaseapp.com",
  databaseURL: "https://secretsantagame-9f7de-default-rtdb.firebaseio.com",
  projectId: "secretsantagame-9f7de",
  storageBucket: "secretsantagame-9f7de.firebasestorage.app",
  messagingSenderId: "362424177114",
  appId: "1:362424177114:web:547bfcf79ab5a2a61070e3"
};

// Initialize Firebase using compat API
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Reference to the names pool in the database
const namesRef = database.ref('secretSanta/names');

// Initialize the names pool if it doesn't exist
function initializeNamesPool() {
    const allNames = ['Shane', 'Devin', 'Julie', 'Mike', 'Rae'];
    
    namesRef.once('value').then((snapshot) => {
        if (!snapshot.exists()) {
            // Create initial pool with all names available
            const initialPool = {};
            allNames.forEach(name => {
                initialPool[name] = {
                    available: true,
                    drawnBy: null,
                    timestamp: null
                };
            });
            namesRef.set(initialPool);
            console.log('Names pool initialized');
        }
    }).catch((error) => {
        console.error('Error initializing pool:', error);
    });
}

// Get available names (excluding the user's own name)
function getAvailableNames(userName) {
    return namesRef.once('value').then((snapshot) => {
        const pool = snapshot.val();
        if (!pool) return [];
        
        const available = [];
        Object.keys(pool).forEach(name => {
            // Name must be available AND not be the user's own name (case-insensitive)
            if (pool[name].available && 
                name.toLowerCase() !== userName.toLowerCase()) {
                available.push(name);
            }
        });
        
        return available;
    }).catch((error) => {
        console.error('Error getting available names:', error);
        throw error;
    });
}

// Mark a name as drawn
function markNameAsDrawn(name, drawnBy) {
    return namesRef.child(name).update({
        available: false,
        drawnBy: drawnBy,
        timestamp: Date.now()
    }).catch((error) => {
        console.error('Error marking name as drawn:', error);
        throw error;
    });
}

// Reset the pool (for testing/new rounds)
// Call this from browser console: resetNamesPool()
function resetNamesPool() {
    const allNames = ['Shane', 'Devin', 'Julie', 'Mike', 'Rae'];
    const resetPool = {};
    allNames.forEach(name => {
        resetPool[name] = {
            available: true,
            drawnBy: null,
            timestamp: null
        };
    });
    namesRef.set(resetPool).then(() => {
        console.log('Names pool has been reset');
        alert('Pool reset! All names are available again.');
    }).catch((error) => {
        console.error('Error resetting pool:', error);
    });
}

// Initialize the pool when the page loads
initializeNamesPool();