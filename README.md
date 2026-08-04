# nexus-mes-platform

Full-stack MES simulating ISA-95 production workflows — SAP-style integration to real-time shop floor tracking.

Backend + React dashboards for planning and execution. The operator HMI lives in a separate repo: [`nexus-mes-hmi`](https://github.com/Toqa-Ashraf8/nexus-mes-hmi.git).

## Architecture

```mermaid
flowchart TB
    SAP["SAP simulation<br/>(XML drop folder)"] --> Watcher["Background service"]
    Watcher --> DB[(SQL Server)]
    DB <--> API[".NET Core Web API"]
    API <--> React["React + Redux"]
    API <--> HMI["nexus-mes-hmi<br/>(separate repo)"]

    style SAP fill:#f5e8dc,stroke:#c98a4b
    style DB fill:#e6f1fb,stroke:#378ADD
    style React fill:#eaf3de,stroke:#639922
    style HMI fill:#fbeaf0,stroke:#d4537e
```

## Data flow

```mermaid
sequenceDiagram
    participant Eng as Engineer
    participant API as MES API
    participant Op as Operator (HMI)
    participant Sup as Supervisor

    Eng->>API: Define & release routing
    API->>API: Generate dispatch list
    Op->>API: RFID login (work-center scoped)
    API-->>Op: Assigned operation (if certified)
    Op->>API: Start / complete
    API-->>Sup: Live WIP update
```

## Scope

Built end-to-end:
- SAP integration simulation (`FileSystemWatcher` + XML)
- Process Definition & Routing (draft → approve → release, versioned)
- Dispatch List
- Live WIP Tracking
- Work-center-scoped operator certification checks

Later phase: Quality inspection, Reporting/analytics.

## Stack

.NET Core Web API · EF Core (Repository pattern) · SQL Server · React + Redux Toolkit

## Notable decisions

- **File-based SAP integration** — mirrors real plants without live ERP API access; handles file locking, idempotency, error recovery.
- **Routing versioning** — work orders reference the exact released version (engineering change management).
- **Work-center-scoped dispatch** — operators see only their station's task, never the full schedule.

## Run

```bash
cd src/Api && dotnet ef database update && dotnet run
cd src/client && npm install && npm run dev
```
