# SPEAR Lab Backend

This is the backend for the SPEAR Lab symbolic physics platform. It provides a FastAPI server with endpoints for manipulating the symbolic grid, running recursion steps, and accessing scientific metrics.

## Endpoints
- `/grid` (GET): Get current grid state and metrics
- `/grid/set` (POST): Set a cell value
- `/grid/reset` (POST): Reset grid to neutral
- `/grid/size/{n}` (POST): Resize grid
- `/grid/step` (POST): Advance one recursion step
- `/grid/seed` (POST): Set seed pattern (Chaos/Genesis)
- `/metrics` (GET): Get metrics, entropy, etc.
- `/grid/import` (POST): Import a saved grid
- `/grid/export` (GET): Export current grid

## Running

Install dependencies:
```
pip install -r requirements.txt
```

Run the server:
```
uvicorn main:app --reload
```
