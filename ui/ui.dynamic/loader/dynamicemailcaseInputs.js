// ======================================================
//  ui.dynamic/loader/dynamicemailcaseInputs.js
//  PURPOSE:
//  - Attach listeners to all visible case input fields
//  - Notify UI when inputs change so orchestrator can re-run
// ======================================================

console.log("🟣 [DYNAMIC LISTENERS] dynamicemailcaseInputs.js loaded");

// ------------------------------------------------------
// Attach listeners to all visible case inputs
// ------------------------------------------------------
export function attachDynamicListeners(dynamicPayload, onChange) {
    console.log("🟣 [DYNAMIC LISTENERS] attachDynamicListeners() CALLED", {
        dynamicPayload,
        isDynamic: dynamicPayload?.isDynamic
    });

    if (!dynamicPayload || !dynamicPayload.isDynamic) {
        console.warn("⚠️ [DYNAMIC LISTENERS] Not a dynamic payload → listeners NOT attached");
        return;
    }

    console.log("🟢 [DYNAMIC LISTENERS] Searching for inputs...");

    // ⭐ SINGLE-FIELD INPUTS
    const singleInputs = document.querySelectorAll("[data-case-input]");

    // ⭐ MULTI-ENTRY INPUTS
    const multiInputs = document.querySelectorAll(".multiEntryRow [data-field]");

    console.log(`🟡 [DYNAMIC LISTENERS] Found ${singleInputs.length} single inputs`);
    console.log(`🟡 [DYNAMIC LISTENERS] Found ${multiInputs.length} multi-entry inputs`);

    const allInputs = [...singleInputs, ...multiInputs];

    if (!allInputs.length) {
        console.warn("⚠️ [DYNAMIC LISTENERS] No inputs found → NOTHING TO LISTEN TO");
        return;
    }

    allInputs.forEach(input => {
        console.log("🔍 [DYNAMIC LISTENERS] Inspecting input:", {
            element: input,
            name: input.name || input.getAttribute("data-field"),
            value: input.value
        });

        // Avoid double-binding
        if (input.__dynamicListenerAttached) {
            console.log("⏩ [DYNAMIC LISTENERS] Already attached → skipping");
            return;
        }

        input.__dynamicListenerAttached = true;

        const handler = () => {
            console.log("🔄 [DYNAMIC LISTENER] Input changed!", {
                name: input.name || input.getAttribute("data-field"),
                value: input.value
            });

            console.log("🚀 [DYNAMIC LISTENER] Calling onChange() → Orchestrator should run now");
            onChange();
        };

        input.addEventListener("input", handler);
        input.addEventListener("change", handler);

        console.log("🟢 [DYNAMIC LISTENERS] Listener ATTACHED");
    });

    console.log("🟣 [DYNAMIC LISTENERS] All listeners successfully attached.");
}
