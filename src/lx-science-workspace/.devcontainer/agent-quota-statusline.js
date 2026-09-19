#!/usr/bin/env node

let input = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  const payload = JSON.parse(input);
  const segments = [];

  addClaudeLimits(payload.rate_limits, segments);
  addAntigravityLimits(payload.quota, segments);

  if (segments.length > 0) {
    process.stdout.write(`${segments.join(" · ")}\n`);
  }
});

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
