const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to fill the entire window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let ball = { x: 0, y: 0, radius: 15, speedX: 0, speedY: 0, onGround: false };
const GRAVITY = 0.3,
	JUMP_STRENGTH = -10,
	SPEED = 3;
    const LEVELS = [
        {
            platforms: [
                { x: 50, y: canvas.height - 100, width: 200, height: 20 },
                { x: 300, y: canvas.height - 200, width: 200, height: 20 },
                { x: 600, y: canvas.height - 300, width: 200, height: 20 },
                { x: 900, y: canvas.height - 200, width: 150, height: 20 },
                { x: 1150, y: canvas.height - 150, width: 200, height: 20 },
                { x: 1400, y: canvas.height - 250, width: 200, height: 20 },
                { x: 1700, y: canvas.height - 350, width: 200, height: 20 },
                { x: 2000, y: canvas.height - 200, width: 150, height: 20 },
                { x: 2250, y: canvas.height - 150, width: 200, height: 20 }
            ],
            spikes: [
                { x: 120, y: canvas.height - 100, size: 20 },   // Clustered spikes on first platform
                { x: 140, y: canvas.height - 100, size: 20 },
                { x: 380, y: canvas.height - 200, size: 20 },   // Clustered spikes on second platform
                { x: 400, y: canvas.height - 200, size: 20 },
                { x: 420, y: canvas.height - 200, size: 20 },
                { x: 640, y: canvas.height - 300, size: 20 },   // Single spike on third platform
                { x: 950, y: canvas.height - 200, size: 20 },   // Clustered spikes on fourth platform
                { x: 970, y: canvas.height - 200, size: 20 },
                { x: 1500, y: canvas.height - 250, size: 20 },  // Clustered spikes on sixth platform
                { x: 1520, y: canvas.height - 250, size: 20 },
                { x: 1720, y: canvas.height - 350, size: 20 },  // Single spike on seventh platform
                { x: 2020, y: canvas.height - 200, size: 20 },  // Clustered spikes on eighth platform
                { x: 2040, y: canvas.height - 200, size: 20 },
                { x: 2270, y: canvas.height - 150, size: 20 },  // Clustered spikes on ninth platform
                { x: 2290, y: canvas.height - 150, size: 20 }
            ],
            water: [
                { x: 1170, y: canvas.height - 151, width: 80, height: 21 }, // Water embedded in fifth platform
                { x: 1450, y: canvas.height - 251, width: 60, height: 21 }, // Water embedded in sixth platform
                { x: 2200, y: canvas.height - 151, width: 90, height: 21 }  // Water embedded in ninth platform
            ]
        }
    ];
let currentLevel = 0;

// Input
const keys = { a: false, d: false, space: false, r: false };

document.addEventListener('keydown', (e) => {
	if (e.key === 'a') keys.a = true;
	if (e.key === 'd') keys.d = true;
	if (e.key === ' ') keys.space = true; // Jump on spacebar
	if (e.key === 'r') resetLevel(); // Respawn when "R" is pressed
});
document.addEventListener('keyup', (e) => {
	if (e.key === 'a') keys.a = false;
	if (e.key === 'd') keys.d = false;
	if (e.key === ' ') keys.space = false; // Reset spacebar after jump
});

// Adjust canvas size if the window is resized
window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	initializePlayer(); // Reset player position on resize
});

// Initialize player position on the left side of the first platform
function initializePlayer() {
	const firstPlatform = LEVELS[currentLevel].platforms[0];
	ball.x = firstPlatform.x + ball.radius; // Start at the left of the platform
	ball.y = firstPlatform.y - ball.radius;
	ball.speedX = 0;
	ball.speedY = 0;
	ball.onGround = true;
}

function update() {
	// Horizontal movement
	if (keys.a) ball.speedX = -SPEED;
	else if (keys.d) ball.speedX = SPEED;
	else ball.speedX = 0;

	// Jumping with spacebar
	if (keys.space && ball.onGround) {
		ball.speedY = JUMP_STRENGTH; // Set an upward speed
		ball.onGround = false; // Ensure jump happens only when grounded
	}

	// Apply gravity to bring the ball back down after jumping
	ball.speedY += GRAVITY;

	// Move the ball
	ball.x += ball.speedX;
	ball.y += ball.speedY;

	// Check collisions
	checkCollisions();

	// Draw the game
	draw();

	// Loop
	requestAnimationFrame(update);
}

function checkCollisions() {
	const level = LEVELS[currentLevel];

	// Reset ground state
	ball.onGround = false;

	// Platform collision detection
	level.platforms.forEach((platform) => {
		// Check if the ball is above the platform and falling onto it
		if (
			ball.x > platform.x - ball.radius &&
			ball.x < platform.x + platform.width + ball.radius &&
			ball.y + ball.radius >= platform.y &&
			ball.y - ball.radius < platform.y + platform.height
		) {
			// Stop the fall when landing on top of the platform
			if (ball.speedY > 0) {
				ball.speedY = 0;
				ball.onGround = true;
				ball.y = platform.y - ball.radius; // Place ball on top of the platform
			}
		}
	});

	// Spike collision (game over condition)
	level.spikes.forEach((spike) => {
		// Check if the ball is within the horizontal bounds of the spike
		if (ball.x > spike.x && ball.x < spike.x + spike.size) {
			// Check if the ball's bottom edge is within the triangular spike area
			const spikePeakY = spike.y - spike.size; // Y-coordinate of the triangle's peak
			const spikeBaseY = spike.y;
			const spikeSlope = (spikeBaseY - spikePeakY) / (spike.size / 2);

			// Calculate the ball's effective height at its x-position over the spike
			const distanceFromPeak = Math.abs(ball.x - (spike.x + spike.size / 2));
			const spikeHeightAtX = spikeBaseY - distanceFromPeak * spikeSlope;

			if (ball.y + ball.radius > spikeHeightAtX) {
				resetLevel();
			}
		}
	});

	// Water collision (game over condition)
	level.water.forEach((water) => {
		if (
			ball.x > water.x &&
			ball.x < water.x + water.width &&
			ball.y + ball.radius > water.y &&
			ball.y - ball.radius < water.y + water.height
		) {
			resetLevel();
		}
	});

	// Boundary check
	if (ball.x - ball.radius < 0) ball.x = ball.radius;
	if (ball.x + ball.radius > canvas.width) ball.x = canvas.width - ball.radius;
}

function resetLevel() {
	initializePlayer(); // Respawn at the initial position on the left of the platform
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the ball
	ctx.fillStyle = 'blue';
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fill();

	// Draw level objects
	const level = LEVELS[currentLevel];

	// Platforms
	ctx.fillStyle = 'gray';
	level.platforms.forEach((platform) => {
		ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
	});

	// Triangular spikes on top of platforms
	ctx.fillStyle = 'red';
	level.spikes.forEach((spike) => {
		ctx.beginPath();
		ctx.moveTo(spike.x, spike.y); // Bottom left of the triangle
		ctx.lineTo(spike.x + spike.size / 2, spike.y - spike.size); // Top of the triangle
		ctx.lineTo(spike.x + spike.size, spike.y); // Bottom right of the triangle
		ctx.closePath();
		ctx.fill();
	});

	// Water embedded in platforms, 1 pixel higher for accurate collision
	ctx.fillStyle = 'cyan';
	level.water.forEach((water) => {
		const platform = level.platforms.find(
			(p) => p.x <= water.x && p.x + p.width >= water.x + water.width
		);
		if (platform) {
			water.y = platform.y - 1; // Set water 1 pixel above the platform's top edge
			water.height = platform.height; // Set water height to match the platform
		}
		ctx.fillRect(water.x, water.y, water.width, water.height);
	});
}

// Start the game
initializePlayer();
update();
