export default {
  dynamicId: "payments.moneyTribe",
  enabled: true,

  // Fields this module cares about
  fields: [
    "What",
    "No.1: Date (Calendar)",
    "No.2: Date (Calendar)"
  ],

  // Trigger for template selection
  triggerField: "What",

  // Keywords for matching
  keywords: [
    "funds won't transfer",
    "cutoff time change",
    "funds",
    "cutoff",
    "transfer"
  ],

  // Aliases for UI → CaseData mismatches
  fieldAliases: {
    "No.1: Date (Calendar)": [
      "datecalendar",
      "no1datecalendar",
      "date (calendar)",
      "date of transfer",
      "transferdate"
    ],
    "No.2: Date (Calendar)": [
      "datecalendar2",
      "no2datecalendar",
      "cutoffdate",
      "cutoff time change date"
    ]
  },

  templateKeys: [
    "Funds won't transfer",
    "Cutoff Time Change"
  ],

  templateLogic: {
    placeholders: {
      "What": "{{What}}",
      "No.1: Date (Calendar)": "{{No.1: Date (Calendar)}}",
      "No.2: Date (Calendar)": "{{No.2: Date (Calendar)}}"
    },

    templatesByTicketType: {
      "Funds won't transfer": [
        "We are pleased to inform you that your fund transfer issue has now been resolved.",
        "",
        "The funds were successfully transferred on {{No.1: Date (Calendar)}}.",
        "",
        "If you have any further questions or require additional assistance, please do not hesitate to contact us."
      ],

      "Cutoff Time Change": [
        "We would like to inform you that your payout cutoff time has been successfully updated, on {{No.2: Date (Calendar)}}.",
        "",
        "This change will take effect 24 hours after your next payout has been issued. This delay is required to prevent any splitting of upcoming payouts and to ensure accurate processing.",
        "",
        "Please note that payout cutoff times can only be updated once per day. Additional changes will not be permitted until the 24-hour window has passed.",
        "",
        "If you have any further questions or require additional assistance, please feel free to contact us."
      ]
    }
  }
};
