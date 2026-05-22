// ======================================================
//  UNIVERSAL KEYWORD DETECTOR (UPDATED FINAL VERSION)
//  RETURNS: schemaId, tsId, emailId, category, subcategory, score
// ======================================================

import { getSchemaMap } from '../logic.Data/dataIndex.js';

export default function autoDetect(userInput = "") {
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

        if (entry.subcategory) {
            keywords.push(entry.subcategory.toLowerCase());
        }

        if (entry.category) {
            keywords.push(entry.category.toLowerCase());
        }

        const schemaWords = schemaId
            .split(/[\.\-]/g)
            .map(w => w.toLowerCase());

        keywords.push(...schemaWords);

        const hits = keywords.filter(kw => kw && text.includes(kw));

        if (hits.length > 0) {
            matches.push({
                schemaId,
                tsId: entry.tsId || null,
                emailId: entry.emailId || null,
                category: entry.category,
                subcategory: entry.subcategory,
                hitCount: hits.length
            });
        }
    }

    // ----------------------------------------------
    // 2. PICK BEST MATCH
    // ----------------------------------------------
    if (matches.length === 0) {
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

    // highest hitCount wins
    matches.sort((a, b) => b.hitCount - a.hitCount);
    const best = matches[0];

    // ----------------------------------------------
    // 3. RETURN FULL DETECTION PACKAGE
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