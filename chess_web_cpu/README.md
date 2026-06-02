# Client-Side Chess vs CPU

A browser chess game where the human plays White and the CPU plays Black. The chess rules and CPU engine run entirely in JavaScript on the user's device, so the project can be hosted as a static website.

## Run

Open `index.html` in a browser.

You can also publish this folder with GitHub Pages. The top-level `index.html` is the static site entry point.

## Features

- No Python server required for the playable site
- Legal move generation and validation
- Check, checkmate, and stalemate detection
- Castling, en passant, and promotion
- CPU depth selector from 1 to 10
- Optional evaluation display where positive means White is better and negative means Black is better
- Improved SVG chess pieces
- Move highlighting and piece movement animation

## Engine

The JavaScript CPU keeps the same basic ideas as the original Python engine:

- minimax
- alpha-beta pruning
- move ordering
- quiescence search
- iterative deepening
- transposition table
- safety time cutoff

Evaluation is from Black's perspective:

- positive score means Black is better
- negative score means White is better

The evaluation considers material, piece-square tables, mobility, center control, pawn structure, king safety, checks, checkmate, and stalemate.

## Files

```text
index.html
README.md
static/
  css/style.css
  js/app.js
```
