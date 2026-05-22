// ======================================================
//  ui.dynamic/loader/dynamicemailTrigger.js
//  PURPOSE:
//  - Single source of truth for trigger extraction
//  - Uses ONLY triggerField from directory
//  - Guarantees consistent trigger detection
// ======================================================

console.log("🟣 [DYNAMIC TRIGGER] dynamicemailTrigger.js loaded");

// ------------------------------------------------------
// LABEL NORMALIZER
// ------------------------------------------------------
function normalizeLabel(label) {
    return String(label).replace(/\s+/g, "").toLowerCase();
}

// ------------------------------------------------------
// CORE TRIGGER EXTRACTOR (NEW VERSION)
// ------------------------------------------------------
export function extractTrigger({ caseInputs = {}, triggerField = null }) {
    if (!caseInputs || typeof caseInputs !== "object") {
        console.warn("⚠️ [DYNAMIC TRIGGER] No caseInputs provided");
        return null;
    }

    // ⭐ SPECIAL CASE: FEEDBACK REVIEW (NPS)
    // Directory triggerField = "Case Number"
    if (triggerField === "Case Number") {
        const raw = caseInputs["Case Number"];

        // If user typed something → use it
        if (raw && raw.trim() !== "") {
            console.log("🎯 [NPS TRIGGER] Using Case Number as trigger:", raw);
            return raw;
        }

        // If empty → force a valid trigger
        console.log("🎯 [NPS TRIGGER] Empty Case Number → using 'NPS' as trigger");
        return "NPS";
    }

    // 1️⃣ DIRECT MATCH — triggerField from directory
    if (triggerField) {
        for (const key of Object.keys(caseInputs)) {
            if (normalizeLabel(key) === normalizeLabel(triggerField)) {
                const value = caseInputs[key];
                console.log("🎯 [DYNAMIC TRIGGER] Direct trigger match:", value);
                return value;
            }
        }
    }

    // 2️⃣ FINAL FALLBACK — first non-empty value
    for (const key of Object.keys(caseInputs)) {
        const value = caseInputs[key];
        if (value !== null && value !== undefined && value !== "") {
            console.log("🎯 [DYNAMIC TRIGGER] Fallback trigger:", value);
            return value;
        }
    }

    console.log("⚪ [DYNAMIC TRIGGER] No trigger detected");
    return null;
}

// ------------------------------------------------------
// OPTIONAL NORMALIZER
// ------------------------------------------------------
export function normalizeTriggerValue(trigger) {
    if (!trigger) return null;
    return String(trigger).replace(/\s+/g, " ").trim();
}
