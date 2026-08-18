# LX Workspace

Personal Dev Container template for the LX development environment.

## Template contents

- Ubuntu 22.04
- Node.js 22
- Pixi
- Python tooling through the target project's `pixi.toml`
- Codex CLI and Claude Code setup
- NVIDIA GPU support
- Personal host configuration mounts

## Template option

`ProjectName` is used to isolate the persistent Claude project and session volumes.

This template intentionally does not run `pixi install`; the target project's environment can be installed separately when needed.
