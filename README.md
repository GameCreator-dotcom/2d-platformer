# 2D Platformer

A keyboard-controlled browser platformer built with HTML, CSS, and the Canvas API. Choose a detailed pixel-art character, jump across procedurally generated platforms, reach the flag, and keep going through an endless sequence of levels.

## Run the Game

Open `index.html` in a web browser. No installation or build step is required.

The starting screen has two tabs:

- **Play** contains the **Start** button.
- **Characters** contains 20 selectable pixel-art characters, including animals, humans, monsters, and fantasy characters. The selected character is highlighted and appears as the player in the game.

Select a character before choosing **Start**. Use **Quit** at the top of the game screen to return to the menu and choose another character.

## Controls

| Action | Keys |
| --- | --- |
| Move left | A or Left Arrow |
| Move right | D or Right Arrow |
| Jump | W, Up Arrow, or Space |
| Retry or restart | R (after losing a life or at game over) |
| Advance to the next level | Reach the flag |

The menu tabs and character cards can also be used with the keyboard. Focus a character card and press **Enter** or **Space** to select it.

## How Runs Work

- Reach the flag to clear the level and continue to the next one.
- You start each run with three lives, shown as hearts in the top-right corner. Each fall costs one life.
- Press **R** after losing a life to retry the current level.
- Losing all three lives ends the run. Press **R** at game over to start again with a fresh set of layouts and three lives. Layouts encountered in the previous run are not reused.
- Select **Quit** to leave the active game and return to the starting screen.

## Features

- 20 selectable characters with detailed pixel-art portraits
- Character-specific colors and visual details in the playable sprite
- Responsive starting screen for desktop and mobile browsers
- Keyboard-accessible tabs and character selection
- Procedurally generated platform layouts that continue across levels

## Project Files

- `index.html` contains the starting menu, character roster, game screen, and canvas.
- `style.css` styles the menu, pixel-art character portraits, responsive layout, and game screen.
- `game.js` handles character selection, menu tabs, game flow, player movement, platform collisions, lives, level generation, and Canvas drawing.
