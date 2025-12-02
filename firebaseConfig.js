// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, get, child } from "firebase/database";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbZLx_su2RTUGnXVcxZqEroBXhjmxXy3o",
  authDomain: "secretsantagame-9f7de.firebaseapp.com",
  databaseURL: "https://secretsantagame-9f7de-default-rtdb.firebaseio.com",
  projectId: "secretsantagame-9f7de",
  storageBucket: "secretsantagame-9f7de.firebasestorage.app",
  messagingSenderId: "362424177114",
  appId: "1:362424177114:web:547bfcf79ab5a2a61070e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Reference to the names pool in the database
const namesRef = database.ref('secretSanta/names');

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
