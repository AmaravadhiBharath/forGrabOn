import {
  Channel,
  ChannelSuccessSummary,
  CopyVariant,
  DeliveryLogEntry,
  DeliveryStatus,
  DistributeDealResult,
  DealInput,
} from "./types";

const BASE_SUCCESS_RATE: Record<Channel, number> = {
  email: 1.0,
  whatsapp: 1.0,
  push: 0.8,
  glance: 0.85,
  payu: 0.9,
  instagram: 0.95,
};

const MAX_RETRIES = 2;

function randomStatus(channel: Channel): DeliveryStatus {
  const p = BASE_SUCCESS_RATE[channel];
  return Math.random() <= p ? "delivered" : "failed";
}

export function simulateDelivery(
  deal: DealInput,
  variants: CopyVariant[]
): DistributeDealResult {
  const logs: DeliveryLogEntry[] = [];

  for (const v of variants) {
    let finalStatus: DeliveryStatus = "pending";
    let attempt = 0;

    while (attempt <= MAX_RETRIES && finalStatus !== "delivered") {
      attempt += 1;
      const status = randomStatus(v.channel);
      finalStatus = status;

      const entry: DeliveryLogEntry = {
        id: `${v.channel}-${v.language}-${v.variant}-attempt-${attempt}`,
        channel: v.channel,
        language: v.language,
        variant: v.variant,
        attempt,
        status,
        timestamp: new Date().toISOString(),
        error: status === "failed"
          ? "Simulated channel delivery failure"
          : undefined,
      };
      logs.push(entry);
    }
  }

  const summaryByChannel: Record<Channel, ChannelSuccessSummary> = {
    email: { channel: "email", delivered: 0, failed: 0, total: 0, successRate: 0 },
    whatsapp: {
      channel: "whatsapp",
      delivered: 0,
      failed: 0,
      total: 0,
      successRate: 0,
    },
    push: { channel: "push", delivered: 0, failed: 0, total: 0, successRate: 0 },
    glance: { channel: "glance", delivered: 0, failed: 0, total: 0, successRate: 0 },
    payu: { channel: "payu", delivered: 0, failed: 0, total: 0, successRate: 0 },
    instagram: {
      channel: "instagram",
      delivered: 0,
      failed: 0,
      total: 0,
      successRate: 0,
    },
  };

  // Consider success/failure per variant (language+channel+kind), not per attempt
  const finalByKey = new Map<string, DeliveryStatus>();
  for (const log of logs) {
    const key = `${log.channel}-${log.language}-${log.variant}`;
    const existing = finalByKey.get(key);
    if (!existing || (existing !== "delivered" && log.status === "delivered")) {
      finalByKey.set(key, log.status);
    }
  }

  for (const [key, status] of finalByKey.entries()) {
    const [channel] = key.split("-") as [Channel];
    const entry = summaryByChannel[channel];
    entry.total += 1;
    if (status === "delivered") {
      entry.delivered += 1;
    } else if (status === "failed") {
      entry.failed += 1;
    }
  }

  for (const channel of Object.keys(summaryByChannel) as Channel[]) {
    const entry = summaryByChannel[channel];
    entry.successRate = entry.total
      ? Number((entry.delivered / entry.total).toFixed(2))
      : 0;
  }

  return {
    deal,
    variants,
    deliveryLogs: logs,
    channelSummary: Object.values(summaryByChannel),
  };
}

