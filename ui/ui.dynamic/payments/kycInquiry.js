export default {
  dynamicId: "payments.kycInquiry",
  enabled: true,

  // These are the ONLY fields this email needs
  fields: ["What", "Agent Name", "Agent Email"],

  // ⭐ This drives template selection
  triggerField: "What",

  // ⭐ Keywords for matching
  keywords: [
    "setup kyc",
    "broken kyc",
    "kyc",
    "kyc setup",
    "kyc broken"
  ],

  // ⭐ Aliases based on schema fields
  fieldAliases: {
    "Agent Name": [
      "setupagentname",
      "brokenagentname",
      "agentname",
      "agent",
      "kycagent"
    ],
    "Agent Email": [
      "setupagentemail",
      "brokenagentemail",
      "agentemail",
      "email",
      "kycemail"
    ]
  },

  // ⭐ Template keys
  templateKeys: ["Setup KYC", "Broken KYC"],

  templateLogic: {
    placeholders: {
      "What": "{{What}}",
      "Agent Name": "{{Agent Name}}",
      "Agent Email": "{{Agent Email}}"
    },

    templatesByTicketType: {
      "Setup KYC": [
        "Please reach out to your KYC agent using the details provided below. You may contact them directly via email or by calling in and requesting to be connected.",
        "",
        "KYC Agent Name: {{Agent Name}}",
        "Email Address: {{Agent Email}}",
        "",
        "If you require any further assistance, please let us know."
      ],

      "Broken KYC": [
        "Please reach out to your KYC agent using the details provided below. You may contact them directly via email or by calling in and requesting to be connected.",
        "",
        "KYC Agent Name: {{Agent Name}}",
        "Email Address: {{Agent Email}}",
        "",
        "If you require any further assistance, please let us know."
      ]
    }
  }
};
