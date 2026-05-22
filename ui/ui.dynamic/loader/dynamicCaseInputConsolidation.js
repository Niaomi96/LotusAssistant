// ======================================================
//  ui.dynamic/loader/dynamicCaseInputConsolidation.js
// ======================================================

console.log("🟣 [DYNAMIC CASE INPUT CONSOLIDATION] Loaded");

function normalizeLabel(label) {
    return String(label).replace(/\s+/g, "").toLowerCase();
}

// ⭐ FIXED VERSION — preserves ALL multi-entry arrays
export function dynamicCaseInputConsolidation(dynamicData) {
    if (!dynamicData) return null;

    const {
        caseInputs: rawCaseInputs,
        trigger,
        triggerField,
        directoryEntry
    } = dynamicData;

    if (!directoryEntry) {
        return dynamicData;
    }

    const consolidated = {};
    const multiEntryConsolidated = {};

    directoryEntry.fields.forEach(field => {
        const { key, placeholder } = field;

        const finalKey = placeholder || key;

        const rawValue = rawCaseInputs[key];
        const rawList =
            rawCaseInputs[key + "List"] ||
            rawCaseInputs[key] ||
            rawCaseInputs[normalizeLabel(key) + "list"];

        // ======================================================
        // ⭐ FIX: Preserve ANY multi-entry array
        // ======================================================
        if (Array.isArray(rawList) && rawList.length > 0) {
            multiEntryConsolidated[finalKey] = rawList;
            return;
        }

        // Normal single-value fields
        if (rawValue !== undefined && rawValue !== null && rawValue !== "") {
            consolidated[finalKey] = rawValue;
        }
    });

    // ⭐ FIX: Also include ANY extra multi-entry arrays not listed in directoryEntry
    for (const key in rawCaseInputs) {
        const val = rawCaseInputs[key];
        if (Array.isArray(val) && val.length > 0) {
            multiEntryConsolidated[key] = val;
        }
    }

    const finalCaseInputs = {
        ...consolidated,
        ...multiEntryConsolidated
    };

    return {
        ...dynamicData,
        finalCaseInputs,
        trigger,
        triggerField,
        directoryEntry
    };
}

// ⭐ OPTIONAL: keep old name for compatibility
export { dynamicCaseInputConsolidation as consolidateDynamicCaseInputs };


