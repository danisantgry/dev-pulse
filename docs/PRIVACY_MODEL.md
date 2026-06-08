# Privacy Model

`dev-pulse` is intended to be local-only developer diagnostics.

## Local Scope

- The app binds to localhost.
- Reports are generated on the machine running the server.
- No login, analytics, or remote service is required.
- The copy-report action copies data to the local clipboard only.

## Report Contents

The report can include:

- operating system and hostname
- CPU and memory summary
- Node, npm, Git, and Docker availability
- common localhost port status
- top local processes by memory

## Sensitive Data Guidance

Diagnostic reports can still reveal machine names, process names, and local tool availability. Review copied reports before sharing them in public issues.

## Non-Goals

- It does not monitor users remotely.
- It does not persist historical telemetry.
- It does not send reports to a third-party endpoint.
