// ======================================================
//  dynamicTextContextOutput.js
//  PURPOSE: Final text rendering + placeholder injection
// ======================================================

console.log("🟣 [TEXT OUTPUT] dynamicTextContextOutput.js loaded");

export function renderTextOutput(templateLines = [], resolvedFields = {}) {
    if (!Array.isArray(templateLines)) {
        console.warn("⚠️ [TEXT OUTPUT] templateLines is not an array");
        return "";
    }

    let output = templateLines.join("\n");

    // Replace all {{Field}} placeholders
    for (const [key, value] of Object.entries(resolvedFields)) {
        const placeholder = `{{${key}}}`;
        const safeValue = value ?? "";
        output = output.replaceAll(placeholder, safeValue);
    }

    return output;
}
