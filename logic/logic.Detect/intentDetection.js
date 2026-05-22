// ======================================================
//  UNIVERSAL INTENT DETECTOR (FINAL ARCHITECTURE)
//  PURPOSE: Score urgency + sentiment + intent patterns
//           - Returns weighted score
//           - Optional schemaId boosts for tie-breaking
// ======================================================

export default function intentDetection(userInput = "") {
    const text = userInput.toLowerCase();

    let urgency = 0;
    let sentiment = 0;
    let intentBoost = [];   // schemaId boosts for detectEngine

    // ----------------------------------------------
    // URGENCY DETECTION
    // ----------------------------------------------
    const urgentWords = ["urgent", "asap", "immediately", "right now", "help", "can't", "cannot"];
    if (urgentWords.some(w => text.includes(w))) urgency = 1;

    // ----------------------------------------------
    // SENTIMENT DETECTION
    // ----------------------------------------------
    const negativeWords = ["angry", "upset", "frustrated", "mad", "annoyed"];
    const positiveWords = ["thank you", "appreciate", "great", "awesome"];

    if (negativeWords.some(w => text.includes(w))) sentiment = -1;
    if (positiveWords.some(w => text.includes(w))) sentiment = 1;

    // ----------------------------------------------
    // INTENT PATTERN BOOSTS (schemaId-based)
    //  — MUST match your NEW schema IDs
    // ----------------------------------------------

    if (text.includes("refund")) 
        intentBoost.push("payments.manualRefund");

    if (text.includes("login") || text.includes("access")) 
        intentBoost.push("backoffice.loginIssue");

    if (text.includes("mfa") || text.includes("code")) 
        intentBoost.push("backoffice.mfaDisable");

    if (text.includes("report")) 
        intentBoost.push("backoffice.reporting");

    if (text.includes("payout") || text.includes("adyen")) 
        intentBoost.push("payments.adyenInquiry");

    if (text.includes("server") || text.includes("down")) 
        intentBoost.push("serverOutage.serverOutage");

    // ----------------------------------------------
    // FINAL SCORE
    // ----------------------------------------------
    const score = urgency + sentiment;

    return {
        urgency,
        sentiment,
        score,
        intentBoost
    };
}