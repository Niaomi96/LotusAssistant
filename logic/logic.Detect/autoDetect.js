// ======================================================
//  UNIVERSAL KEYWORD DETECTOR (FINAL PRODUCTION VERSION)
//  PURPOSE:
//    - Scan user input
//    - Match against schemaMap
//    - Return BEST schemaId + metadata
//    - Provide match list + confidence score
// ======================================================

import { getSchemaMap } from '../logic.Data/dataIndex.js';

export default function autoDetect(userInput = "") {
    if (!userInput || typeof userInput !== "string") {
        return emptyResult();
    }

    const schemaMap = getSchemaMap();
    const text = userInput.toLowerCase().trim();

    const matches = [];

    // ----------------------------------------------
    // 1. LOOP THROUGH SCHEMA MAP
    // ----------------------------------------------
    for (const schemaId in schemaMap) {
        const entry = schemaMap[schemaId];
        if (!entry) continue;

        const keywords = [];

        // category + subcategory
        if (entry.category) {
            keywords.push(entry.category.toLowerCase());
        }
        if (entry.subcategory) {
            keywords.push(entry.subcategory.toLowerCase());
        }

        // schemaId words: "payments.manualRefund" → ["payments","manual","refund"]
        const schemaWords = schemaId
            .split(/[\.\-]/g)
            .map(w => w.toLowerCase());

        keywords.push(...schemaWords);

        // Count hits
        const hits = keywords.filter(kw => kw && text.includes(kw));

        if (hits.length > 0) {
            matches.push({
                schemaId,
                tsId: entry.tsId || null,
                emailId: entry.emailId || null,
                category: entry.category || null,
                subcategory: entry.subcategory || null,
                hitCount: hits.length
            });
        }
    }

    // ----------------------------------------------
    // 2. NO MATCHES → return empty package
    // ----------------------------------------------
    if (matches.length === 0) {
        return emptyResult();
    }

    // ----------------------------------------------
    // 3. PICK BEST MATCH (highest hitCount)
    // ----------------------------------------------
    matches.sort((a, b) => b.hitCount - a.hitCount);
    const best = matches[0];

    // ----------------------------------------------
    // 4. RETURN FULL DETECTION PACKAGE
    // ----------------------------------------------
    return {
        schemaId: best.schemaId,
        tsId: best.tsId,
        emailId: best.emailId,
        category: best.category,
        subcategory: best.subcategory,
        score: best.hitCount,
        matches
    };
}

// ======================================================
//  EMPTY RESULT HELPER
// ======================================================
function emptyResult() {
    return {
        schemaId: null,
        tsId: null,
        emailId: null,
        category: null,
        subcategory: null,
        score: 0,
        matches: []
    };
}