export default {
  dynamicId: "payments.manualRefund",
  enabled: true,

  fields: [
    "Manual Refund",              // dropdown trigger
    "Manual Refund Currency",     // ⭐ REAL multi-entry list
    "Date (Calendar)"             // calendar
  ],

  triggerField: "Manual Refund",

  keywords: [
    "manual refund",
    "refund",
    "refund processed",
    "refund confirmation"
  ],

  fieldAliases: {
    "Manual Refund Currency": [
      "ManualRefund",
      "manualRefundList",
      "refundList",
      "refundCurrencyList"
    ],
    "Date (Calendar)": [
      "refundDate",
      "calendarDate",
      "date"
    ]
  },

  templateKeys: ["Manual Refund"],

  templateLogic: {
    placeholders: {
      "Manual Refund Currency": "{{Manual Refund Currency}}",
      "Date (Calendar)": "{{Date (Calendar)}}"
    },

    templatesByTicketType: {
      "Manual Refund": [
        "I wanted to inform you that your manual refund was successfully processed on {{Date (Calendar)}}.",
        "",
        "Refund Details:",
        "{{Manual Refund Currency}}",
        "",
        "Please allow 5 to 7 business days for the funds to appear back in your account, depending on your bank’s processing time.",
        "If you do not see the refund after this period, please feel free to reach back out, and we’ll be happy to investigate further.",
        "",
        "Download your refund confirmation letter."
      ]
    }
  }
};

