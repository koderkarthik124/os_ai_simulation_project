# OS Lab — Interactive Deadlock Simulator

An interactive, visual simulator for teaching Operating Systems concepts through Resource Allocation Graphs (RAGs), live deadlock detection, and an AI Tutor that explains the graph state in plain English.

## What It Does

Students drag **Process nodes** (blue circles) and **Resource nodes** (green squares) onto an infinite canvas and connect them with two edge types that define a classic OS Resource Allocation Graph:

- **Request edges** (Process → Resource, blue)
- **Allocation edges** (Resource → Process, orange)

On every change, a **DFS-based cycle-detection algorithm** re-scans the graph in real time and flags whether the system is in a **SAFE STATE** or has entered **DEADLOCK**. Nodes caught in a deadlock cycle glow red; safe nodes glow green — turning an abstract graph-theory result into an instant, intuitive signal.

### Right Panel

- **Props** — inspector for the selected node
- **Analysis** — a structured breakdown (deadlocked yes/no, which nodes are stuck in the cycle)
- **AI Tutor** — sends the current graph state to the backend, which returns a natural-language explanation of the allocations, the requests, why the system is stuck (mapped to the four necessary conditions for deadlock — mutual exclusion, hold-and-wait, no preemption, circular wait), and one concrete strategy to break the cycle

### Toolbar & Status Bar

- Reset, Export/Import, and manual "Analyze"
- Live counts for processes, resources, edges, and current state
- "Auto Generate" panel to spin up a random graph for quick exploration

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite, Tailwind CSS v4, [@xyflow/react](https://reactflow.dev/) (React Flow) for the canvas, Zustand for state management
- **Backend:** Python FastAPI serving a `/api/analyze-deadlock` endpoint that builds a pedagogical explanation — it has a hook for a real LLM (OpenAI/Gemini key) but works fully offline via a deterministic rule-based fallback, so the demo never breaks without an API key or internet access
- **Core algorithm:** Depth-first search cycle detection over the directed process↔resource graph — the same theoretical model taught in every OS course, made interactive

## Running the Project

### Prerequisites

- Node.js
- Python 3.13 (a `.venv` is already set up with `fastapi` + `uvicorn` installed)

### Backend

```bash
cd backend
../.venv/Scripts/python -m uvicorn main:app --reload --port 8000
```

Runs at `http://localhost:8000` (health check: `GET /api/health`).

### Frontend

```bash
cd frontend
npm install   # if not already installed
npm run dev
```

Runs at `http://localhost:5173` — open that in a browser.

> Start the backend first (or at least before clicking "Explain" in the AI Tutor tab) since the frontend calls `http://localhost:8000/api/analyze-deadlock` directly.

### Production Build Check

```bash
cd frontend
npm run build   # tsc -b && vite build
```

## How It Relates to Education

Deadlock and resource allocation are core topics in every Operating Systems course, but they're usually taught through static diagrams and dry proofs (Banker's algorithm tables, wait-for graphs on a whiteboard). Students memorize the four necessary conditions without *seeing* them happen. This project closes that gap:

- **Learn by building, not memorizing.** Students construct the exact scenario they're confused about — "what if two processes each hold what the other wants?" — and get an immediate, visual answer instead of working it out on paper.
- **Immediate feedback loop.** The red/green glow and SAFE/DEADLOCK badge turn an abstract graph-theory result (a cycle in a directed graph) into an instant, intuitive signal — the same "aha" you get from a sorting-algorithm visualizer.
- **Connects theory to plain language.** The AI Tutor tab explicitly maps the drawn graph back to the textbook conditions (mutual exclusion, hold-and-wait, no preemption, circular wait) and suggests a concrete fix, reinforcing terminology rather than just showing a red graph.
- **Low floor, high ceiling.** A beginner can drag two nodes and connect them to see their first deadlock in under 30 seconds; an instructor can use "Auto Generate" to produce larger graphs for discussing more complex resource contention scenarios in lecture.
- **Extensible teaching tool.** The architecture (pluggable analysis endpoint, typed graph model) is built to grow into other OS units — e.g., Banker's algorithm for deadlock avoidance, CPU scheduling visualizers, or paging/memory simulators — using the same node/edge canvas pattern.

## Project Structure

```
backend/
  main.py                  FastAPI server: deadlock graph analysis + AI Tutor explanation endpoint
frontend/
  src/
    algorithms/
      deadLockDetection.ts DFS-based cycle detection over the resource allocation graph
    components/Canvas/
      SimulatorCanvas.tsx  React Flow canvas (drag/drop, connections, live analysis panel)
      Nodes.tsx            Process/Resource node renderers
      Layout/               Toolbar, Sidebar, RightPanel, StatusBar
    pages/deadLockSimulator.tsx  Top-level page layout
    services/api.ts        Client for the backend analysis endpoint
    store/useOSStore.ts    Zustand store: graph state, connect/change handlers, analysis
```

See [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for a 5-minute demo video walkthrough.
