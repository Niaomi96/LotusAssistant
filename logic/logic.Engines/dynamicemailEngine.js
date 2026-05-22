// ======================================================
//  logic.Engines/dynamicemailEngine.js
//  FINAL VERSION — BACKEND NO LONGER GENERATES EMAILS
// ======================================================

/**
 * Backend dynamic email engine is deprecated.
 * UI modular system now handles:
 *  - template selection
 *  - trigger logic
 *  - placeholder replacement
 *  - email rendering
 *
 * This function remains ONLY for compatibility and logging.
 *
 * @param {string} dynamicId - The dynamic email identifier
 * @param {object} userInputs - Case fields passed from the workflow engine
 * @returns {null} Always returns null (UI handles everything now)
 */
export function generateDynamicEmail(dynamicId, userInputs = {}) {

    console.warn(
        `[DYNAMIC EMAIL ENGINE] Backend dynamic email generation disabled. ` +
        `UI modular engine will handle dynamic rendering for dynamicId: ${dynamicId}`
    );

    // ⭐ Debugging visibility
    console.log("[DYNAMIC EMAIL ENGINE] Received dynamicId:", dynamicId);
    console.log("[DYNAMIC EMAIL ENGINE] Received userInputs:", userInputs);

    // ⭐ IMPORTANT — Always return null so backend never interferes
    //    (UI uses this to detect dynamic mode)
    return null;
}