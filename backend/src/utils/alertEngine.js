export function checkAlerts(data) {
  const alerts = [];

  if (data.type === "voltage" && data.value > 135) {
    alerts.push({
      message: "⚠ Over Voltage Detected",
      severity: "high",
    });
  }

  if (data.type === "current" && data.value > 240) {
    alerts.push({
      message: "⚠ Over Current Flow",
      severity: "medium",
    });
  }

  if (data.type === "temperature" && data.value > 65) {
    alerts.push({
      message: "🔥 Transformer Overheating",
      severity: "critical",
    });
  }

  if (data.type === "breaker_status" && data.value === 0) {
    alerts.push({
      message: "🟥 Breaker Open — Possible Fault",
      severity: "high",
    });
  }

  return alerts;
}
