# Contributing to dev-pulse

Thanks for considering a contribution. `dev-pulse` is a local diagnostics dashboard, so changes should be privacy-conscious and easy to verify.

## Local Setup

```bash
npm install
npm run lint
npm run build
npm test
```

## Contribution Ideas

- Add configurable port checks.
- Add Markdown report export.
- Improve process and tool detection across operating systems.
- Add tests for report shape and failure handling.

## Privacy Guidelines

- Do not add telemetry, analytics, or remote collection.
- Avoid exposing sensitive local paths or environment variables.
- Keep diagnostics local by default.
