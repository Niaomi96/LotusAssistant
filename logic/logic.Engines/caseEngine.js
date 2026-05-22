// ======================================================
//  CE.js — Case Engine (DIRECTORY‑AWARE, TSID‑EXCLUDED)
// ======================================================

import Data from '../logic.Data/dataIndex.js';

export default function caseEngine(schemaId, userInputs = {}) {
    console.log("🟦 [CASE ENGINE] Incoming schemaId:", schemaId);

    if (!schemaId) {
        console.warn("🟧 [CASE ENGINE] No schemaId provided.");
        return { schema: null };
    }

    // -------------------------------
    // 1. Get directory entry (MDDN.json)
    // -------------------------------
    const directoryEntry = Data.schemaMap()[schemaId];
    if (!directoryEntry) {
        console.warn("❌ [CASE ENGINE] schemaId not found in schemaMap:", schemaId);
        return { schema: null };
    }

    // -------------------------------
    // 2. Load REAL schema from schemaLibrary.json
    // -------------------------------
    const schemaArray = Data.schema();
    const schemaEntry = schemaArray.find(x => x.id === directoryEntry.schemaId);

    if (!schemaEntry) {
        console.warn("❌ [CASE ENGINE] Schema not found in schema library:", directoryEntry.schemaId);
        return { schema: null };
    }

    // -------------------------------
    // 3. AUTOPOPULATION (CASE ONLY)
    // -------------------------------
    let autoPopulateRules = {};

    if (schemaEntry.caseNotes) {
        for (const sectionName in schemaEntry.caseNotes) {
            const section = schemaEntry.caseNotes[sectionName];
            if (section.autoPopulate) {
                Object.assign(autoPopulateRules, section.autoPopulate);
            }
        }
    }

    const autoPopulatedInputs = { ...autoPopulateRules, ...userInputs };

    // -------------------------------
    // ⭐ 4. FINAL MERGE — RETURN SCHEMA + LOGIC
    // -------------------------------
    const merged = {
        schemaId: directoryEntry.schemaId,

        // FULL schema block
        schema: schemaEntry,

        // FULL caseNotes block (deep copy)
        caseNotes: JSON.parse(JSON.stringify(schemaEntry.caseNotes)) || {},

        // ⭐ NEW: logic block (clean, separate, not merged)
        logic:
            schemaEntry.caseNotes?.["Case Details"]?.logic
            || {},

        // Inputs
        userInputs: autoPopulatedInputs,

        // ⭐ Directory metadata (for UI visibility)
        directory: {
            category: directoryEntry.category,
            subcategory: directoryEntry.subcategory,
            label: directoryEntry.label,
            schemaId: directoryEntry.schemaId
        }
    };

    console.log("✅ [CASE ENGINE] Final merged schema entry:", merged);

    return merged;
}