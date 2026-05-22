// ======================================================
//  DynamicExtractInput.js
// ======================================================

import { processMultiEntryInputs } from "./DynamicMEInput.js";

// ⭐ NEW — MULTI‑ENTRY RENDERER
import {
  injectMultiEntryRows,
  fixExistingMultiEntryFields
} from "./multiEntryRenderer.js";

// ======================================================
//  ROUTER
// ======================================================
export function resolveDynamicId(dynamicId, ticketType = "") {
  const cleanTicket = (ticketType || "").trim();

  console.log("🧭 [ROUTER] Incoming dynamicId:", dynamicId, "ticketType:", cleanTicket);

  // KYC Inquiry
  if (dynamicId === "payments.kycInquiry") {
    if (cleanTicket === "Setup KYC") return "payments.kycInquiry.setup";
    if (cleanTicket === "Broken KYC") return "payments.kycInquiry.broken";
  }

  // ADYEN Inquiry
  if (dynamicId === "payments.adyenInquiry") {
    switch (cleanTicket) {
      case "Volume Adjustment": return "payments.adyenInquiry.volumeAdjustment";
      case "Missing Funds": return "payments.adyenInquiry.missingFunds";
      case "ENP Not on Platform": return "payments.adyenInquiry.enp";
      case "Tax Form": return "payments.adyenInquiry.taxForm";
      case "Cancel Capital Offer": return "payments.adyenInquiry.cancelCapital";
      case "Other": return "payments.adyenInquiry.other";
    }
  }

  // Money Tribe
  if (dynamicId === "payments.moneyTribe") return "payments.moneyTribe";

  // Billing
  if (dynamicId === "billing.billing") return "billing.billing";

  // Manual Refund
  if (dynamicId === "payments.manualRefund") return "payments.manualRefund";

  // Feedback Review
  if (dynamicId === "feedbackReview.nps") return "feedbackReview.nps";

  return dynamicId;
}

// ======================================================
//  ⭐ MAIN EXTRACTION FUNCTION
// ======================================================
export function extractTemplateInputs(
  caseInputs = {},
  moduleConfig = {},
  ticketType = ""
) {
  console.log("📥 [EXTRACT INPUT] Raw caseInputs:", caseInputs);

  // ⭐ NEW — Ensure multi‑entry rows exist BEFORE extraction
  setTimeout(() => {
    console.log("🟩 [EXTRACT] Injecting multi-entry rows before extraction");
    injectMultiEntryRows();
    fixExistingMultiEntryFields();
  }, 50);

  // ======================================================
  //  BINDER MAPS
  // ======================================================
  const binderMaps = {
    "payments.kycInquiry.setup": {
      "Agent Name": "Agent Name",
      "Agent Email": "Agent Email"
    },

    "payments.kycInquiry.broken": {
      "Agent Name": "Agent Name",
      "Agent Email": "Agent Email"
    },

    "payments.manualRefund": {
      "Manual Refund": "Manual Refund",
      "Manual Refund Currency": "Manual Refund Currency",
      "Currency": "Currency",
      "Amount": "Amount",
      "PSP Reference Number": "PSP Reference Number",
      "Date (Calendar)": "Date (Calendar)"
    },

    "billing.billing": {
      "Who": "Who",
      "What": "What"
    },

    "feedbackReview.nps": {
      "Review": "Review",
      "Case Number": "Case Number"
    },

    "payments.moneyTribe": {
      "What": "What",
      "Date (Calendar)": "Date (Calendar)"
    },

    "payments.adyenInquiry.volumeAdjustment": {
      "Adyen Ticket Type": "Adyen Ticket Type",
      "Account Holder Name": "Account Holder Name",
      "Account Holder ID": "Account Holder ID",
      "Account Reference Number": "Account Reference Number",
      "Account Name": "Account Name",
      "Volume Adjustment": "Volume Adjustment"
    },

    "payments.adyenInquiry.missingFunds": {
      "Adyen Ticket Type": "Adyen Ticket Type",
      "Account Holder Name": "Account Holder Name",
      "Account Holder ID": "Account Holder ID",
      "Account Reference Number": "Account Reference Number",
      "Account Name": "Account Name",
      "Currency": "Currency",
      "Amount": "Amount",
      "PSP Reference Number": "PSP Reference Number"
    },

    "payments.adyenInquiry.enp": {
      "Adyen Ticket Type": "Adyen Ticket Type",
      "Account Holder Name": "Account Holder Name",
      "Account Holder ID": "Account Holder ID",
      "Account Reference Number": "Account Reference Number",
      "Account Name": "Account Name",
      "Device Type": "Device Type",
      "Serial Number": "Serial Number"
    },

    "payments.adyenInquiry.taxForm": {
      "Who": "Who",
      "Adyen Ticket Type": "Adyen Ticket Type",
      "Account Holder Name": "Account Holder Name",
      "Account Holder ID": "Account Holder ID",
      "Account Reference Number": "Account Reference Number",
      "Account Name": "Account Name"
    },

    "payments.adyenInquiry.cancelCapital": {
      "Who": "Who",
      "Adyen Ticket Type": "Adyen Ticket Type",
      "Account Holder Name": "Account Holder Name",
      "Account Holder ID": "Account Holder ID",
      "Account Reference Number": "Account Reference Number",
      "Account Name": "Account Name"
    },

    "payments.adyenInquiry.other": {
      "Who": "Who",
      "Adyen Ticket Type": "Adyen Ticket Type",
      "Account Holder Name": "Account Holder Name",
      "Account Holder ID": "Account Holder ID",
      "Account Reference Number": "Account Reference Number",
      "Account Name": "Account Name",
      "Other": "Other"
    }
  };

  // ======================================================
  //  CLEAN + NORMALIZED STORAGE
  // ======================================================
  const clean = {};
  const normalized = {};

  // Flatten nested fields
  const flattened = {};
  for (const key in caseInputs) {
    const value = caseInputs[key];
    if (value && typeof value === "object" && value.fields) {
      for (const innerKey in value.fields) {
        flattened[innerKey] = value.fields[innerKey];
      }
    } else {
      flattened[key] = value;
    }
  }

  // Normalize keys
  for (const key in flattened) {
    const lower = key.toLowerCase().trim();
    const noSpaces = lower.replace(/\s+/g, "");
    normalized[lower] = flattened[key];
    normalized[noSpaces] = flattened[key];
  }

  // ======================================================
  //  ⭐ APPLY MULTI‑ENTRY NORMALIZATION (ME ENGINE)
  // ======================================================
  const meProcessed = processMultiEntryInputs(normalized);

  for (const key in meProcessed) {
    normalized[key.toLowerCase().trim()] = meProcessed[key];
    normalized[key.replace(/\s+/g, "").toLowerCase()] = meProcessed[key];
  }

  // ======================================================
  //  🔍 DEBUG: SHOW FINAL NORMALIZED LIST FIELDS (POST‑ME)
  // ======================================================
  console.log("🔍 [EXTRACT DEBUG] FINAL NORMALIZED INPUTS (post‑ME):");

  for (const key in normalized) {
    const val = normalized[key];

    if (typeof val === "string" && val.includes("–")) {
      console.log(`   📌 ${key}:`);
      console.log(
        val
          .split("\n")
          .map(line => "      • " + line)
          .join("\n")
      );
    }
  }

  // ======================================================
  //  TEMPLATE LOGIC
  // ======================================================
  const placeholders = moduleConfig.templateLogic?.placeholders || {};

  const rawDynamicId = moduleConfig.dynamicId || "";
  const resolvedId = resolveDynamicId(rawDynamicId, ticketType);
  const binderMap = binderMaps[resolvedId] || {};

  for (const fieldName in placeholders) {
    clean[fieldName] = "";
  }

  const selectedTemplate =
    moduleConfig.templateLogic?.templatesByTicketType?.[ticketType] || [];

  let finalEmail = Array.isArray(selectedTemplate)
    ? selectedTemplate.join("\n")
    : "";

  // ======================================================
  //  ⭐ BINDING STEP
  // ======================================================
  for (const placeholderKey in placeholders) {
    const token = placeholders[placeholderKey];

    let actualSchemaKey = binderMap[placeholderKey];

    if (!actualSchemaKey) {
      const normalizedPlaceholder = placeholderKey
        .toLowerCase()
        .replace(/\s+/g, "");
      actualSchemaKey = normalizedPlaceholder;
    }

    const lower = actualSchemaKey.toLowerCase().trim();
    const noSpaces = lower.replace(/\s+/g, "");

    const value =
      normalized[lower] ||
      normalized[noSpaces] ||
      "";

    finalEmail = finalEmail.replaceAll(token, value);
  }

  return {
    resolvedFields: clean,
    finalEmail
  };
}
