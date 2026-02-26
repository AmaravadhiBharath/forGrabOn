"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateDelivery = simulateDelivery;
const MOCK_ENDPOINTS = {
    email: "https://api.sendgrid.com/v3/mail/send",
    whatsapp: "https://graph.facebook.com/v17.0/whatsapp_business_account/messages",
    push: "https://fcm.googleapis.com/fcm/send",
    glance: "https://api.glance.inmobi.com/v1/content/push",
    payu: "https://api.payu.in/merchant/post-banner",
    instagram: "https://graph.facebook.com/v17.0/instagram_messaging",
};
const BASE_SUCCESS_RATE = {
    email: 0.98, // Very reliable
    whatsapp: 0.95,
    push: 0.75, // Simulated mobile connectivity issues
    glance: 0.7, // High-traffic lockscreen volatility
    payu: 0.9,
    instagram: 0.85,
};
const MAX_RETRIES = 2;
function getDeliveryAttempt(channel) {
    const p = BASE_SUCCESS_RATE[channel];
    const success = Math.random() <= p;
    if (success)
        return { status: "delivered" };
    const errors = [
        `Timeout connecting to ${MOCK_ENDPOINTS[channel]}`,
        "Rate limit exceeded (429)",
        "Upstream provider 503 error",
        "Network congestion",
    ];
    return {
        status: "failed",
        error: errors[Math.floor(Math.random() * errors.length)]
    };
}
async function simulateDelivery(deal, variants, generationMethod) {
    const startTime = Date.now();
    const logs = [];
    // Helper for simulated network latency
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));
    for (const v of variants) {
        let finalStatus = "pending";
        let attempt = 0;
        while (attempt <= MAX_RETRIES && finalStatus !== "delivered") {
            attempt += 1;
            // Simulate real-world network latency (10-40ms per attempt)
            await sleep(Math.floor(Math.random() * 30) + 10);
            const { status, error } = getDeliveryAttempt(v.channel);
            finalStatus = status;
            const entry = {
                id: `${v.channel}-${v.language}-${v.variant}-attempt-${attempt}`,
                channel: v.channel,
                language: v.language,
                variant: v.variant,
                attempt,
                status,
                timestamp: new Date().toISOString(),
                error: error || undefined,
            };
            logs.push(entry);
        }
    }
    const summaryByChannel = {
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
    const finalByKey = new Map();
    for (const log of logs) {
        const key = `${log.channel}-${log.language}-${log.variant}`;
        const existing = finalByKey.get(key);
        if (!existing || (existing !== "delivered" && log.status === "delivered")) {
            finalByKey.set(key, log.status);
        }
    }
    for (const [key, status] of finalByKey.entries()) {
        const [channel] = key.split("-");
        const entry = summaryByChannel[channel];
        entry.total += 1;
        if (status === "delivered") {
            entry.delivered += 1;
        }
        else if (status === "failed") {
            entry.failed += 1;
        }
    }
    for (const channel of Object.keys(summaryByChannel)) {
        const entry = summaryByChannel[channel];
        entry.successRate = entry.total
            ? Number((entry.delivered / entry.total).toFixed(2))
            : 0;
    }
    const ms = Date.now() - startTime;
    return {
        deal,
        variants,
        deliveryLogs: logs,
        channelSummary: Object.values(summaryByChannel),
        processingTimeMs: ms,
        deliveryDuration: `${(ms / 1000).toFixed(1)} sec`,
        generationMethod,
    };
}
//# sourceMappingURL=webhookSimulator.js.map