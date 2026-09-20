#!/usr/bin/env node

let input = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  const payload = JSON.parse(input);
  const segments = [];

  addContextUsage(payload.context_window, segments);
  addClaudeLimits(payload.rate_limits, segments);
  addAntigravityLimits(payload.quota, segments);

  if (segments.length > 0) {
    process.stdout.write(`${segments.join(" · ")}\n`);
  }
});

function addContextUsage(contextWindow, segments) {
  if (!contextWindow || typeof contextWindow !== "object") {
    return;
  }

  const currentUsage = contextWindow.current_usage;
  const inputTokens = firstFinite(
    contextWindow.total_input_tokens,
    sumFinite(
      currentUsage?.input_tokens,
      currentUsage?.cache_creation_input_tokens,
      currentUsage?.cache_read_input_tokens,
    ),
  );
  const outputTokens = firstFinite(
    contextWindow.total_output_tokens,
    currentUsage?.output_tokens,
  );

  if (inputTokens > 0 || outputTokens > 0) {
    segments.push(
      `tokens ${formatTokenCount(inputTokens)} in/${formatTokenCount(outputTokens)} out`,
    );
  }

  const usedPercentage = firstFinite(
    contextWindow.used_percentage,
    percentageOf(inputTokens, contextWindow.context_window_size),
  );
  if (Number.isFinite(usedPercentage)) {
    segments.push(`context ${formatPercentage(usedPercentage)} used`);
  }
}

function addClaudeLimits(rateLimits, segments) {
  const windows = [
    ["five_hour", "5h"],
    ["seven_day", "7d"],
  ];

  for (const [key, label] of windows) {
    const usedPercentage = rateLimits?.[key]?.used_percentage;
    if (Number.isFinite(usedPercentage)) {
      segments.push(`${label} ${formatPercentage(100 - usedPercentage)} left`);
    }
  }
}

function addAntigravityLimits(quota, segments) {
  if (!quota || typeof quota !== "object") {
    return;
  }

  for (const [bucket, status] of Object.entries(quota)) {
    if (Number.isFinite(status?.remaining_fraction)) {
      segments.push(
        `${bucket} ${formatPercentage(status.remaining_fraction * 100)} left`,
      );
    }
  }
}

function formatPercentage(value) {
  return `${Math.round(Math.min(100, Math.max(0, value)))}%`;
}

function formatTokenCount(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return "0";
  }

  for (const [threshold, suffix] of [
    [1_000_000, "m"],
    [1_000, "k"],
  ]) {
    if (value >= threshold) {
      const scaled = Math.round((value / threshold) * 10) / 10;
      return `${scaled}${suffix}`;
    }
  }

  return `${Math.round(value)}`;
}

function firstFinite(...values) {
  return values.find(Number.isFinite);
}

function sumFinite(...values) {
  const finiteValues = values.filter(Number.isFinite);
  if (finiteValues.length === 0) {
    return undefined;
  }

  return finiteValues.reduce((total, value) => total + value, 0);
}

function percentageOf(value, total) {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return undefined;
  }

  return (value / total) * 100;
}
