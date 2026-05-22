export default {
  dynamicId: "billing.billing",
  enabled: true,

  // Fields this module cares about
  fields: ["Who", "What"],

  // Trigger for template selection
  triggerField: "What",

  // Keywords for matching
  keywords: [
    "pay billing",
    "refusal to pay",
    "temporary access",
    "billing",
    "payment"
  ],

  // Aliases for UI → CaseData mismatches
  fieldAliases: {
    "Who": ["customer", "client", "name", "contact"],
    "What": ["billingtype", "billingreason", "billingaction"]
  },

  // Template keys
  templateKeys: [
    "Pay Billing",
    "Refusal to Pay",
    "Temporary Access"
  ],

  templateLogic: {
    placeholders: {
      "Who": "{{Who}}",
      "What": "{{What}}"
    },

    templatesByTicketType: {
      "Pay Billing": [
        "Dear {{Who}},",
        "",
        "Thank you for paying.",
        "",
        "Sincerely,",
        "Epos Now"
      ],

      "Refusal to Pay": [
        "Dear {{Who}},",
        "",
        "Your payment is still overdue.",
        "",
        "Sincerely,",
        "Epos Now"
      ],

      "Temporary Access": [
        "Dear {{Who}},",
        "",
        "You have 7 days of temporary access. Please remember to complete your payment before it expires.",
        "",
        "Sincerely,",
        "Epos Now"
      ]
    }
  }
};
