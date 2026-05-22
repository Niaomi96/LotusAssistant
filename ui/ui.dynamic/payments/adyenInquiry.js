export default {
  dynamicId: "payments.adyenInquiry",
  enabled: true,

  // Fields this module cares about
  fields: [
   
    "Adyen Ticket Type",
    "Volume Adjustment",
    "Missing Funds",
    "Devices Not on Platform",
    "Other",
    "Account Name",
    "Account Holder Name",
    "Account Holder ID",
    "Account Reference Number"
  ],

  // Trigger for template selection
  triggerField: "Adyen Ticket Type",

  // Keywords
  keywords: [
    "adyen",
    "missing funds",
    "volume adjustment",
    "enp",
    "not on platform",
    "tax form",
    "capital offer",
    "cancel capital",
    "adyen inquiry"
  ],

  // Aliases for UI → CaseData mismatches
  fieldAliases: {
   
    "Adyen Ticket Type": ["adyentickettype", "tickettype"],

    "Volume Adjustment": ["volumeadjustment"],
    "Missing Funds": ["missingfunds", "missingfundslist"],
    "Devices Not on Platform": ["devicesnotonplatform", "deviceslist"],
    "Other": ["otherdetails", "otherinfo"],

    "Account Name": ["accountname"],
    "Account Holder Name": ["accountholdername"],
    "Account Holder ID": ["accountholderid"],
    "Account Reference Number": ["accountreferencenumber"]
  },

  // Template keys
  templateKeys: [
    "Volume Adjustment",
    "Missing Funds",
    "ENP Not on Platform",
    "Tax Form",
    "Cancel Capital Offer",
    "Other",
    "Resolved Adyen Inquiry"
  ],

  templateLogic: {
    placeholders: {
    
      "Adyen Ticket Type": "{{Adyen Ticket Type}}",

      "Volume Adjustment": "{{volumeAdjustmentSentence}}",
      "Missing Funds": "{{missingFundsList}}",
      "Devices Not on Platform": "{{devicesList}}",
      "Other": "{{other}}",

      "Account Name": "{{accountName}}",
      "Account Holder Name": "{{accountHolderName}}",
      "Account Holder ID": "{{accountHolderId}}",
      "Account Reference Number": "{{accountReferenceNumber}}"
    },

    templatesByTicketType: {
      "Volume Adjustment": [
        "Dear Adyen Team,",
       
        "",
        "Client  called in wanting to update their volume, to: {{volumeAdjustmentSentence}}",
        "",
        "Account Information:",
        "Account Name: {{accountName}}",
        "Account Holder: {{accountHolderName}}",
        "Account Holder ID: {{accountHolderId}}",
        "Account Reference Number: {{accountReferenceNumber}}",
        "",
        "Thank you."
      ],

      "Missing Funds": [
        "Dear Adyen Team,",
       
        "",
        "Missing Funds:",
        "{{missingFundsList}}",
        "",
        "Account Information:",
        "Account Name: {{accountName}}",
        "Account Holder: {{accountHolderName}}",
        "Account Holder ID: {{accountHolderId}}",
        "Account Reference Number: {{accountReferenceNumber}}",
        "",
        "Thank you."
      ],

      "ENP Not on Platform": [
        "Dear Adyen Team,",
    
        "",
        "Devices Not on Platform:",
        "{{devicesList}}",
        "",
        "Account Information:",
        "Account Name: {{accountName}}",
        "Account Holder: {{accountHolderName}}",
        "Account Holder ID: {{accountHolderId}}",
        "Account Reference Number: {{accountReferenceNumber}}",
        "",
        "Thank you."
      ],

      "Tax Form": [
        "Dear Adyen Team,",
        "",
        "Tax form wont load on adyen portal.",
        "",
        "Account Information:",
        "Account Name: {{accountName}}",
        "Account Holder: {{accountHolderName}}",
        "Account Holder ID: {{accountHolderId}}",
        "Account Reference Number: {{accountReferenceNumber}}",
        "",
        "Thank you."
      ],

      "Cancel Capital Offer": [
        "Dear Adyen Team,",
         "",
        "Client will like to cancel the capital offer, that has been received.",
        "",
        "",
        "Account Information:",
        "Account Name: {{accountName}}",
        "Account Holder: {{accountHolderName}}",
        "Account Holder ID: {{accountHolderId}}",
        "Account Reference Number: {{accountReferenceNumber}}",
        "",
        "Thank you."
      ],

      "Other": [
        "Dear Adyen Team,",
       
        "",
        "Details: {{other}}",
        "",
        "Account Information:",
        "Account Name: {{accountName}}",
        "Account Holder: {{accountHolderName}}",
        "Account Holder ID: {{accountHolderId}}",
        "Account Reference Number: {{accountReferenceNumber}}",
        "",
        "Thank you."
      ],

      "Resolved Adyen Inquiry": [
        "We would like to inform you that your ticket has now been successfully resolved by Adyen.",
        "",
        "If you have any further questions or require additional assistance, please do not hesitate to contact us."
      ]
    }
  }
};
