// ======================================================
//  triggerEngine.js
//  MODERN FIELD-NAME + FIELD-VALUE INSPECTOR (LOGGING ONLY)
//  NOTE: This no longer controls execution flow; it only
//        helps inspect matches for debugging / tooling.
// ======================================================

const dynamicEmails = window.dynamicEmails || {};

console.log("%c[TRIGGER ENGINE] Loaded (modern, non-blocking)", "color:#4CAF50;font-weight:bold");

// ======================================================
//  NORMALIZATION
// ======================================================
function normalize(str) {
    if (!str) return "";
    return String(str).toLowerCase().replace(/\s+/g, " ").trim();
}

// ======================================================
//  DROPDOWN VALUE INSPECTOR (OPTIONAL)
// ======================================================
export function inspectUITrigger() {
    const el = document.querySelector("[data-trigger]");
    if (!el) return null;

    const opt = el.options[el.selectedIndex];
    const value = opt?.value || opt?.text || null;

    const normalized = normalize(value);

    console.log(
        "%c[UI TRIGGER] Dropdown value detected:",
        "color:#03A9F4;font-weight:bold",
        normalized
    );

    return normalized;
}

// ======================================================
//  FIELD NAME MATCHING (MODULE DETECTION)
// ======================================================
export function matchModuleByFieldName(fieldName) {
    const normalized = normalize(fieldName);
    const matches = [];

    for (const dynamicId in dynamicEmails) {
        const module = dynamicEmails[dynamicId];
        if (!module?.fields) continue;

        const normalizedFields = module.fields.map(f => normalize(f));

        if (normalizedFields.includes(normalized)) {
            console.log(
                "%c[FIELD NAME MATCH] Module detected:",
                "color:#8E44AD;font-weight:bold",
                dynamicId,
                "via field name:",
                fieldName
            );

            matches.push({
                dynamicId,
                module,
                matchedField: fieldName
            });
        }
    }

    return matches.length ? matches : null;
}

// ======================================================
//  FIELD VALUE MATCHING (TEMPLATE DETECTION)
// ======================================================
export function matchModuleByFieldValue(value) {
    if (!value) return null;

    const normalizedValue = normalize(value);
    const matches = [];

    for (const dynamicId in dynamicEmails) {
        const module = dynamicEmails[dynamicId];
        if (!module?.templateLogic?.templatesByTicketType) continue;

        const ticketTypes = Object.keys(module.templateLogic.templatesByTicketType);
        const normalizedTicketTypes = ticketTypes.map(t => normalize(t));

        if (normalizedTicketTypes.includes(normalizedValue)) {
            console.log(
                "%c[TEMPLATE MATCH] Template detected:",
                "color:#E67E22;font-weight:bold",
                normalizedValue,
                "in module:",
                dynamicId
            );

            matches.push({
                dynamicId,
                module,
                matchedValue: value
            });
        }
    }

    return matches.length ? matches : null;
}

// ======================================================
//  TEXT FIELD VALUE INSPECTOR
// ======================================================
export function inspectTextFieldTriggers(caseData = {}) {
    const triggers = [];

    for (const key in caseData) {
        const rawValue = caseData[key];

        if (!rawValue || rawValue instanceof Date) continue;

        console.log(
            "%c[TEXT FIELD] Checking value:",
            "color:#009688;font-weight:bold",
            rawValue
        );

        const valueMatches = matchModuleByFieldValue(rawValue);
        if (valueMatches) triggers.push(...valueMatches);
    }

    return triggers.length ? triggers : null;
}

// ======================================================
//  CALENDAR FIELD INSPECTOR
// ======================================================
export function inspectCalendarTriggers(caseData = {}) {
    const triggers = [];

    for (const key in caseData) {
        const rawValue = caseData[key];

        const isDate =
            rawValue instanceof Date ||
            (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}/.test(rawValue));

        if (!isDate) continue;

        console.log(
            "%c[CALENDAR FIELD] Date detected in field:",
            "color:#F44336;font-weight:bold",
            key
        );

        const nameMatches = matchModuleByFieldName(key);
        if (nameMatches) triggers.push(...nameMatches);
    }

    return triggers.length ? triggers : null;
}

// ======================================================
//  MAIN INSPECTOR (DEBUG ONLY, DOES NOT BLOCK ENGINE)
// ======================================================
export function inspectAllTriggers(caseData = {}) {
    console.log("%c[RESOLVER] Running trigger inspection...", "color:#2ECC71;font-weight:bold");

    const uiTrigger = inspectUITrigger();
    const uiMatches = uiTrigger ? matchModuleByFieldValue(uiTrigger) : null;

    const textMatches = inspectTextFieldTriggers(caseData);
    const calendarMatches = inspectCalendarTriggers(caseData);

    const fieldNameMatches = [];
    for (const key in caseData) {
        const nameMatches = matchModuleByFieldName(key);
        if (nameMatches) fieldNameMatches.push(...nameMatches);
    }

    const allMatches = [
        ...(fieldNameMatches || []),
        ...(uiMatches || []),
        ...(textMatches || []),
        ...(calendarMatches || [])
    ];

    if (!allMatches.length) {
        console.warn("%c[RESOLVER] No matches found", "color:#FF0000;font-weight:bold");
        return {
            trigger: uiTrigger || null,
            matches: []
        };
    }

    console.log(
        "%c[RESOLVER] FINAL MATCHES:",
        "color:#4CAF50;font-weight:bold",
        allMatches
    );

    return {
        trigger: uiTrigger || null,
        matches: allMatches
    };
}
