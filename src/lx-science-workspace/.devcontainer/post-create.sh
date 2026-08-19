#!/usr/bin/env bash
set -euxo pipefail

npm config set proxy "$HTTP_PROXY"
npm config set https-proxy "$HTTPS_PROXY"
npm config set fetch-timeout 60000
npm config set fetch-retries 2

npm install -g \
  @openai/codex \
  @anthropic-ai/claude-code \
  --foreground-scripts \
  --loglevel verbose

npx --yes skills add HappyEpicDragon/research_memory --skill '*' -y
npx --yes skills add HappyEpicDragon/paper-deconstruct -y
