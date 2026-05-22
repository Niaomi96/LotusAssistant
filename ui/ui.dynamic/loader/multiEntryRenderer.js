// ======================================================
//  multiEntryRenderer.js
//  PURPOSE:
//  Generates proper multi-entry rows with BOTH:
//  - data-label (pretty label for UI)
//  - data-field (schema key: currency, amount, pspReference, etc.)
//  - ready for DynamicExtractInput.js and DynamicMEInput.js
// ======================================================

console.log("🟩 [UI GENERATOR] multiEntryRenderer.js loaded");

// ======================================================
//  UNIVERSAL NUMBER INPUT HELPER
// ======================================================
function createNumberInput(label, fieldKey, value = "") {
    const input = document.createElement("input");
    input.classList.add("multiEntryInput", "fieldInput");

    // Pretty label for UI
    input.dataset.label = label;

    // Schema key (must match schema: amount, currency, pspReference, etc.)
    input.dataset.field = fieldKey;

    input.type = "number";
    input.inputMode = "decimal";   // mobile numeric keypad
    input.min = "0";               // no negatives
    input.step = "0.01";           // cents allowed
    input.placeholder = "0.00";    // clean UI

    if (value !== undefined && value !== null && value !== "") {
        input.value = value;
    }

    return input;
}

// ======================================================
//  MANUAL REFUND CURRENCY
//  Schema:
//  "ManualRefund": {
//    "type": "multi-entry",
//    "fields": {
//      "currency": { "type": "dropdown" },
//      "amount":   { "type": "number"   },
//      "pspReference": { "type": "text" }
//    }
//  }
// ======================================================
export function createManualRefundCurrencyRow(data = null) {
    // If data exists but all values are empty, skip row
    if (data && Object.values(data).every(v => !v)) return null;

    const row = document.createElement("div");
    row.classList.add("multiEntryRow");

    // Currency (schema key: currency)
    const currency = document.createElement("select");
    currency.classList.add("multiEntryInput", "fieldInput");
    currency.dataset.label = "Currency";
    currency.dataset.field = "currency"; // schema key

    currency.innerHTML = `
        <option value="">--Select --</option>
        <option value="$">$</option>
        <option value="£">£</option>
    `;

    if (data?.currency) currency.value = data.currency;
    row.appendChild(currency);

    // Amount (schema key: amount) — numeric
    const amount = createNumberInput("Amount", "amount", data?.amount);
    row.appendChild(amount);

    // PSP Reference (schema key: pspReference) — text, can be letters + numbers
    const psp = document.createElement("input");
    psp.classList.add("multiEntryInput", "fieldInput");
    psp.dataset.label = "PSP Reference Number";
    psp.dataset.field = "pspReference"; // schema key
    psp.type = "text";

    if (data?.pspReference) psp.value = data.pspReference;
    row.appendChild(psp);

    return row;
}

// ======================================================
//  MISSING FUNDS
//  Schema keys:
//  currency
//  amount
//  pspReference
// ======================================================
export function createMissingFundsRow(data = null) {
    // Skip if data exists but all values are empty
    if (data && Object.values(data).every(v => !v)) return null;

    const row = document.createElement("div");
    row.classList.add("multiEntryRow");

    // Currency (schema key: currency)
    const currency = document.createElement("select");
    currency.classList.add("multiEntryInput", "fieldInput");
    currency.dataset.label = "Currency";
    currency.dataset.field = "currency"; // schema key

    currency.innerHTML = `
        <option value="">--Select --</option>
        <option value="$">$</option>
        <option value="£">£</option>
    `;

    if (data?.currency) currency.value = data.currency;
    row.appendChild(currency);

    // Amount (schema key: amount) — numeric
    const amount = createNumberInput("Amount", "amount", data?.amount);
    row.appendChild(amount);

    // PSP Reference (schema key: pspReference)
    const psp = document.createElement("input");
    psp.classList.add("multiEntryInput", "fieldInput");
    psp.dataset.label = "PSP Reference Number";
    psp.dataset.field = "pspReference"; // schema key
    psp.type = "text";

    if (data?.pspReference) psp.value = data.pspReference;
    row.appendChild(psp);

    return row;
}


// ======================================================
//  DEVICES NOT ON PLATFORM
//  (Using schema-style keys: deviceType, serialNumber)
// ======================================================
export function createDeviceRow(data = null) {
    if (data && Object.values(data).every(v => !v)) return null;

    const row = document.createElement("div");
    row.classList.add("multiEntryRow");

    // Device Type
    const device = document.createElement("select");
    device.classList.add("multiEntryInput", "fieldInput");
    device.dataset.label = "Device Type";
    device.dataset.field = "deviceType";
    device.innerHTML = `
        <option value="">--Select --</option>
        <option value="Saturn">Saturn</option>
        <option value="P400">P400</option>
        <option value="Air">Air</option>
    `;
    if (data?.deviceType) device.value = data.deviceType;
    row.appendChild(device);

    // Serial Number
    const serial = document.createElement("input");
    serial.classList.add("multiEntryInput", "fieldInput");
    serial.dataset.label = "Serial Number";
    serial.dataset.field = "serialNumber";
    serial.type = "text";
    if (data?.serialNumber) serial.value = data.serialNumber;
    row.appendChild(serial);

    return row;
}

// ======================================================
//  AUTO‑PATCH (Fix missing data-field)
//  If anything slipped through without data-field, mirror data-label
// ======================================================
export function fixExistingMultiEntryFields() {
    document.querySelectorAll(".multiEntryInput.fieldInput").forEach(el => {
        if (!el.dataset.field && el.dataset.label) {
            el.dataset.field = el.dataset.label;
            console.log(`🟩 [UI GENERATOR] Patched data-field="${el.dataset.field}"`);
        }
    });
}

// ======================================================
//  AUTO‑INJECTOR
//  Ensures each multi-entry wrapper has at least one row
// ======================================================
export function injectMultiEntryRows() {
    console.log("🟩 [UI GENERATOR] Injecting multi-entry rows...");

    // Manual Refund Currency
    const refundWrapper = document.querySelector('.multiEntryWrapper[data-label="Manual Refund Currency"]');
    if (refundWrapper && !refundWrapper.querySelector(".multiEntryRow")) {
        const row = createManualRefundCurrencyRow();
        if (row) refundWrapper.appendChild(row);
    }

    // Missing Funds
    const fundsWrapper = document.querySelector('.multiEntryWrapper[data-label="Missing Funds"]');
    if (fundsWrapper && !fundsWrapper.querySelector(".multiEntryRow")) {
        const row = createMissingFundsRow();
        if (row) fundsWrapper.appendChild(row);
    }

    // Devices Not on Platform
    const deviceWrapper = document.querySelector('.multiEntryWrapper[data-label="Devices Not on Platform"]');
    if (deviceWrapper && !deviceWrapper.querySelector(".multiEntryRow")) {
        const row = createDeviceRow();
        if (row) deviceWrapper.appendChild(row);
    }

    // 🧹 Remove any completely empty rows
    document.querySelectorAll(".multiEntryRow").forEach(row => {
        const inputs = row.querySelectorAll("input, select");
        const isEmpty = [...inputs].every(el => !el.value);
        if (isEmpty) row.remove();
    });

    fixExistingMultiEntryFields();
}
