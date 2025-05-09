from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from symbolic import SymbolicGrid

app = FastAPI()


origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

grid = SymbolicGrid()

class SetCellRequest(BaseModel):
    x: int
    y: int
    value: int

class SetSeedRequest(BaseModel):
    mode: str

@app.get("/grid")
def get_grid():
    return grid.export_state()

@app.post("/grid/set")
def set_cell(req: SetCellRequest):
    grid.set_cell(req.x, req.y, req.value)
    return {"success": True}

@app.post("/grid/reset")
def reset_grid():
    grid.reset()
    return {"success": True}

@app.post("/grid/size/{n}")
def set_grid_size(n: int):
    grid.set_size(n)
    return {"success": True}

@app.post("/grid/step")
def step_grid():
    grid.step()
    return grid.export_state()

@app.get("/metrics")
def get_metrics():
    return grid.metrics()

@app.post("/grid/seed")
def set_seed(req: SetSeedRequest):
    grid.set_seed(req.mode)
    return grid.export_state()

class ThresholdRequest(BaseModel):
    pos_threshold: int
    neg_threshold: int

@app.get("/grid/thresholds")
def get_thresholds():
    return grid.get_thresholds()

@app.post("/grid/thresholds")
def set_thresholds(req: ThresholdRequest):
    grid.set_thresholds(req.pos_threshold, req.neg_threshold)
    return {"success": True, **grid.get_thresholds()}

@app.post("/grid/import")
def import_grid(state: dict):
    grid.import_state(state)
    return {"success": True}

@app.get("/grid/export")
def export_grid():
    return grid.export_state()
