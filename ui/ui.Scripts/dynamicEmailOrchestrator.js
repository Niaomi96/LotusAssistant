// ======================================================
//  ui.Scripts/dynamicEmailOrchestrator.js
// ======================================================

console.log("🧠 [ORCHESTRATOR] Dynamic Email Engine Loaded");

import { loadDynamicModule } from "../ui.dynamic/loader/dynamicloader.js";
import { convertVisibleCaseInputs } from "../ui.dynamic/loader/dynamicCaseInputConversion.js";
import { dynamicCaseInputConsolidation } from "../ui.dynamic/loader/dynamicCaseInputConsolidation.js";
import { extractTemplateInputs } from "../ui.dynamic/loader/DynamicExtractInput.js";
import { renderEmailForUI } from "./dynamicemailRender.js";

// ======================================================
// ⭐ FORMATTERS FOR ALL MULTI‑ENTRY MODULES
// ======================================================

// Manual Refund + Missing Funds
function formatCurrencyAmountPSP(rows) {
  if (!Array.isArray(rows)) rows = [rows];

  return `
    <div class="me-block">
      ${rows
        .map(r => {
          const currency = r.Currency || "";
          const amount = r.Amount || "";
          const psp = r["PSP Reference Number"] || "";

          return `
            <div class="me-line">
              <span class="me-amount">${currency}${amount}</span>
              <span class="me-psp">PSP: ${psp}</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

// Devices Not on Platform
function formatDevices(rows) {
  if (!Array.isArray(rows)) rows = [rows];

  return `
    <div class="me-block">
      ${rows
        .map(r => {
          const device = r["Device Type"] || "";
          const serial = r["Serial Number"] || "";

          return `
            <div class="me-line">
              <span class="me-amount">${device}</span>
              <span class="me-psp">Serial: ${serial}</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

export async function renderEmailForUIOrchestrator(dynamicPayload = {}) {
  const { dynamicId } = dynamicPayload;

  // ======================================================
  // 0️⃣ Validate dynamicId
  // ======================================================
  if (!dynamicId) {
    console.log("🚫 [ORCHESTRATOR] No dynamicId provided — returning empty email");
    return renderEmailForUI({ template: [] }, null, null, false);
  }

  // ======================================================
  // 1️⃣ Load module + directory entry
  // ======================================================
  const modulePackage = loadDynamicModule(dynamicId);

  if (!modulePackage) {
    console.log("🚫 [ORCHESTRATOR] No module package found for:", dynamicId);
    return renderEmailForUI({ template: [] }, dynamicId, null, true);
  }

  const { moduleConfig, directoryEntry } = modulePackage;
  const triggerField = directoryEntry?.triggerField || "What";

  // ======================================================
  // 2️⃣ Extract visible UI inputs
  // ======================================================
  const extraction = convertVisibleCaseInputs({
    dynamicId,
    triggerField
  });

  const { caseInputs, trigger } = extraction;

  console.log("📥 [ORCHESTRATOR] Raw extracted inputs:", caseInputs);
  console.log("🎯 [ORCHESTRATOR] Trigger detected:", trigger);

  // ======================================================
  // 3️⃣ Consolidate inputs
  // ======================================================
  const consolidated = dynamicCaseInputConsolidation({
    dynamicId,
    directoryEntry,
    caseInputs,
    trigger
  });

  console.log("🧩 [ORCHESTRATOR] Consolidated payload:", consolidated);

  const realCaseInputs = consolidated.caseInputs || {};

  console.log("🧩 [ORCHESTRATOR] Extracting ONLY real caseInputs:", realCaseInputs);

  // ======================================================
  // 4️⃣ Extract template-ready fields + bind placeholders
  // ======================================================
  let { resolvedFields, finalEmail } = extractTemplateInputs(
    realCaseInputs,
    moduleConfig,
    trigger
  );

  // ======================================================
  // ⭐ APPLY PRETTY FORMATTING FOR ALL ME MODULES
  // ======================================================

  // Manual Refund Currency
  if (realCaseInputs["Manual Refund Currency"]) {
    finalEmail = finalEmail.replace(
      "{RefundDetails}",
      formatCurrencyAmountPSP(realCaseInputs["Manual Refund Currency"])
    );
  }

  // Missing Funds
  if (realCaseInputs["Missing Funds"]) {
    finalEmail = finalEmail.replace(
      "{MissingFundsDetails}",
      formatCurrencyAmountPSP(realCaseInputs["Missing Funds"])
    );
  }

  // Devices Not on Platform
  if (realCaseInputs["Devices Not on Platform"]) {
    finalEmail = finalEmail.replace(
      "{DeviceDetails}",
      formatDevices(realCaseInputs["Devices Not on Platform"])
    );
  }

  console.log("✨ [ORCHESTRATOR] Template-ready context:", resolvedFields);
  console.log("💬 [ORCHESTRATOR] Final rendered email text:\n", finalEmail);

  // ======================================================
  // 5️⃣ Send to UI
  // ======================================================
  return renderEmailForUI(
    { template: finalEmail.split("\n") },
    dynamicId,
    trigger,
    true
  );
}

export default renderEmailForUIOrchestrator;






