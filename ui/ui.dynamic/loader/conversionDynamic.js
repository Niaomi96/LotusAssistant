// ======================================================
//  ui.dynamic/loader/conversionDynamic.js
//  PURPOSE: Schema → Module Loader (NO field extraction)
// ======================================================

console.log("🟣 [DYNAMIC CONVERSION] conversionDynamic.js loaded");

const dynamicEmails = window.dynamicEmails || {};

function normalizeLabel(label) {
    return String(label).replace(/\s+/g, "").toLowerCase();
}

export function convertDynamicPayload(finalResult, DATA) {
    console.log("🟪 [DYNAMIC CONVERSION] Starting conversion...", {
        finalResult,
        DATA
    });

    if (!finalResult || !DATA) {
        return {
            isDynamic: false,
            reason: "Missing WFO or DATA",
            dynamicId: null,
            dynamicModule: null,
            triggerField: null,
            schemaEntry: null
        };
    }

    const schemaId = finalResult.schemaId;
    const schemaEntry = DATA.schemaMap?.[schemaId];

    if (!schemaEntry) {
        return {
            isDynamic: false,
            reason: "Schema not found",
            dynamicId: null,
            dynamicModule: null,
            triggerField: null,
            schemaEntry: null
        };
    }

    const dynamicId = schemaEntry.dynamicId || null;
    const dynamicModule = dynamicEmails[dynamicId] || null;

    const isDynamic = Boolean(dynamicId && dynamicModule);

    if (!isDynamic) {
        return {
            isDynamic: false,
            reason: "Module not found",
            dynamicId,
            dynamicModule: null,
            triggerField: null,
            schemaEntry
        };
    }

    const triggerField = schemaEntry.triggerField || null;

    return {
        isDynamic,
        reason: "Dynamic module found",
        dynamicId,
        dynamicModule,
        triggerField,
        schemaEntry
    };
}
