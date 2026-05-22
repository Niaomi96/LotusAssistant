// ======================================================
//  WORKFLOW ORCHESTRATOR (WFO) — BASIC vs KEYWORD MODE
// ======================================================

import troubleshootingEngine from '../logic.Engines/troubleshootingEngine.js';
import caseEngine from '../logic.Engines/caseEngine.js';

// ⭐ STATIC EMAIL ENGINE
import { generateEmailFromId } from '../logic.Engines/emailEngine.js';

// ⭐ DYNAMIC EMAIL ENGINE (UI-ONLY)
// (WFO no longer uses this — UI handles dynamic logic)
import { generateDynamicEmail } from '../logic.Engines/dynamicemailEngine.js';

import { loadAllData, getSchemaMap } from '../logic.Data/dataIndex.js';

export async function processCustomerMessage(
    userInputs = {},
    schemaId = null
) {

    const DATA = await loadAllData();

    // --------------------------------------------------
    // 1. VALIDATE SCHEMA ID
    // --------------------------------------------------
    const schemaMap = getSchemaMap();
    const entry = schemaMap[schemaId];

    if (!entry) {
        return { error: true };
    }

    const tsId = entry.tsId || null;

    // --------------------------------------------------
    // 2. CASE ENGINE
    // --------------------------------------------------
    const caseOutput = caseEngine(schemaId, {
        schemaId,
        ...userInputs
    });

    // --------------------------------------------------
    // 3. BASIC TSID TROUBLESHOOTING
    // --------------------------------------------------
    const troubleshooting = tsId ? troubleshootingEngine(tsId) : null;

    // --------------------------------------------------
    // 4. LOAD TS ENTRY (FOR KEYWORD MODE)
    // --------------------------------------------------
    const tsEntry = tsId
        ? DATA.tsLibrary?.find(x => x.tsId === tsId)
        : null;

    // --------------------------------------------------
    // 5. DETERMINE MODE (MATCHES TSKT2.js)
    // --------------------------------------------------
    const hasKeywords =
        tsEntry?.keywordTroubleshooting &&
        Object.keys(tsEntry.keywordTroubleshooting).length > 0;

    const tsMode = hasKeywords ? "keyword" : "basic";

    // --------------------------------------------------
    // 6. KEYWORD PAYLOAD
    // --------------------------------------------------
    const tsPayload = hasKeywords
        ? { 
            tsId, 
            tsEntry,
            logic: caseOutput.logic
        }
        : null;

    // --------------------------------------------------
    // ⭐ 7. EMAIL ENGINE — STATIC ONLY
    // ⭐ DYNAMIC EMAIL IS NOW UI-ONLY
    // --------------------------------------------------
    const emailId = entry.emailId || null;      // STATIC EMAIL ID
    const dynamicId = entry.dynamicId || null;  // DYNAMIC MODULE ID (UI handles this)

    let emailTemplate = null;
    let finalEmail = null;

    const inputs = caseOutput.userInputs || userInputs || {};

    // ⭐ STATIC EMAIL HANDLING ONLY
    if (emailId) {
        emailTemplate = DATA.emailTemplates[emailId] || null;

        if (emailTemplate) {
            finalEmail = generateEmailFromId(emailId, inputs);
        }
    }

    // ⭐ IMPORTANT:
    // WFO DOES NOT CHECK DYNAMIC MODULES ANYMORE.
    // WFO DOES NOT BLOCK DYNAMIC MODE.
    // WFO ALWAYS RETURNS dynamicId TO THE UI.
    // UI (index.js) DECIDES DYNAMIC VS STATIC.

    // --------------------------------------------------
    // 8. FINAL PACKAGE
    // --------------------------------------------------
    return {
        rawInputs: userInputs,
        schemaId,
        tsId,

        // CASE SYSTEM
        caseOutput,

        // BASIC TSID TROUBLESHOOTING
        troubleshooting,

        // KEYWORD TROUBLESHOOTING
        tsPayload,

        // ⭐ MODE FLAG FOR UI
        tsMode,

        // ⭐ EMAIL SYSTEM
        emailTemplate,   // static only
        finalEmail,      // static or null (dynamic)
        dynamicId        // UI needs this to load modular dynamic email
    };
}