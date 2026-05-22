// ======================================================
//  ui.dynamic/loader/dynamicCaseInputConversion.js
//  PURPOSE: Extract ALL visible UI inputs (single + multi-entry)
//           using the NEW directory system.
// ======================================================

console.log("🟣 [DYNAMIC CASE INPUT CONVERSION] Loaded");

import { dynamicEmailDirectoryCaseInput } from './dynamicEmailDirectoryCaseInput.js';

function normalizeLabel(label) {
    return String(label).replace(/\s+/g, "").toLowerCase();
}

// ======================================================
//  FIND THE REAL WRAPPER (visibility-based)
// ======================================================
function findVisibleWrapper(label) {
    const norm = normalizeLabel(label);

    let w = document.querySelector(`[data-label="${label}"]`);
    if (w && w.offsetParent !== null) return w;

    w = document.querySelector(`[data-field="${label}"]`);
    if (w && w.offsetParent !== null) return w;

    w = [...document.querySelectorAll("[data-label]")]
        .find(el => normalizeLabel(el.dataset.label) === norm && el.offsetParent !== null);
    if (w) return w;

    w = [...document.querySelectorAll("[data-label]")]
        .find(el => el.dataset.label.includes(label) && el.offsetParent !== null);
    if (w) return w;

    w = [...document.querySelectorAll("[data-label]")]
        .find(el => normalizeLabel(el.dataset.label).includes(norm) && el.offsetParent !== null);
    if (w) return w;

    w = [...document.querySelectorAll("[data-field]")]
        .find(el =>
            normalizeLabel(el.getAttribute("data-field") || "").startsWith(norm) &&
            el.offsetParent !== null
        );
    if (w) return w;

    w = document.querySelector(`.multiEntryWrapper[data-field="${label}"]`);
    if (w && w.offsetParent !== null) return w;

    const candidates = [...document.querySelectorAll(".fieldRow")];
    for (const c of candidates) {
        if (c.offsetParent !== null && c.querySelector(".multiEntryRow")) {
            return c;
        }
    }

    console.warn("⚠️ [DYNAMIC CASE INPUT CONVERSION] No visible wrapper for:", label);
    return null;
}

// ======================================================
//  EXTRACT MULTI-ENTRY ROWS
// ======================================================
function extractMultiEntry(wrapper) {
    const rows = wrapper.querySelectorAll(".multiEntryRow");
    const results = [];

    rows.forEach(row => {
        const obj = {};
        const fields = row.querySelectorAll("[data-field]");

        fields.forEach(f => {
            const key = f.getAttribute("data-field");
            let value = f.value;

            if (f.tagName === "SELECT") {
                const opt = f.options[f.selectedIndex];
                value = opt?.value || opt?.text || value;
            }

            obj[key] = value;
        });

        if (Object.values(obj).some(v => v && v !== "")) {
            results.push(obj);
        }
    });

    return results;
}

// ======================================================
//  EXTRACT ALL VISIBLE FIELDS INSIDE A WRAPPER
// ======================================================
function extractVisibleFields(wrapper) {
    const inputs = wrapper.querySelectorAll("input, select, textarea");
    const data = {};

    inputs.forEach(el => {
        if (el.offsetParent === null) return;

        const key = el.getAttribute("data-field") || el.getAttribute("data-label");
        if (!key) return;

        let value = el.value;

        if (el.tagName === "SELECT") {
            const opt = el.options[el.selectedIndex];
            value = opt?.value || opt?.text || value;
        }

        if (value && value !== "Select --") {
            data[key] = value;
        }
    });

    return data;
}

// ======================================================
//  ⭐ MAIN FUNCTION — DIRECTORY-DRIVEN EXTRACTION
// ======================================================
export function convertVisibleCaseInputs(dynamicPayload) {
    const { dynamicId, triggerField } = dynamicPayload;

    const directoryEntry = dynamicEmailDirectoryCaseInput[dynamicId];

    console.log("📁 [DIRECTORY] Loaded entry for:", dynamicId, directoryEntry);

    if (!directoryEntry) {
        console.warn("⚠️ [DIRECTORY] No directory entry found for:", dynamicId);
        return {
            caseInputs: {},
            trigger: null
        };
    }

    const fields = directoryEntry.fields.map(f => f.key);

    console.log("📌 [DIRECTORY] Using fields:", fields);

    const caseInputs = {};
    let trigger = null;

    fields.forEach(label => {
        const wrapper = findVisibleWrapper(label);
        if (!wrapper) return;

        // ⭐ FIX: Multi-entry rows must be stored under the REAL key
        if (wrapper.querySelector(".multiEntryRow")) {
            const list = extractMultiEntry(wrapper);
            if (list.length > 0) {
                caseInputs[label] = list;   // ⭐ FIXED — no more label+"List"
            }
            return;
        }

        const visibleData = extractVisibleFields(wrapper);
        Object.assign(caseInputs, visibleData);
    });

    console.log("🟧 [DYNAMIC CASE INPUT CONVERSION] Extracted caseInputs:", caseInputs);

    // Detect trigger value from UI
    for (const key of Object.keys(caseInputs)) {
        if (normalizeLabel(key) === normalizeLabel(triggerField)) {
            trigger = caseInputs[key];
            break;
        }
    }

    console.log("🎯 [DYNAMIC CASE INPUT CONVERSION] trigger:", trigger);

    return {
        caseInputs,
        trigger
    };
}
