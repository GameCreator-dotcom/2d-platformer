# 2D Platformer

A keyboard-controlled browser platformer built with HTML, CSS, and the Canvas API. Jump across procedurally generated platforms, reach the flag, and keep going through an endless sequence of levels.

## Run the Game

Open `index.html` in a web browser. No installation or build step is required.

## Controls

| Action | Keys |
| --- | --- |
| Move left | A or Left Arrow |
| Move right | D or Right Arrow |
| Jump | W, Up Arrow, or Space |
| Retry or restart | R (after falling) |
| Advance to the next level | Reach the flag |

## How Runs Work

- Reach the flag to clear the level and continue to the next one.
- You get three falls per run. Press **R** after the first two falls to retry the current level.
- The third fall ends the run. Press **R** at game over to start again with a fresh set of layouts and reset the fall count. Layouts encountered in the previous run are not reused.

## Project Files

- `index.html` contains the game page and canvas.
- `style.css` styles the page.
- `game.js` handles player movement, platform collisions, and drawing the game.
