// ======================================================
//  ui.Scripts/dynamicemailRender.js
//  PURE UI RENDERER — TEMPLATE-ONLY VERSION
// ======================================================

console.log("[UI RENDER] Dynamic Email Renderer Loaded");

// ------------------------------------------------------
// MAIN RENDER FUNCTION (TEMPLATE-ONLY)
// ------------------------------------------------------
export function renderEmailForUI(resolvedEmail, dynamicId = null, trigger = null, isDynamic = false) {

    console.log("🔍 [UI RENDER] Starting UI render:", {
        dynamicId,
        trigger,
        isDynamic,
        resolvedEmail
    });

    // --------------------------------------------------
    // SAFETY: Ensure template exists
    // --------------------------------------------------
    if (!resolvedEmail || !Array.isArray(resolvedEmail.template)) {
        console.warn("⚠️ [UI RENDER] Invalid resolvedEmail, using empty template");
        return {
            dynamicId,
            trigger,
            isDynamic,
            template: []
        };
    }

    const template = resolvedEmail.template;

    // --------------------------------------------------
    // FINAL UI OUTPUT (TEMPLATE ONLY)
    // --------------------------------------------------
    const finalOutput = {
        dynamicId,
        trigger,
        isDynamic,
        template,
        resolvedEmail
    };

    console.log("📨 [UI RENDER FINAL OUTPUT]", finalOutput);

    return finalOutput;
}
