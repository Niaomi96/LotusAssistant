// ======================================================
//  INDEX.JS — FULLY UPDATED (STATIC EMAIL FIX + CASE-FIRST RENDER)
// ======================================================

console.log("🟣 [INDEX] index.js LOADED");

import { loadAllData } from "../../logic/logic.Data/dataIndex.js";
import { processCustomerMessage } from "../../logic/logic.Orchestrator/workflowOrchestrator.js";

import { DropdownUI } from "./ui.dropdown.js";
import { renderSchema } from "./render.js";
import { initVisibilityEngine } from "./hideandseek.js";
import { renderEmailOutput } from "./basicemail.js";

import renderEmailForUIOrchestrator from "./dynamicEmailOrchestrator.js";
import { attachDelegationListeners } from "../ui.dynamic/loader/delegationDynamic.js";

import "./TSKT2.js";
import { initExpandHandler } from "./expandhandler.js";
import "./calendar.js";

import "../ui.dynamic/loader/dynamicemailcaseInputs.js";
import "../ui.dynamic/loader/dynamicemailTrigger.js";
import "./triggerEngine.js";

// ======================================================
// ⭐ UI STATE
// ======================================================

let DATA = null;
let CURRENT_SCHEMA_ID = null;
let CURRENT_EMAIL_TEMPLATE = null;
let CURRENT_DYNAMIC_PAYLOAD = null;

// ======================================================
// ⭐ MULTI‑ENTRY UI FIXES
// ======================================================

function applyMultiEntryUIFixes() {
  const wrappers = document.querySelectorAll(".multiEntryWrapper.fieldInput");

  wrappers.forEach(wrapper => {
    wrapper.style.maxHeight = "300px";
    wrapper.style.overflowY = "auto";
    wrapper.style.overflowX = "hidden";
    wrapper.style.paddingRight = "6px";
    wrapper.style.boxSizing = "border-box";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "8px";

    wrapper.querySelectorAll('input[type="number"]').forEach(input => {
      input.style.appearance = "auto";
      input.style.MozAppearance = "textfield";
    });
  });
}

// ======================================================
// ⭐ CASE INPUT COLLECTOR
// ======================================================

function collectCaseInputs() {
  if (!CURRENT_DYNAMIC_PAYLOAD?.directoryEntry?.fields?.length) {
    console.log("⏳ [INDEX] directoryEntry.fields not ready — using previous values");
    return CURRENT_DYNAMIC_PAYLOAD.caseInputs || {};
  }

  const result = {};
  const fields = CURRENT_DYNAMIC_PAYLOAD.directoryEntry.fields;

  console.log("🔍 [INDEX] Collecting ONLY allowed fields:", fields.map(f => f.key));

  fields.forEach(field => {
    const { key, selector, type } = field;

    if (!selector) {
      console.log(`⚠️ [INDEX] No selector for key "${key}"`);
      return;
    }

    const elements = document.querySelectorAll(selector);
    if (!elements.length) {
      console.log(`⚠️ [INDEX] No DOM element found for selector: ${selector}`);
      return;
    }

    if (type === "multi-entry") {
      const rows = [];

      elements.forEach(wrapper => {
        wrapper.querySelectorAll(".multiEntryRow").forEach(row => {
          const obj = {};

          row.querySelectorAll("input, select, textarea").forEach(fieldEl => {
            const fieldName =
              fieldEl.dataset.field ||
              fieldEl.name ||
              fieldEl.id ||
              "Unknown";

            obj[fieldName] = fieldEl.value.trim();
          });

          rows.push(obj);
        });
      });

      console.log(`📦 [INDEX] Multi-entry collected for "${key}":`, rows);
      result[key] = rows;
      return;
    }

    result[key] = elements[0].value || "";
  });

  console.log("🧩 [INDEX] FINAL collected caseInputs:", result);
  return result;
}

// ======================================================
// ⭐ INIT
// ======================================================

async function init() {
  console.log("🟣 [INDEX] init() START");

  DATA = await loadAllData();
  console.log("🟣 [INDEX] DATA loaded");

  DropdownUI.init({
    categories: DATA.categoryList,
    subcategories: DATA.subcategoryList,
    mainList: document.getElementById("mainList"),
    mainDisplayText: document.getElementById("mainDisplayText"),
    subWrapper: document.getElementById("subWrapper"),
    subList: document.getElementById("subList"),
    subDisplayText: document.getElementById("subDisplayText"),
    onSelect: handleDropdownSelection
  });

  console.log("🟣 [INDEX] DropdownUI.init() COMPLETE");
}

init();

// ======================================================
// ⭐ DYNAMIC EMAIL ENGINE
// ======================================================

async function runDynamicEmailEngine() {
  console.log("🚀 [ENGINE] runDynamicEmailEngine() FIRED");

  if (!CURRENT_DYNAMIC_PAYLOAD) return;
  if (!CURRENT_DYNAMIC_PAYLOAD.isDynamic) return;

  const collected = collectCaseInputs();
  CURRENT_DYNAMIC_PAYLOAD.caseInputs = collected;

  const emailUI = await renderEmailForUIOrchestrator(CURRENT_DYNAMIC_PAYLOAD);

  CURRENT_EMAIL_TEMPLATE = emailUI;
  renderEmailOutput(emailUI);
}

// ======================================================
// ⭐ DROPDOWN HANDLER (STATIC EMAIL FIX APPLIED)
// ======================================================

async function handleDropdownSelection({ schemaId }) {
  console.log("🟡 [INDEX] Dropdown FIRED → schemaId:", schemaId);
  if (!schemaId) return;

  CURRENT_SCHEMA_ID = schemaId;

  const finalResult = await processCustomerMessage({}, schemaId);
  console.log("🟡 [INDEX] processCustomerMessage() RESULT:", finalResult);

  // ======================================================
  // ⭐ STATIC EMAIL DETECTION — FIXED
  // ======================================================

  const basicStatic =
    finalResult?.finalEmail ||
    finalResult?.emailTemplate ||
    finalResult?.staticEmail ||
    finalResult?.template ||
    null;

  if (basicStatic) {
    console.log("📧 [INDEX] STATIC EMAIL DETECTED — CASE FIRST, EMAIL SECOND");

    // 1️⃣ Render CASE FIRST
    renderSchema(finalResult?.caseOutput || null);
    applyMultiEntryUIFixes();
    initVisibilityEngine();
    initExpandHandler();

    // 2️⃣ Render EMAIL AFTER UI (fixes missing case)
    setTimeout(() => {
      CURRENT_EMAIL_TEMPLATE = basicStatic;
      renderEmailOutput(basicStatic);
      console.log("📧 [INDEX] STATIC EMAIL RENDERED AFTER CASE");
    }, 0);

    return;
  }

  // ======================================================
  // ⭐ DYNAMIC PAYLOAD
  // ======================================================

  const dynamicPayload = {
    dynamicId: finalResult.dynamicId || CURRENT_SCHEMA_ID,
    isDynamic: finalResult.isDynamic ?? true,
    schemaEntry: finalResult.schemaEntry ?? {},
    directoryEntry: finalResult.directoryEntry ?? {},
    caseInputs: {}
  };

  CURRENT_DYNAMIC_PAYLOAD = dynamicPayload;

  renderSchema(finalResult?.caseOutput || null);
  applyMultiEntryUIFixes();

  initVisibilityEngine();
  initExpandHandler();

  if (dynamicPayload.isDynamic) {
    setTimeout(() => {
      const collected = collectCaseInputs();
      CURRENT_DYNAMIC_PAYLOAD.caseInputs = collected;
      runDynamicEmailEngine();
    }, 150);

    setTimeout(() => {
      attachDelegationListeners(dynamicPayload, () => {
        const collected = collectCaseInputs();
        CURRENT_DYNAMIC_PAYLOAD.caseInputs = collected;
        runDynamicEmailEngine();
      });
    }, 250);

    renderEmailOutput({ template: [] });
  }

  // ======================================================
  // ⭐ TROUBLESHOOTING
  // ======================================================

  troubleshootingContainer.innerHTML = "";

  const ts = finalResult.troubleshooting;
  if (ts?.steps?.length || ts?.notes) {
    troubleshootingContainer.innerHTML =
      ts.steps.map(s => `<p>• ${s}</p>`).join("") +
      (ts.notes ? `<hr><p>${ts.notes}</p>` : "");
  }

  const schemaTS = finalResult?.caseOutput?.schema;
  if (schemaTS?.troubleshootingSteps?.length) {
    troubleshootingContainer.innerHTML =
      schemaTS.troubleshootingSteps.map(s => `<p>• ${s}</p>`).join("") +
      (schemaTS.troubleshootingNotes
        ? `<hr><p>${schemaTS.troubleshootingNotes}</p>`
        : "");
  }

  if (finalResult.tsMode === "keyword") {
    window.TSKT2.init(finalResult.tsPayload);
  }
}

