# LX Workspace

Personal Dev Container template for the LX development environment.

## Template contents

- Ubuntu 22.04
- Node.js 22
- Pixi
- Python tooling through the target project's `pixi.toml`
- TeX Live (`latexmk`, PDFLaTeX, XeLaTeX, LuaLaTeX, Biber, and Chinese typesetting)
- Codex CLI, Claude Code, Grok Build, and Google Antigravity CLI (`agy`)
- NVIDIA GPU support
- Personal host configuration mounts

## Template option

`ProjectName` is used to isolate the persistent AI coding agent configuration and session volumes.

Run `agy` inside the container to complete Antigravity's first-launch setup. Its settings,
customizations, and session metadata are persisted in the project-specific Antigravity volume.

Codex, Claude Code, and Antigravity are preconfigured to show subscription quota remaining in
their terminal status lines. Quota values appear after the agent receives its first response and
only when the selected authentication method exposes subscription limits.

This template intentionally does not run `pixi install`; the target project's environment can be installed separately when needed.
