"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localizeVariant = localizeVariant;
exports.expandWithLocalizations = expandWithLocalizations;
function localizeLineToHindi(text, variant) {
    // High-level adaptation by intent bucket, not literal translation
    if (variant === "urgency") {
        return text
            .replace("last days only", "sirf kuch hi din ke liye")
            .replace("Last chance", "Aakhri mauka")
            .replace("hurry, offer valid", "jaldi karein, offer valid hai")
            .replace("ends soon", "jaldi khatam ho raha hai")
            .replace("before it disappears", "is se pehle ki khatam ho jaye")
            .replace("Limited time only", "Seemit samay ke liye");
    }
    if (variant === "value") {
        return text
            .replace("Save", "Bachat karein")
            .replace("extra savings", "extra bachat")
            .replace("value deal", "value wali deal")
            .replace("Why pay full price?", "Poore paise kyun dena?")
            .replace("Save smart", "Samajhdari se bachat karein");
    }
    // social proof
    return text
        .replace("loved by thousands", "hazaaron logon ki pasand")
        .replace("Shoppers are flocking", "Customers yahan par aa rahe hain")
        .replace("Everyone’s talking about", "Sab iske baare mein baat kar rahe hain")
        .replace("Your friends are already using", "Aapke doston ne pehle hi use kar liya hai")
        .replace("Top-rated", "Sabse zyada rated")
        .replace("Trending", "Trending offer");
}
function localizeLineToTelugu(text, variant) {
    if (variant === "urgency") {
        return text
            .replace("last days only", "inka konni rojula varake")
            .replace("Last chance", "Chivari avakasam")
            .replace("hurry, offer valid", "tvaraga cheskondi, offer")
            .replace("ends soon", "tvaralo mugustundi")
            .replace("before it disappears", "mugiseyemundu use cheskondi")
            .replace("Limited time only", "konni rojula maatrame");
    }
    if (variant === "value") {
        return text
            .replace("Save", "Dabbulu save cheskondi")
            .replace("extra savings", "marinta savings")
            .replace("value deal", "value deal")
            .replace("Why pay full price?", "Full price enduku chellistaru?")
            .replace("Save smart", "Smart ga save cheskondi");
    }
    // social proof
    return text
        .replace("loved by thousands", "vela mandi ishtapadinaru")
        .replace("Shoppers are flocking", "Chala mandi ikkada konugutunnaru")
        .replace("Everyone’s talking about", "andaruu dinigurinchi maatladutunnaru")
        .replace("Your friends are already using", "mee snehitulu ippatike use chesaru")
        .replace("Top-rated", "top rated offer")
        .replace("Trending", "ippudu trend lo unna offer");
}
function localizeVariant(base, targetLanguage) {
    if (targetLanguage === "en")
        return base;
    let localizedText = base.text;
    if (targetLanguage === "hi") {
        localizedText = localizeLineToHindi(base.text, base.variant);
    }
    else if (targetLanguage === "te") {
        localizedText = localizeLineToTelugu(base.text, base.variant);
    }
    return {
        ...base,
        language: targetLanguage,
        text: localizedText,
    };
}
function expandWithLocalizations(englishVariants) {
    const all = [];
    for (const variant of englishVariants) {
        all.push(variant);
        all.push(localizeVariant(variant, "hi"));
        all.push(localizeVariant(variant, "te"));
    }
    return all;
}
//# sourceMappingURL=localization.js.map