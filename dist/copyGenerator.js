"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEnglishVariants = generateEnglishVariants;
const VARIANTS = ["urgency", "value", "social_proof"];
const CHANNELS = [
    "email",
    "whatsapp",
    "push",
    "glance",
    "payu",
    "instagram",
];
function formatDiscount(deal) {
    const value = deal.discount_value;
    if (deal.discount_type === "percentage") {
        return `${value}% OFF`;
    }
    return `₹${value} OFF`;
}
function expiryPhrase(deal) {
    const date = new Date(deal.expiry_timestamp);
    if (Number.isNaN(date.getTime())) {
        return "before the deal expires";
    }
    const today = new Date();
    const diffMs = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0)
        return "today only";
    if (diffDays === 1)
        return "today only";
    if (diffDays <= 3)
        return `in ${diffDays} days`;
    return `by ${date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    })}`;
}
function minOrderPhrase(deal) {
    if (!deal.min_order_value || deal.min_order_value <= 0)
        return "";
    return `on orders above ₹${deal.min_order_value}`;
}
function exclusivityPhrase(deal) {
    if (deal.exclusive_flag) {
        return "Exclusive on GrabOn";
    }
    return "Available across partners via GrabOn";
}
function channelCopy(channel, variant, deal) {
    const discount = formatDiscount(deal);
    const expiry = expiryPhrase(deal);
    const minOrder = minOrderPhrase(deal);
    const exclusivity = exclusivityPhrase(deal);
    const baseBrand = deal.merchant_id;
    switch (channel) {
        case "email": {
            const subjectUrgency = `${discount} on ${baseBrand} ends ${expiry}`;
            const subjectValue = `Save big at ${baseBrand}: ${discount}`;
            const subjectSocial = `${baseBrand} deal loved by thousands`;
            const bodyUrgency = `${discount} on ${deal.category} at ${baseBrand} ${minOrder ? minOrder + " " : ""}- hurry, offer valid ${expiry}. ${exclusivity}.`;
            const bodyValue = `Grab ${discount} on your next ${deal.category} order at ${baseBrand} ${minOrder ? minOrder + " " : ""}and save more on every purchase. ${exclusivity}.`;
            const bodySocial = `Shoppers are flocking to ${baseBrand} for this ${discount} ${deal.category} offer ${minOrder ? minOrder + " " : ""}- join them before it ends ${expiry}. ${exclusivity}.`;
            const ctaUrgency = "Claim your deal now";
            const ctaValue = "Apply savings at checkout";
            const ctaSocial = "Join the smart savers";
            if (variant === "urgency") {
                return `Subject: ${subjectUrgency}\nHeadline: Last chance for ${discount}\nBody: ${bodyUrgency}\nCTA: ${ctaUrgency}`;
            }
            if (variant === "value") {
                return `Subject: ${subjectValue}\nHeadline: Unlock extra savings\nBody: ${bodyValue}\nCTA: ${ctaValue}`;
            }
            return `Subject: ${subjectSocial}\nHeadline: Trending ${deal.category} deal\nBody: ${bodySocial}\nCTA: ${ctaSocial}`;
        }
        case "whatsapp": {
            // Max 160 characters, aim for concise lines
            if (variant === "urgency") {
                return `${discount} at ${baseBrand} on ${deal.category} ${minOrder ? "(" + minOrder + ") " : ""}- ends ${expiry}. ${exclusivity}. Tap to use now.`;
            }
            if (variant === "value") {
                return `Save ${discount} at ${baseBrand} on your next ${deal.category} order ${minOrder ? "(" + minOrder + ") " : ""}- grab the value deal via GrabOn.`;
            }
            return `People love this ${discount} ${deal.category} offer from ${baseBrand} ${minOrder ? "(" + minOrder + ") " : ""}- redeem via GrabOn before it’s gone.`;
        }
        case "push": {
            // Max 50 char title + 100 char body
            if (variant === "urgency") {
                const title = `${discount} ends soon`;
                const body = `${baseBrand} ${deal.category} deal ${minOrder ? "on " + minOrder + " " : ""}- valid ${expiry}. ${exclusivity}.`;
                return `Title: ${title}\nBody: ${body}`;
            }
            if (variant === "value") {
                const title = `Save ${discount} today`;
                const body = `Unlock extra savings on ${deal.category} at ${baseBrand} ${minOrder ? "with " + minOrder : ""}. ${exclusivity}.`;
                return `Title: ${title}\nBody: ${body}`;
            }
            const title = `Top-rated ${deal.category} deal`;
            const body = `Thousands are grabbing ${discount} at ${baseBrand} ${minOrder ? "on " + minOrder + " " : ""}- don’t miss out. ${exclusivity}.`;
            return `Title: ${title}\nBody: ${body}`;
        }
        case "glance": {
            // 160 chars, cold grab, no context
            if (variant === "urgency") {
                return `${discount} on ${deal.category} at ${baseBrand} for a limited time only. ${exclusivity}. Swipe to unlock before it disappears.`;
            }
            if (variant === "value") {
                return `Turn your next ${deal.category} order at ${baseBrand} into instant savings with ${discount} ${minOrder ? "on " + minOrder : ""}. Grab it via GrabOn.`;
            }
            return `Your friends are already using this ${discount} ${deal.category} deal at ${baseBrand}. Join them and save more with GrabOn today.`;
        }
        case "payu": {
            // Max 40 chars, action-oriented
            if (variant === "urgency") {
                return `Apply ${discount} now – ends soon`;
            }
            if (variant === "value") {
                return `Save ${discount} on this payment`;
            }
            return `Most-used offer – grab your savings`;
        }
        case "instagram": {
            if (variant === "urgency") {
                return `${discount} on ${deal.category} at ${baseBrand} – last days only ⚡️ ${minOrder ? "Min order ₹" + deal.min_order_value + ". " : ""}${exclusivity}. #GrabOn #Sale #LimitedTime`;
            }
            if (variant === "value") {
                return `Why pay full price? Get ${discount} at ${baseBrand} on your next ${deal.category} order ${minOrder ? "(min ₹" + deal.min_order_value + ")" : ""}. Save smart with GrabOn. #Deals #Savings #GrabOn`;
            }
            return `Everyone’s talking about this ${discount} ${deal.category} deal from ${baseBrand}. Join thousands saving more with GrabOn today. ${minOrder ? "Min ₹" + deal.min_order_value + ". " : ""}#Trending #SmartShopping`;
        }
    }
}
function generateEnglishVariants(deal) {
    const variants = [];
    for (const channel of CHANNELS) {
        for (const variant of VARIANTS) {
            const text = channelCopy(channel, variant, deal);
            variants.push({
                channel,
                variant,
                language: "en",
                text,
            });
        }
    }
    return variants;
}
//# sourceMappingURL=copyGenerator.js.map