// Global variables
let currentScreen = 'input'; // 'input' or 'drawing'
let userName = '';
let isDrawing = false;
let drawnName = '';

// Animation states
let capOpenProgress = 0;
let paperSlipProgress = 0;
let isCapOpen = false;
let showPaper = false;

// Baseball cap dimensions
let capCenterX, capCenterY;
let capWidth = 200;
let capHeight = 120;
let billWidth = 240;
let billHeight = 40;

// Colors
const CAP_COLOR = '#2D5D4F'; // Deep green
const CAP_SHADOW = '#1A3830';
const BILL_COLOR = '#234339';
const PAPER_COLOR = '#F5ECD7';
const TEXT_COLOR = '#2D5D4F';

function setup() {
    let canvas = createCanvas(500, 450);
    canvas.parent('p5-canvas-container');
    
    // Set up event listeners for the name input screen
    const startBtn = document.getElementById('start-btn');
    const nameInput = document.getElementById('user-name-input');
    
    startBtn.addEventListener('click', startGame);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startGame();
        }
    });
    
    // Center the cap
    capCenterX = width / 2;
    capCenterY = height / 2;
    
    textAlign(CENTER, CENTER);
    noLoop(); // We'll redraw manually when needed
}

function draw() {
    if (currentScreen !== 'drawing') {
        return;
    }
    
    // Gradient background
    drawGradientBackground();
    
    // Draw the baseball cap
    drawBaseballCap();
    
    // Draw the paper slip if it should be shown
    if (showPaper) {
        drawPaperSlip();
    }
    
    // Update animations
    updateAnimations();
}

function drawGradientBackground() {
    // Subtle gradient background
    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(color(255, 248, 232), color(255, 232, 204), inter);
        stroke(c);
        line(0, y, width, y);
    }
}

function drawBaseballCap() {
    push();
    translate(capCenterX, capCenterY);
    
    // Shadow
    noStroke();
    fill(0, 0, 0, 20);
    ellipse(0, capHeight + 20, capWidth + 40, 20);
    
    // Cap bill (brim)
    fill(BILL_COLOR);
    stroke(CAP_SHADOW);
    strokeWeight(2);
    
    // Bill shape
    beginShape();
    vertex(-billWidth/2, 10);
    bezierVertex(-billWidth/2, 10, -billWidth/2, billHeight, -billWidth/3, billHeight);
    bezierVertex(-billWidth/3, billHeight, billWidth/3, billHeight, billWidth/3, billHeight);
    bezierVertex(billWidth/3, billHeight, billWidth/2, billHeight, billWidth/2, 10);
    vertex(billWidth/2, 10);
    vertex(-billWidth/2, 10);
    endShape(CLOSE);
    
    // Main cap body
    fill(CAP_COLOR);
    
    // Top of cap (closed)
    ellipse(0, -capHeight/2, capWidth, 60);
    
    // Cap sides
    rect(-capWidth/2, -capHeight/2, capWidth, capHeight - 10, 0, 0, 15, 15);
    
    // Cap opening - this will animate
    let openingHeight = capOpenProgress * 30;
    
    // Opening of the cap (bottom oval) - gets bigger when opening
    fill(30, 30, 30);
    ellipse(0, capHeight/2 - 10 + openingHeight/2, 
            capWidth - 20 + openingHeight, 
            40 + openingHeight);
    
    // Inner shadow of opening
    fill(20, 20, 20, 100);
    ellipse(0, capHeight/2 - 15 + openingHeight/2, 
            capWidth - 30 + openingHeight, 
            30 + openingHeight);
    
    // Decorative stitching on cap
    stroke(CAP_SHADOW);
    strokeWeight(2);
    noFill();
    arc(0, -capHeight/2 + 20, capWidth - 40, 40, 0, PI);
    
    pop();
}

function drawPaperSlip() {
    push();
    translate(capCenterX, capCenterY);
    
    // Paper emerges from the cap
    let paperY = (capHeight/2 - 20) + paperSlipProgress * 100;
    
    // Paper shadow
    noStroke();
    fill(0, 0, 0, 30);
    rect(-35, paperY + 5, 70, 90, 5);
    
    // Paper slip
    fill(PAPER_COLOR);
    stroke(TEXT_COLOR);
    strokeWeight(2);
    rect(-30, paperY, 60, 80, 5);
    
    // Paper fold line
    stroke(TEXT_COLOR);
    strokeWeight(1);
    line(-30, paperY + 40, 30, paperY + 40);
    
    // Draw name on paper if fully emerged
    if (paperSlipProgress > 0.5 && drawnName) {
        noStroke();
        fill(TEXT_COLOR);
        textSize(18);
        textFont('Courier Prime');
        textStyle(BOLD);
        text(drawnName, 0, paperY + 30);
        
        // Small decorative star
        textSize(12);
        text('★', 0, paperY + 55);
    }
    
    pop();
}

function updateAnimations() {
    let needsRedraw = false;
    
    // Animate cap opening
    if (isCapOpen && capOpenProgress < 1) {
        capOpenProgress += 0.08;
        if (capOpenProgress > 1) capOpenProgress = 1;
        needsRedraw = true;
    }
    
    // Animate paper slip emerging (after cap is open)
    if (showPaper && capOpenProgress >= 0.8 && paperSlipProgress < 1) {
        paperSlipProgress += 0.06;
        if (paperSlipProgress > 1) paperSlipProgress = 1;
        needsRedraw = true;
    }
    
    if (needsRedraw) {
        redraw();
    }
}

function startGame() {
    const nameInput = document.getElementById('user-name-input');
    const inputValue = nameInput.value.trim();
    
    if (!inputValue) {
        alert('Please enter your name!');
        return;
    }
    
    userName = inputValue;
    
    // Switch screens
    document.getElementById('name-input-screen').classList.remove('active');
    document.getElementById('drawing-screen').classList.add('active');
    
    // Update welcome message
    document.getElementById('welcome-message').textContent = `Welcome, ${userName}!`;
    
    currentScreen = 'drawing';
    loop(); // Start the draw loop
    redraw();
}

function mousePressed() {
    if (currentScreen !== 'drawing') {
        return;
    }
    
    // Check if mouse is over the cap
    let d = dist(mouseX, mouseY, capCenterX, capCenterY);
    if (d < capWidth/2 && !isDrawing) {
        drawNameFromHat();
    }
}

async function drawNameFromHat() {
    if (isDrawing) return;
    
    isDrawing = true;
    const statusEl = document.getElementById('status-message');
    const instructionEl = document.getElementById('draw-instruction');
    
    try {
        // Get available names from Firebase
        const availableNames = await getAvailableNames(userName);
        
        if (availableNames.length === 0) {
            // No names available
            statusEl.textContent = 'No names available to draw';
            statusEl.className = 'error';
            instructionEl.style.display = 'none';
            isDrawing = false;
            return;
        }
        
        // Randomly select a name
        const randomIndex = floor(random(availableNames.length));
        drawnName = availableNames[randomIndex];
        
        // Mark the name as drawn in Firebase
        await markNameAsDrawn(drawnName, userName);
        
        // Animate the cap opening and paper emerging
        instructionEl.style.display = 'none';
        statusEl.textContent = 'Drawing...';
        statusEl.className = '';
        
        isCapOpen = true;
        
        // Show paper after a delay
        setTimeout(() => {
            showPaper = true;
            statusEl.textContent = `You drew: ${drawnName}!`;
            statusEl.className = 'success';
        }, 800);
        
    } catch (error) {
        console.error('Error drawing name:', error);
        statusEl.textContent = 'Error connecting to server. Please try again.';
        statusEl.className = 'error';
        isDrawing = false;
    }
}

// Prevent default p5.js touch behavior on mobile
function touchStarted() {
    return false;
}