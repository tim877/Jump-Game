const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to fill the entire window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let ball = { x: 0, y: 0, radius: 15, speedX: 0, speedY: 0, onGround: false };
let cameraOffset = 0;
let respawnCount = 0;
let godMode = false;
let timerStart = null;
let finalTime = null;
let timerStarted = false;
let showResult = false; // Track if the result screen is showing
const GRAVITY = 0.3,
	JUMP_STRENGTH = -12,
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
			{ x: 2250, y: canvas.height - 150, width: 200, height: 20 },
			{ x: 2500, y: canvas.height - 250, width: 200, height: 20 },
			{ x: 2750, y: canvas.height - 200, width: 150, height: 20 },
			{ x: 3000, y: canvas.height - 300, width: 200, height: 20 },
			{ x: 3300, y: canvas.height - 250, width: 200, height: 20 },
			{ x: 3600, y: canvas.height - 200, width: 200, height: 20 },
			{ x: 3900, y: canvas.height - 150, width: 150, height: 20 },
			{ x: 4200, y: canvas.height - 300, width: 200, height: 20 },
			{ x: 4500, y: canvas.height - 250, width: 200, height: 20 },
			{ x: 4800, y: canvas.height - 150, width: 200, height: 20 },
			{ x: 5100, y: canvas.height - 250, width: 200, height: 20 },
			{ x: 5400, y: canvas.height - 300, width: 200, height: 20 },
			{ x: 5700, y: canvas.height - 200, width: 200, height: 20 },
			{ x: 6000, y: canvas.height - 150, width: 200, height: 20 },
			{ x: 6300, y: canvas.height - 250, width: 200, height: 20 },
			{ x: 6600, y: canvas.height - 350, width: 200, height: 20 },
			{ x: 6900, y: canvas.height - 200, width: 200, height: 20 },
			{ x: 7200, y: canvas.height - 150, width: 200, height: 20 },
			{ x: 7500, y: canvas.height - 250, width: 200, height: 20 },
			{ x: 7800, y: canvas.height - 300, width: 200, height: 20 },
			{ x: 8100, y: canvas.height - 200, width: 200, height: 20 },
			{ x: 8400, y: canvas.height - 150, width: 200, height: 20 },
			{ x: 8700, y: canvas.height - 250, width: 200, height: 20 },
			{ x: 9000, y: canvas.height - 350, width: 200, height: 20 },
			{ x: 9300, y: canvas.height - 200, width: 200, height: 20 },
			{ x: 9600, y: canvas.height - 150, width: 200, height: 20 },
			{ x: 9900, y: canvas.height - 300, width: 200, height: 20 },
			{ x: 10200, y: canvas.height - 250, width: 200, height: 20 },
			{ x: 10500, y: canvas.height - 200, width: 200, height: 20 },
		],
		spikes: [
			{ x: 120, y: canvas.height - 100, size: 20 },
			{ x: 340, y: canvas.height - 200, size: 20 },
			{ x: 650, y: canvas.height - 300, size: 20 },
			{ x: 950, y: canvas.height - 200, size: 20 },
			{ x: 1180, y: canvas.height - 150, size: 20 },
			{ x: 1420, y: canvas.height - 250, size: 20 },
			{ x: 1760, y: canvas.height - 350, size: 20 },
			{ x: 2100, y: canvas.height - 200, size: 20 },
			{ x: 2330, y: canvas.height - 150, size: 20 },
			{ x: 2580, y: canvas.height - 250, size: 20 },
			{ x: 2780, y: canvas.height - 200, size: 20 },
			{ x: 3030, y: canvas.height - 300, size: 20 },
			{ x: 3350, y: canvas.height - 250, size: 20 },
			{ x: 3680, y: canvas.height - 200, size: 20 },
			{ x: 3910, y: canvas.height - 150, size: 20 },
			{ x: 4250, y: canvas.height - 300, size: 20 },
			{ x: 4520, y: canvas.height - 250, size: 20 },
			{ x: 4850, y: canvas.height - 150, size: 20 },
			{ x: 5120, y: canvas.height - 250, size: 20 },
			{ x: 5450, y: canvas.height - 300, size: 20 },
			{ x: 5730, y: canvas.height - 200, size: 20 },
			{ x: 6030, y: canvas.height - 150, size: 20 },
			{ x: 6320, y: canvas.height - 250, size: 20 },
			{ x: 6650, y: canvas.height - 350, size: 20 },
			{ x: 6930, y: canvas.height - 200, size: 20 },
			{ x: 7230, y: canvas.height - 150, size: 20 },
			{ x: 7530, y: canvas.height - 250, size: 20 },
			{ x: 7850, y: canvas.height - 300, size: 20 },
			{ x: 8120, y: canvas.height - 200, size: 20 },
			{ x: 8450, y: canvas.height - 150, size: 20 },
			{ x: 8750, y: canvas.height - 250, size: 20 },
			{ x: 9050, y: canvas.height - 350, size: 20 },
			{ x: 9320, y: canvas.height - 200, size: 20 },
			{ x: 9630, y: canvas.height - 150, size: 20 },
		],
        water: [
            { x: 110, y: canvas.height - 101, width: 80, height: 21 },  // Platform at x: 50, width: 200
            { x: 650, y: canvas.height - 301, width: 80, height: 21 },  // Platform at x: 600, width: 200
            { x: 1180, y: canvas.height - 151, width: 80, height: 21 }, // Platform at x: 1150, width: 200
            { x: 1760, y: canvas.height - 351, width: 80, height: 21 }, // Platform at x: 1700, width: 200
            { x: 2580, y: canvas.height - 251, width: 80, height: 21 }, // Platform at x: 2500, width: 200
            { x: 3380, y: canvas.height - 251, width: 80, height: 21 }, // Platform at x: 3300, width: 200
            { x: 4850, y: canvas.height - 151, width: 80, height: 21 }, // Platform at x: 4800, width: 200
            { x: 5730, y: canvas.height - 201, width: 80, height: 21 }, // Platform at x: 5700, width: 200
            { x: 6320, y: canvas.height - 251, width: 80, height: 21 }, // Platform at x: 6300, width: 200
            { x: 7230, y: canvas.height - 151, width: 80, height: 21 }, // Platform at x: 7200, width: 200
            { x: 8450, y: canvas.height - 151, width: 80, height: 21 }, // Platform at x: 8400, width: 200
            { x: 9630, y: canvas.height - 151, width: 80, height: 21 }  // Platform at x: 9600, width: 200
        ],
		finish: { x: 10650, y: canvas.height - 250, width: 50, height: 50 }, // Finish block
	},
];

// Input
const keys = { a: false, d: false, space: false, r: false };

document.addEventListener('keydown', (e) => {
	if (e.key === 'a') keys.a = true;
	if (e.key === 'd') keys.d = true;
	if (e.key === ' ') keys.space = true;
	if (e.key === 'r') resetLevel();
	if (e.key === 'g') godMode = !godMode;
});
document.addEventListener('keyup', (e) => {
	if (e.key === 'a') keys.a = false;
	if (e.key === 'd') keys.d = false;
	if (e.key === ' ') keys.space = false;
});

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	initializePlayer();
});

function initializePlayer() {
	const firstPlatform = LEVELS[0].platforms[0];
	ball.x = firstPlatform.x + ball.radius;
	ball.y = firstPlatform.y - ball.radius;
	ball.speedX = 0;
	ball.speedY = 0;
	ball.onGround = true;
	startTimer();
	showResult = false; // Hide result screen on respawn
}

function startTimer() {
	timerStart = null;
	finalTime = null;
	timerStarted = false;
}

function update() {
	if (showResult) return; // Stop updating when result is displayed

	if ((keys.a || keys.d) && !timerStarted) {
		timerStart = performance.now();
		timerStarted = true;
	}

	if (keys.a) ball.speedX = -SPEED;
	else if (keys.d) ball.speedX = SPEED;
	else ball.speedX = 0;

	if (keys.space && ball.onGround) {
		ball.speedY = JUMP_STRENGTH;
		ball.onGround = false;
	}

	ball.speedY += GRAVITY;
	ball.x += ball.speedX;
	ball.y += ball.speedY;

	if (ball.y > canvas.height) {
		resetLevel();
	}

	cameraOffset = Math.max(ball.x - canvas.width / 2, 0);

	checkCollisions();
	draw();

	requestAnimationFrame(update);
}

function checkCollisions() {
	const level = LEVELS[0];
	ball.onGround = false;

	level.platforms.forEach((platform) => {
		const adjustedX = platform.x - cameraOffset;

		if (
			ball.x > platform.x - ball.radius &&
			ball.x < platform.x + platform.width + ball.radius &&
			ball.y + ball.radius >= platform.y &&
			ball.y - ball.radius < platform.y + platform.height
		) {
			if (ball.speedY > 0) {
				ball.speedY = 0;
				ball.onGround = true;
				ball.y = platform.y - ball.radius;
			}
		}
	});

	if (!godMode) {
		level.spikes.forEach((spike) => {
			const adjustedX = spike.x - cameraOffset;
			if (ball.x > spike.x && ball.x < spike.x + spike.size) {
				const spikePeakY = spike.y - spike.size;
				const spikeBaseY = spike.y;
				const spikeSlope = (spikeBaseY - spikePeakY) / (spike.size / 2);
				const distanceFromPeak = Math.abs(ball.x - (spike.x + spike.size / 2));
				const spikeHeightAtX = spikeBaseY - distanceFromPeak * spikeSlope;

				if (ball.y + ball.radius > spikeHeightAtX) {
					resetLevel();
				}
			}
		});

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
	}

	const finish = level.finish;
	if (
		ball.x + ball.radius > finish.x &&
		ball.x - ball.radius < finish.x + finish.width &&
		ball.y + ball.radius > finish.y &&
		ball.y - ball.radius < finish.y + finish.height
	) {
		stopTimer();
	}
}

function stopTimer() {
	if (timerStart) {
		finalTime = ((performance.now() - timerStart) / 1000).toFixed(2);
		showResult = true; // Show result screen
	}
}

function resetLevel() {
	initializePlayer();
	cameraOffset = 0;
	respawnCount++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw HUD elements only if result screen is not showing
    if (!showResult) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Respawns: ${respawnCount}`, 10, 30);
        ctx.fillText(`God Mode: ${godMode ? 'ON' : 'OFF'}`, 10, 60);

        // Instructions in the top right
        ctx.textAlign = 'right';
        ctx.fillText("Press 'R' to Respawn", canvas.width - 10, 30);
        ctx.fillText("Press 'G' for God Mode", canvas.width - 10, 60);
        ctx.textAlign = 'left';  // Reset text alignment for future text
    }

    // Draw the ball
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(ball.x - cameraOffset, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw level objects
    const level = LEVELS[0];
    ctx.fillStyle = 'gray';
    level.platforms.forEach((platform) => {
        ctx.fillRect(
            platform.x - cameraOffset,
            platform.y,
            platform.width,
            platform.height
        );
    });

    ctx.fillStyle = 'red';
    level.spikes.forEach((spike) => {
        ctx.beginPath();
        ctx.moveTo(spike.x - cameraOffset, spike.y);
        ctx.lineTo(spike.x - cameraOffset + spike.size / 2, spike.y - spike.size);
        ctx.lineTo(spike.x - cameraOffset + spike.size, spike.y);
        ctx.closePath();
        ctx.fill();
    });

    ctx.fillStyle = 'cyan';
    level.water.forEach((water) => {
        ctx.fillRect(water.x - cameraOffset, water.y, water.width, water.height);
    });

    ctx.fillStyle = 'green';
    const finish = level.finish;
    ctx.fillRect(finish.x - cameraOffset, finish.y, finish.width, finish.height);

    // Show result screen if level is finished
    if (showResult) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Congratulations!', canvas.width / 2, canvas.height / 2 - 50);
        ctx.fillText(
            `Final Time: ${finalTime} seconds`,
            canvas.width / 2,
            canvas.height / 2
        );
        ctx.textAlign = 'left'; // Reset text alignment for future text
    }
}


// Start the game
initializePlayer();
update();
