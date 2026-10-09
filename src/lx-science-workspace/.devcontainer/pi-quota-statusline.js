// Bridges PI Coding Agent into the shared agent-quota-statusline script.
//
// Pi has no `statusLine` command setting; footer status comes from extensions
// via ctx.ui.setStatus(). This maps Pi's own usage data into the payload shape
// the script already understands, so every agent renders quota the same way.

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const SCRIPT = process.env.AGENT_QUOTA_STATUSLINE || "/usr/local/bin/agent-quota-statusline";
const STATUS_KEY = "quota";

export default function (pi) {
  const refresh = (ctx) => {
    if (!ctx?.hasUI || !ctx.ui?.setStatus || !existsSync(SCRIPT)) {
      return;
    }

    const totals = sumUsage(ctx);
    const context = typeof ctx.getContextUsage === "function" ? ctx.getContextUsage() : undefined;

    const payload = {
      context_window: {
        total_input_tokens: totals.input,
        total_output_tokens: totals.output,
        current_usage: {
          input_tokens: totals.lastInput,
          output_tokens: totals.lastOutput,
          cache_creation_input_tokens: totals.lastCacheWrite,
          cache_read_input_tokens: totals.lastCacheRead,
        },
        used_percentage: context?.percent ?? undefined,
        context_window_size: context?.contextWindow ?? undefined,
      },
    };

    const result = spawnSync("node", [SCRIPT], {
      input: JSON.stringify(payload),
      encoding: "utf8",
      timeout: 2000,
    });

    const line = (result?.stdout ?? "").trim();
    ctx.ui.setStatus(STATUS_KEY, line.length > 0 ? line : undefined);
  };

  pi.on("session_start", async (event, ctx) => refresh(ctx));
  pi.on("turn_end", async (event, ctx) => refresh(ctx));
}

// Pi records usage on `usage` entries and on assistant/tool-result messages.
// Fields are input / output / cacheRead / cacheWrite per the session schema.
function sumUsage(ctx) {
  const totals = {
    input: 0,
    output: 0,
    lastInput: 0,
    lastOutput: 0,
    lastCacheWrite: 0,
    lastCacheRead: 0,
  };

  let entries = [];
  try {
    entries = ctx.sessionManager?.getEntries?.() ?? [];
  } catch {
    return totals;
  }

  for (const entry of entries) {
    const usage =
      entry?.type === "usage"
        ? entry.usage
        : entry?.message?.role === "assistant" || entry?.message?.role === "toolResult"
          ? entry.message.usage
          : undefined;

    if (!usage) {
      continue;
    }

    totals.input += num(usage.input);
    totals.output += num(usage.output);
    totals.lastInput = num(usage.input);
    totals.lastOutput = num(usage.output);
    totals.lastCacheWrite = num(usage.cacheWrite);
    totals.lastCacheRead = num(usage.cacheRead);
  }

  return totals;
}

function num(value) {
  return Number.isFinite(value) ? value : 0;
}
