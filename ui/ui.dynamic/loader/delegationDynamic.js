// ======================================================
//  delegationDynamic.js
//  UNIVERSAL EVENT DELEGATION LISTENER FOR DEO
//  - Works with ANY dynamic UI
//  - Captures ALL input changes inside schemaContainer
//  - NEW: Detects multi-entry wrappers and builds list arrays
// ======================================================

console.log("🟣 [DELEGATION] delegationDynamic.js loaded");

export function attachDelegationListeners(dynamicPayload, onChange) {
  console.log("🟣 [DELEGATION] attachDelegationListeners() CALLED", {
    dynamicPayload,
    isDynamic: dynamicPayload?.isDynamic
  });

  if (!dynamicPayload?.isDynamic) {
    console.warn("⚠️ [DELEGATION] Not a dynamic payload → listeners NOT attached");
    return;
  }

  const form =
    document.querySelector("#schemaContainer") ||
    document.querySelector("#caseForm");

  if (!form) {
    console.warn("⚠️ [DELEGATION] schemaContainer NOT FOUND");
    return;
  }

  if (form.__delegationAttached) {
    console.log("⏩ [DELEGATION] Delegation already attached");
    return;
  }

  form.__delegationAttached = true;

  const handler = (e) => {
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;
    if (!["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName)) return;

    console.log("🔥 [DELEGATION] Change detected:", {
      tag: el.tagName,
      name: el.name,
      value: el.value,
      type: el.type
    });

    // ======================================================
    //  🧩 NEW: Detect multi-entry wrapper
    // ======================================================
    const wrapper = el.closest(".multiEntryWrapper");
    if (wrapper) {
      const label = wrapper.dataset.label || "Unknown List";
      const rows = [];

      wrapper.querySelectorAll(".multiEntryRow").forEach((row) => {
        const obj = {};
        row.querySelectorAll("input, select, textarea").forEach((field) => {
          const fieldLabel = field.dataset.field || field.name || field.id;
          obj[fieldLabel] = field.value;
        });
        rows.push(obj);
      });

      console.log(`📦 [DELEGATION] Multi-entry detected → ${label}`, rows);
      dynamicPayload.caseInputs = dynamicPayload.caseInputs || {};
      dynamicPayload.caseInputs[label] = rows;
    }

    console.log("🚀 [DELEGATION] Calling onChange() → Orchestrator should run now");
    onChange();
  };

  form.addEventListener("input", handler);
  form.addEventListener("change", handler);

  console.log("🟢 [DELEGATION] Universal listeners attached to schemaContainer");
}
