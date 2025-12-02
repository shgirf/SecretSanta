// Firebase Configuration
// IMPORTANT: Replace these values with your own Firebase project credentials
// See README.md for detailed setup instructions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBq5hgbWUbwe7J7qcYvZiI2e0on6khicvI",
  authDomain: "secret-santa-dec9c.firebaseapp.com",
  databaseURL: "https://secret-santa-dec9c-default-rtdb.firebaseio.com",
  projectId: "secret-santa-dec9c",
  storageBucket: "secret-santa-dec9c.firebasestorage.app",
  messagingSenderId: "510850878676",
  appId: "1:510850878676:web:1b7425967ed5d97abe3f41",
  measurementId: "G-L9WN2L0DKK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
    });
}

// Mark a name as drawn
function markNameAsDrawn(name, drawnBy) {
    return namesRef.child(name).update({
        available: false,
        drawnBy: drawnBy,
        timestamp: Date.now()
    });
}

// Reset the pool (for testing/new rounds)
// Uncomment this function and call it from console if you need to reset
/*
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
    });
}
*/

// Initialize the pool when the page loads
initializeNamesPool();
