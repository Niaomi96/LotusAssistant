// ======================================================
//  dynamicEmailDirectoryCaseInput.js
//  PURPOSE: Define EXACT fields, selectors, and placeholders
//           for each dynamic email module.
// ======================================================

export const dynamicEmailDirectoryCaseInput = {

  // ======================================================
  //  PAYMENTS — MANUAL REFUND MODULE
  // ======================================================
  "payments.manualRefund": {
    moduleName: "payments.manualRefund",
    triggerField: "Manual Refund",

    sectionSelector: "#schemaContainer .sectionContainer",

    fields: [
      {
        key: "Manual Refund",
        placeholder: "Manual Refund",
        selector: '[data-field="manualRefund"] select[data-label="Manual Refund"]',
        type: "dropdown"
      },

        {
        key: "Manual Refund Currency",
        placeholder: "Manual Refund Currency",
        selector: '.multiEntryWrapper[data-label="Manual Refund Currency"]',
        type: "multi-entry"
      },


      {
        key: "Date (Calendar)",
        placeholder: "Date (Calendar)",
        selector: '[data-field="Date (Calendar)"] input[type="date"]',
        type: "calendar"
      }
    ]
  },

  // ======================================================
  //  PAYMENTS — KYC INQUIRY MODULE
  // ======================================================
  "payments.kycInquiry": {
    moduleName: "payments.kycInquiry",
    triggerField: "What",

    sectionSelector: "#schemaContainer .sectionContainer",

    fields: [
      {
        key: "What",
        placeholder: "What",
        selector: '[data-field="what"] select[data-label="What"]',
        type: "dropdown"
      },

      {
        key: "Agent Name",
        placeholder: "Agent Name",
        selector: '[data-field="setupAgentName"] input[data-label="Agent Name"], [data-field="brokenAgentName"] input[data-label="Agent Name"]',
        type: "text"
      },

      {
        key: "Agent Email",
        placeholder: "Agent Email",
        selector: '[data-field="setupAgentEmail"] input[data-label="Agent Email"], [data-field="brokenAgentEmail"] input[data-label="Agent Email"]',
        type: "text"
      }
    ]
  },

  // ======================================================
  //  PAYMENTS — MONEY TRIBE MODULE
  // ======================================================
  "payments.moneyTribe": {
    moduleName: "payments.moneyTribe",
    triggerField: "What",

    sectionSelector: "#schemaContainer .sectionContainer",

    fields: [
      {
        key: "What",
        placeholder: "What",
        selector: '[data-field="what"] select[data-label="What"]',
        type: "dropdown"
      },

      {
        key: "No.1: Date (Calendar)",
        placeholder: "No.1: Date (Calendar)",
        selector: '[data-field="dateCalendar"][data-label="No.1: Date (Calendar)"] input[type="date"]',
        type: "calendar"
      },

      {
        key: "No.2: Date (Calendar)",
        placeholder: "No.2: Date (Calendar)",
        selector: '[data-field="dateCalendar"][data-label="No.2: Date (Calendar)"] input[type="date"]',
        type: "calendar"
      }
    ]
  },

  // ======================================================
  //  BILLING — BILLING MODULE
  // ======================================================
  "billing.billing": {
    moduleName: "billing.billing",
    triggerField: "What",

    sectionSelector: "#schemaContainer .sectionContainer",

    fields: [
      {
        key: "Who",
        placeholder: "Who",
        selector: '[data-field="who"] input[data-label="Who"]',
        type: "text"
      },
      {
        key: "What",
        placeholder: "What",
        selector: '[data-field="what"] select[data-label="What"]',
        type: "dropdown"
      }
    ]
  },

  // ======================================================
//  FEEDBACK REVIEW — NPS MODULE
// ======================================================
"feedbackReview.nps": {
  moduleName: "feedbackReview.nps",

  // The dropdown "Review" controls visibility of Case Number,
  // so it must be the trigger field.
  triggerField: "Review",

  sectionSelector: "#schemaContainer .sectionWrapper",

  fields: [
    {
      key: "Review",
      placeholder: "Review",
      selector: '[data-field="leavereview"] select[data-label="Review"]',
      type: "dropdown"
    },
    {
      key: "Case Number",
      placeholder: "Case Number",
      selector: '[data-field="caseNumber"] input[data-label="Case Number"]',
      type: "text",
      visibleWhen: { Review: "Y" }
    }
  ]
},


  // ======================================================
  //  PAYMENTS — ADYEN INQUIRY MODULE
  // ======================================================
  "payments.adyenInquiry": {
    moduleName: "payments.adyenInquiry",
    triggerField: "Adyen Ticket Type",

    sectionSelector: "#schemaContainer .sectionContainer",

    fields: [
      {
        key: "Adyen Ticket Type",
        placeholder: "Adyen Ticket Type",
        selector: '[data-field="adyenTicketType"] select[data-label="Adyen Ticket Type"]',
        type: "dropdown"
      },

      {
        key: "Volume Adjustment",
        placeholder: "volumeAdjustment",
        selector: '[data-field="volumeAdjustment"] select[data-label="Volume Adjustment"]',
        type: "dropdown"
      },

      {
        key: "Missing Funds",
        placeholder: "missingFundsList",
        selector: '.multiEntryWrapper[data-label="Missing Funds"]',
        type: "multi-entry"
      },

      {
        key: "Devices Not on Platform",
        placeholder: "devicesList",
        selector: '.multiEntryWrapper[data-label="Devices Not on Platform"]',
        type: "multi-entry"
      },

      {
        key: "Other",
        placeholder: "other",
        selector: '[data-field="other"] textarea[data-label="Other"]',
        type: "text"
      },

      {
        key: "Tax Form",
        placeholder: "taxForm",
        selector: null,
        type: "none"
      },

      {
        key: "Cancel Capital Offer",
        placeholder: "cancelCapitalOffer",
        selector: null,
        type: "none"
      },

      {
        key: "Resolved Adyen Inquiry",
        placeholder: "resolvedAdyenInquiry",
        selector: null,
        type: "none"
      },

      {
        key: "Account Name",
        placeholder: "accountName",
        selector: '[data-field^="accountNameSection"] input[data-label="Account Name"]',
        type: "text"
      },

      {
        key: "Account Holder Name",
        placeholder: "accountHolderName",
        selector: '[data-field^="accountHolderNameSection"] input[data-label="Account Holder Name"]',
        type: "text"
      },

      {
        key: "Account Holder ID",
        placeholder: "accountHolderId",
        selector: '[data-field^="accountHolderIdSection"] input[data-label="Account Holder ID"]',
        type: "text"
      },

      {
        key: "Account Reference Number",
        placeholder: "accountReferenceNumber",
        selector: '[data-field^="accountReferenceNumberSection"] input[data-label="Account Reference Number"]',
        type: "text"
      }
    ]
  }

};
