// ======================================================
//  DynamicMEInput.js
// ======================================================

console.log("🟦 [ME ENGINE] DynamicMEInput.js loaded");

// ======================================================
//  RESET
// ======================================================
export function resetMEInputs() {
    return {};
}

// ======================================================
//  HELPERS
// ======================================================
function normalizeKey(key = "") {
    return String(key).trim().toLowerCase().replace(/\s+/g, "");
}

function normalizeLabel(label = "") {
    return String(label).trim();
}

// ======================================================
//  FORMATTERS
// ======================================================

// Money-style formatter (Manual Refund + Missing Funds)
function flattenCurrencyAmountPSP(rowObj) {
    const currency = rowObj.currency || rowObj.Currency || "";
    const amountRaw = rowObj.amount || rowObj.Amount || "";
    const psp = rowObj.pspReference || rowObj["PSP Reference Number"] || "";

    let amount = amountRaw;
    if (amountRaw) {
        const num = parseFloat(amountRaw);
        if (!isNaN(num)) amount = num.toFixed(2);
    }

    let line = "";
    if (currency || amount) line += `${currency}${amount}`;
    if (psp) line += ` – ${psp}`;
    return line.trim();
}

// Device-style formatter
function flattenDeviceRow(rowObj) {
    const device = rowObj.deviceType || rowObj["Device Type"] || "";
    const serial = rowObj.serialNumber || rowObj["Serial Number"] || "";

    let line = "";
    if (device) line += device;
    if (serial) line += ` – ${serial}`;
    return line.trim();
}

// ⭐ SMART FALLBACK — matches the same style as the others
function smartFallback(rowObj) {
    const keys = Object.keys(rowObj).map(k => k.toLowerCase());

    // If it looks like a money row → use money formatter
    if (keys.includes("currency") || keys.includes("amount")) {
        return flattenCurrencyAmountPSP(rowObj);
    }

    // If it looks like a device row → use device formatter
    if (keys.includes("devicetype") || keys.includes("serialnumber")) {
        return flattenDeviceRow(rowObj);
    }

    // Otherwise → clean join
    return Object.values(rowObj).filter(Boolean).join(" – ");
}

// ======================================================
//  MAIN PROCESSOR
// ======================================================
export function processMultiEntryInputs(caseInputs = {}) {
    const output = {};

    for (const key in caseInputs) {
        const value = caseInputs[key];

        const isList =
            Array.isArray(value) &&
            value.length > 0 &&
            typeof value[0] === "object";

        if (!isList) continue;

        const normalizedRows = value.map(row => {
            const cleanRow = {};
            for (const col in row) {
                cleanRow[normalizeLabel(col)] = row[col];
            }
            return cleanRow;
        });

        const k = normalizeKey(key);

        // Manual Refund
        if (k === "manualrefund") {
            output[key] = normalizedRows
                .map(r => flattenCurrencyAmountPSP(r))
                .filter(Boolean)
                .join("\n");
            continue;
        }

        // Missing Funds
        if (k === "missingfunds") {
            output[key] = normalizedRows
                .map(r => flattenCurrencyAmountPSP(r))
                .filter(Boolean)
                .join("\n");
            continue;
        }

        // Devices Not on Platform
        if (k === "devicesnotonplatform") {
            output[key] = normalizedRows
                .map(r => flattenDeviceRow(r))
                .filter(Boolean)
                .join("\n");
            continue;
        }

        // ⭐ SMART FALLBACK (NO JSON EVER)
        output[key] = normalizedRows
            .map(r => smartFallback(r))
            .filter(Boolean)
            .join("\n");
    }

    return output;
}

// ======================================================
//  UI FIXES FOR MULTI-ENTRY SECTIONS
//  (Scroller + Number Input Spinner Fix)
// ======================================================

function applyMultiEntryUIFixes() {
    const selectors = [
        '[data-label="Manual Refund Currency"]',
        '[data-label="Missing Funds"]',
        '[data-label="Devices Not on Platform"]'
    ];

    selectors.forEach(sel => {
        const wrapper = document.querySelector(`.multiEntryWrapper.fieldInput${sel}`);
        if (!wrapper) return;

        // Scroll behavior
        wrapper.style.maxHeight = '300px';
        wrapper.style.overflowY = 'auto';
        wrapper.style.overflowX = 'hidden';
        wrapper.style.paddingRight = '6px';
        wrapper.style.boxSizing = 'border-box';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '8px';

        // Number input spinner fix
        wrapper.querySelectorAll('input[type="number"]').forEach(input => {
            input.style.appearance = 'auto';
            input.style.MozAppearance = 'textfield';
        });
    });
}

// Run after DOM loads
document.addEventListener('DOMContentLoaded', applyMultiEntryUIFixes);

// Re-run after adding new rows
document.addEventListener('click', e => {
    if (e.target.classList.contains('multiEntryAddBtn')) {
        setTimeout(applyMultiEntryUIFixes, 10);
    }
});

// ======================================================
//  DEFAULT EXPORT
// ======================================================
export default {
    resetMEInputs,
    processMultiEntryInputs
};
