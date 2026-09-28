# 2D Platformer

A keyboard-controlled browser platformer built with HTML, CSS, and the Canvas API. Jump across procedurally generated platforms, reach the flag, and keep going through an endless sequence of levels.

## Run the Game

Open `index.html` in a web browser. No installation or build step is required.

The starting screen has a **Play** tab with a **Start** button. The **Characters** tab is a placeholder for a future feature. Select **Start** to begin playing, or use **Quit** at the top of the game screen to return to the menu.

## Controls

| Action | Keys |
| --- | --- |
| Move left | A or Left Arrow |
| Move right | D or Right Arrow |
| Jump | W, Up Arrow, or Space |
| Retry or restart | R (after losing a life or at game over) |
| Advance to the next level | Reach the flag |

## How Runs Work

- Reach the flag to clear the level and continue to the next one.
- You start each run with three lives, shown as hearts in the top-right corner. Each fall costs one life.
- Press **R** after losing a life to retry the current level.
- Losing all three lives ends the run. Press **R** at game over to start again with a fresh set of layouts and three lives. Layouts encountered in the previous run are not reused.
- Select **Quit** to leave the active game and return to the starting screen.

## Project Files

- `index.html` contains the starting menu, game screen, and canvas.
- `style.css` styles the page.
- `game.js` handles the menu tabs, game flow, player movement, platform collisions, lives, and drawing.
