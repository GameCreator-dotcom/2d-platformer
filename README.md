# 2D Platformer

A small browser platformer built with HTML, CSS, and the Canvas API. Move and jump across procedurally generated platforms, then reach the flag to advance. Levels continue until you run out of lives.

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

## Lives and Restarts

You can fall twice and press **R** to retry the current level. On the third fall, the game shows **GAME OVER**. Press **R** to start a fresh run and reset the death count. Each level is generated with a new platform layout, and a new run avoids layouts from the previous run.

## Project Files

- `index.html` contains the game page and canvas.
- `style.css` styles the page.
- `game.js` handles player movement, platform collisions, and drawing the game.
