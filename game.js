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
let timerStarted = false; // Track if the timer has started after movement
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
			{ x: 180, y: canvas.height - 100, size: 20 },
			{ x: 340, y: canvas.height - 200, size: 20 },
			{ x: 670, y: canvas.height - 300, size: 20 },
			{ x: 930, y: canvas.height - 200, size: 20 },
			{ x: 1550, y: canvas.height - 250, size: 20 },
			{ x: 1740, y: canvas.height - 350, size: 20 },
			{ x: 2070, y: canvas.height - 200, size: 20 },
			{ x: 2590, y: canvas.height - 250, size: 20 },
			{ x: 3080, y: canvas.height - 300, size: 20 },
			{ x: 3680, y: canvas.height - 200, size: 20 },
			{ x: 3970, y: canvas.height - 150, size: 20 },
			{ x: 4270, y: canvas.height - 300, size: 20 },
			{ x: 4580, y: canvas.height - 250, size: 20 },
			{ x: 4880, y: canvas.height - 150, size: 20 },
			{ x: 5200, y: canvas.height - 250, size: 20 },
			{ x: 5450, y: canvas.height - 300, size: 20 },
			{ x: 5750, y: canvas.height - 200, size: 20 },
			{ x: 6100, y: canvas.height - 150, size: 20 },
			{ x: 6350, y: canvas.height - 250, size: 20 },
			{ x: 6650, y: canvas.height - 350, size: 20 },
			{ x: 6980, y: canvas.height - 200, size: 20 },
			{ x: 7350, y: canvas.height - 250, size: 20 },
			{ x: 7650, y: canvas.height - 300, size: 20 },
			{ x: 7980, y: canvas.height - 200, size: 20 },
			{ x: 8250, y: canvas.height - 150, size: 20 },
			{ x: 8550, y: canvas.height - 250, size: 20 },
			{ x: 8850, y: canvas.height - 350, size: 20 },
			{ x: 9200, y: canvas.height - 200, size: 20 },
			{ x: 9550, y: canvas.height - 150, size: 20 },
			{ x: 9800, y: canvas.height - 300, size: 20 },
			{ x: 10150, y: canvas.height - 250, size: 20 },
			{ x: 10400, y: canvas.height - 200, size: 20 },
		],
		water: [
			{ x: 1250, y: canvas.height - 151, width: 80, height: 21 },
			{ x: 1550, y: canvas.height - 251, width: 60, height: 21 },
			{ x: 2300, y: canvas.height - 151, width: 90, height: 21 },
			{ x: 2600, y: canvas.height - 251, width: 70, height: 21 },
			{ x: 3400, y: canvas.height - 251, width: 80, height: 21 },
			{ x: 4250, y: canvas.height - 301, width: 100, height: 21 },
			{ x: 4750, y: canvas.height - 151, width: 80, height: 21 },
			{ x: 5250, y: canvas.height - 251, width: 90, height: 21 },
			{ x: 6050, y: canvas.height - 151, width: 70, height: 21 },
			{ x: 6450, y: canvas.height - 251, width: 80, height: 21 },
			{ x: 7150, y: canvas.height - 151, width: 90, height: 21 },
			{ x: 7800, y: canvas.height - 301, width: 100, height: 21 },
			{ x: 8400, y: canvas.height - 151, width: 80, height: 21 },
			{ x: 8900, y: canvas.height - 251, width: 90, height: 21 },
			{ x: 9500, y: canvas.height - 151, width: 80, height: 21 },
			{ x: 10050, y: canvas.height - 251, width: 90, height: 21 },
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
}

function startTimer() {
	timerStart = null;
	finalTime = null;
	timerStarted = false; // Timer will start when player moves
}

function update() {
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

	if (ball.x - ball.radius < 0) ball.x = ball.radius;
}

function stopTimer() {
	if (timerStart) {
		finalTime = ((performance.now() - timerStart) / 1000).toFixed(2);
	}
}

function resetLevel() {
	initializePlayer();
	cameraOffset = 0;
	respawnCount++;
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = 'white';
	ctx.font = '20px Arial';
	ctx.fillText(`Respawns: ${respawnCount}`, 10, 30);
	ctx.fillText(`God Mode: ${godMode ? 'ON' : 'OFF'}`, 10, 60);

	const elapsedTime = finalTime
		? finalTime
		: timerStarted
		? ((performance.now() - timerStart) / 1000).toFixed(2)
		: '0.00';
	ctx.fillText(`Time: ${elapsedTime} seconds`, 10, 90);

	ctx.fillStyle = 'blue';
	ctx.beginPath();
	ctx.arc(ball.x - cameraOffset, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fill();

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
}

// Start the game
initializePlayer();
update();
