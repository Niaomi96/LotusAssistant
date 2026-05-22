// ======================================================
//  ui.dynamic/loader/dynamicloader.js
// ======================================================

console.log("🟣 [UI DYNAMIC LOADER] Initializing dynamic email system...");

// Payments
import manualRefund from "../payments/manualRefund.js";
import moneyTribe from "../payments/moneyTribe.js";
import adyenInquiry from "../payments/adyenInquiry.js";
import kycInquiry from "../payments/kycInquiry.js";

// Feedback
import nps from "../feedback/nps.js";

// Billing
import billing from "../billing/billing.js";

// ⭐ IMPORT DIRECTORY CASE INPUT (UI FIELD KEYWORDS)
import { dynamicEmailDirectoryCaseInput } from "./dynamicEmailDirectoryCaseInput.js";

// ------------------------------------------------------
// MODULE REGISTRY
// ------------------------------------------------------
const dynamicEmails = {};

function normalizeId(id) {
  return String(id).trim();
}

function register(emailModule) {
  if (!emailModule?.dynamicId) return;

  const id = normalizeId(emailModule.dynamicId);
  dynamicEmails[id] = emailModule;

  console.log(`🟢 Loaded dynamic module: ${id}`);
}

// Register all modules
register(manualRefund);
register(moneyTribe);
register(adyenInquiry);
register(kycInquiry);
register(nps);
register(billing);

// Expose globally
window.dynamicEmails = dynamicEmails;

// ------------------------------------------------------
// ⭐ FIXED MODULE LOADER FOR ORCHESTRATOR
// ------------------------------------------------------
export function loadDynamicModule(dynamicId) {
  const id = String(dynamicId).trim();
  const moduleConfig = dynamicEmails[id] || null;

  if (!moduleConfig) {
    console.warn("⚠️ No module found for:", id);
    return null;
  }

  // ⭐ Pull UI extraction keywords from directoryCaseInput
  const directoryEntry =
    dynamicEmailDirectoryCaseInput[id] ||
    moduleConfig.directoryEntry ||
    null;

  return {
    moduleConfig,                     // email logic keywords
    schemaEntry: moduleConfig.schemaEntry || {}, // optional
    directoryEntry                    // UI extraction keywords
  };
}

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------
export default dynamicEmails;
export { dynamicEmails };

