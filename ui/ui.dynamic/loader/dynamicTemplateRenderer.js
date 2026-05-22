// ======================================================
//  ui.dynamic/renderer/dynamicTemplateRenderer.js
//  PURPOSE: Render final email text from:
//      - module.templatesByTicketType
//      - resolvedFields (from conversion engine)
// ======================================================

console.log("🟣 [DYNAMIC RENDERER] dynamicTemplateRenderer.js loaded");

/**
 * Renders a dynamic email template using resolved fields.
 *
 * @param {object} moduleConfig - The dynamic module (contains templates + placeholders)
 * @param {string} triggerValue - The selected trigger (e.g., "Missing Funds")
 * @param {object} resolvedFields - Output from dynamicTriggerTemplateConversion.js
 * @returns {string} Final rendered email text
 */
export function renderDynamicTemplate(moduleConfig, triggerValue, resolvedFields = {}) {
    console.log("💜 [DYNAMIC RENDERER] Starting render...", {
        moduleConfig,
        triggerValue,
        resolvedFields
    });

    if (!moduleConfig || !triggerValue) {
        console.warn("⚠️ [DYNAMIC RENDERER] Missing moduleConfig or triggerValue");
        return "";
    }

    // ======================================================
    // 1. SELECT TEMPLATE BASED ON TRIGGER
    // ======================================================
    const templateLines =
        moduleConfig.templateLogic?.templatesByTicketType?.[triggerValue] || null;

    if (!templateLines) {
        console.warn("⚠️ [DYNAMIC RENDERER] No template found for trigger:", triggerValue);
        return "";
    }

    // ======================================================
    // 2. BUILD PLACEHOLDER MAP
    // ======================================================
    const placeholderMap = moduleConfig.templateLogic?.placeholders || {};

    // ======================================================
    // 3. RENDER EACH LINE
    // ======================================================
    const renderedLines = templateLines.map(line => {
        let rendered = line;

        // Replace each placeholder
        for (const key in placeholderMap) {
            const placeholder = placeholderMap[key]; // e.g. "{{accountName}}"
            const cleanKey = placeholder.replace(/[{}]/g, ""); // accountName

            const value =
                resolvedFields[key] ||
                resolvedFields[cleanKey] ||
                "";

            rendered = rendered.replace(placeholder, value);
        }

        return rendered;
    });

    // ======================================================
    // 4. JOIN INTO FINAL EMAIL STRING
    // ======================================================
    const finalEmail = renderedLines.join("\n");

    console.log("💌 [DYNAMIC RENDERER] Final Email Output:\n", finalEmail);

    return finalEmail;
}
