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

Codex, Claude Code, Grok, and Antigravity are preconfigured to show token usage, context-window usage,
and subscription quota remaining in their terminal status lines. Codex reports cumulative session
tokens; Claude Code, Grok, and Antigravity report the input/output tokens currently represented by
their latest context-window payload. Values appear after the agent receives its first response, and
quota values only appear when the selected authentication method exposes subscription limits.

This template intentionally does not run `pixi install`; the target project's environment can be installed separately when needed.
