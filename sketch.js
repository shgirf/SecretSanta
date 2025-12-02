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
let capWidth = 180;
let capHeight = 100;
let billLength = 140;

// Colors
const CAP_COLOR = '#8B5A3C'; // Warm brown/red like reference
const CAP_SHADOW = '#6B4530';
const BILL_COLOR = '#7A4A32';
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
    
    // Shadow underneath
    noStroke();
    fill(0, 0, 0, 15);
    ellipse(0, 75, capWidth + 40, 20);
    
    // UPSIDE DOWN BASEBALL CAP - SIDE VIEW (like the reference image)
    // Opening is at TOP, crown/dome at BOTTOM, bill sticks out to the RIGHT
    
    let openingExpand = capOpenProgress * 30;
    
    // BILL/BRIM - Draw first (behind the cap body)
    fill(BILL_COLOR);
    stroke(CAP_SHADOW);
    strokeWeight(2.5);
    
    // Bill shape - curved, three-dimensional, sticking to the right
    beginShape();
    vertex(40, -10); // Where bill meets cap on top left
    bezierVertex(40, -10,
                 40 + billLength * 0.7, -20,
                 40 + billLength, -10); // Bill curves down
    bezierVertex(40 + billLength, -10,
                 40 + billLength - 5, 5,
                 40 + billLength - 15, 20); // Curves back toward cap
    bezierVertex(40 + billLength - 15, 20,
                 40 + billLength * 0.5, 25,
                 40, 20); // Back to cap on bottom
    endShape(CLOSE);
    
    // Bill underside shadow detail
    fill(CAP_SHADOW);
    noStroke();
    beginShape();
    vertex(45, 5);
    bezierVertex(45, 5,
                 40 + billLength * 0.5, 8,
                 40 + billLength - 25, 15);
    bezierVertex(40 + billLength - 25, 15,
                 40 + billLength * 0.4, 18,
                 45, 18);
    endShape(CLOSE);
    
    // Stitching line on bill
    stroke(CAP_SHADOW);
    strokeWeight(1);
    noFill();
    beginShape();
    vertex(50, 0);
    bezierVertex(50, 0,
                 40 + billLength * 0.6, -5,
                 40 + billLength - 20, 0);
    endShape();
    
    // MAIN CAP BODY
    fill(CAP_COLOR);
    stroke(CAP_SHADOW);
    strokeWeight(2.5);
    
    // Left side of crown (rounded dome at bottom)
    beginShape();
    vertex(-70, -15); // Top left edge
    bezierVertex(-70, -15,
                 -80, 20,
                 -70, 55); // Curves down left side
    bezierVertex(-70, 55,
                 -40, 72,
                 0, 75); // Bottom rounded curve (crown)
    endShape();
    
    // Right side of crown
    beginShape();
    vertex(0, 75); // Bottom center
    bezierVertex(0, 75,
                 35, 72,
                 60, 58); // Curves to right
    bezierVertex(60, 58,
                 70, 25,
                 55, -15); // Up to top right
    endShape();
    
    // Top connecting section (between crown and opening)
    fill(CAP_COLOR);
    quad(-70, -15,  // Top left
         55, -15,   // Top right
         55, 5,     // Bottom right
         -70, 5);   // Bottom left
    
    // Panel seam lines for realism
    stroke(CAP_SHADOW);
    strokeWeight(1.5);
    noFill();
    
    // Center seam
    beginShape();
    vertex(-5, -12);
    bezierVertex(-5, -12,
                 -10, 30,
                 0, 75);
    endShape();
    
    // Left panel seam
    beginShape();
    vertex(-40, -13);
    bezierVertex(-40, -13,
                 -50, 25,
                 -40, 62);
    endShape();
    
    // Right panel seam  
    beginShape();
    vertex(25, -13);
    bezierVertex(25, -13,
                 38, 25,
                 32, 60);
    endShape();
    
    // CAP OPENING AT TOP (where we draw from) - expands when opening
    fill(25, 25, 25);
    stroke(CAP_SHADOW);
    strokeWeight(2);
    
    // Opening ellipse - gets bigger with animation
    ellipse(-7, -15, 135 + openingExpand, 38 + openingExpand);
    
    // Inner darkness
    fill(15, 15, 15);
    noStroke();
    ellipse(-7, -13, 115 + openingExpand, 28 + openingExpand);
    
    // Button detail on crown bottom
    fill(CAP_SHADOW);
    noStroke();
    ellipse(0, 72, 14, 10);
    fill(BILL_COLOR);
    ellipse(0, 71, 12, 8);
    
    pop();
}

function drawPaperSlip() {
    push();
    translate(capCenterX, capCenterY);
    
    // Paper emerges from the TOP opening of the upside-down cap
    let paperY = -20 - (paperSlipProgress * 100);
    
    // Paper shadow
    noStroke();
    fill(0, 0, 0, 30);
    rect(-35, paperY + 3, 70, 90, 5);
    
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
    if (d < capWidth && !isDrawing) {
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