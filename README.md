# dev-pulse

`dev-pulse` is a private local dashboard for checking machine health and developer environment status. It runs on your own computer, exposes no remote analytics, and gives you a quick report you can copy into issues, support tickets, or setup notes.

## Features

- Local web dashboard for CPU, memory, uptime, platform, and hostname.
- Checks common dev tools: Node, npm, Git, and Docker.
- Shows common localhost ports and top memory processes.
- Copy full diagnostic report as JSON.
- No login, no cloud service, no telemetry.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:4177
```

## Build and Preview

```bash
npm run build
npm run preview
```

## API

`GET /api/report` returns a JSON report with system, tools, ports, and process data.

## Roadmap

- Export Markdown reports.
- Optional Docker and database health checks.
- Configurable port list.
