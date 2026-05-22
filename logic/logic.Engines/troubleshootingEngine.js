// ======================================================
//  troubleshootingEngine.js (FINAL — FULL TSID RESTORE)
// ======================================================

import { getMasterTSLibrary, getTSLibrary } from '../logic.Data/dataIndex.js';

export default function troubleshootingEngine(tsId) {
    console.log("🟦 [TS ENGINE] Incoming tsId:", tsId);

    if (!tsId) {
        console.warn("🟧 [TS ENGINE] No tsId provided.");
        return {
            tsId: null,
            mainCategory: "",
            subcategory: "",
            steps: [],
            notes: ""
        };
    }

    const masterArray = getMasterTSLibrary();
    const tsArray = getTSLibrary();

    console.log("📚 [TS ENGINE] Loaded Libraries:", {
        masterCount: masterArray?.length,
        tsCount: tsArray?.length
    });

    const master = masterArray.find(x => x.tsId === tsId);
    const real = tsArray.find(x => x.tsId === tsId);

    console.log("🔍 [TS ENGINE] master entry:", master);
    console.log("🔍 [TS ENGINE] real entry:", real);

    if (!master && !real) {
        console.warn(`🟥 [TS ENGINE] No troubleshooting entry found for tsId: ${tsId}`);
        return {
            tsId,
            mainCategory: "",
            subcategory: "",
            steps: [],
            notes: ""
        };
    }

    // ⭐ FULL RESTORE — return ALL TS fields, not just steps
    const merged = {
        tsId,

        mainCategory: master?.mainCategory || real?.mainCategory || "",
        subcategory: master?.subcategory || real?.subcategory || "",

        // ⭐ BASIC TROUBLESHOOTING STEPS
        steps:
            real?.troubleshootingSteps?.length > 0
                ? real.troubleshootingSteps
                : master?.troubleshootingSteps || [],

        // ⭐ BASIC TROUBLESHOOTING NOTES
        notes:
            real?.troubleshootingNotes ||
            master?.troubleshootingNotes ||
            ""
    };

    console.log("✅ [TS ENGINE] Final merged TS entry:", merged);

    return merged;
}