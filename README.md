# JavaScript Platformer Game

This is a simple platformer game created in JavaScript with HTML Canvas. The game involves navigating a ball character across a series of platforms, spikes, and water hazards to reach the finish line.

## How to Play

- Use the **A** key to move left.
- Use the **D** key to move right.
- Press the **Spacebar** to jump.
- Press **R** to respawn if needed.
- Press **G** to toggle **God Mode**.

The game ends when you reach the green finish platform. The player's final time is displayed, and a respawn count is tracked for each attempt.

## Features

- **Dynamic Platforms**: Various platforms across the canvas for the player to jump and move across.
- **Hazards**: Spikes and water regions that reset the player if touched.
- **HUD**: Displays the number of respawns, and whether God Mode is active.
- **Finish Block**: Reaching this block completes the game.

## Code Structure

- **HTML Canvas Setup**: The `canvas` element fills the window, dynamically resizing on changes.
- **Game Variables**: Control player attributes, physics, and game states.
- **Level Design**: Contains platforms, spikes, water hazards, and finish block data.
- **Collision Detection**: Handles collisions with platforms, spikes, water, and finish blocks.
- **Update Loop**: Continuously updates game state, checks for collisions, and renders elements on the canvas.

## Installation & Running

1. Clone or download the repository.
2. Open the `index.html` file in your web browser to play the game.

## Controls

| Key   | Action          |
| ----- | --------------- |
| A     | Move Left       |
| D     | Move Right      |
| Space | Jump            |
| R     | Respawn         |
| G     | Toggle God Mode |

Enjoy the game!
