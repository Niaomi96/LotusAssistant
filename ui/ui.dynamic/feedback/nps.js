export default {
  dynamicId: "feedbackReview.nps",
  enabled: true,

  // Both fields exist in the schema
  fields: ["Review", "Case Number"],

  // Trigger comes from the dropdown
  triggerField: "Review",

  // Template key is the value of Review ("Y")
  templateKeys: ["Y"],

  fieldAliases: {
    "Review": ["leavereview", "review"],
    "Case Number": ["casenumber", "case_number", "case number", "case"]
  },

  templateLogic: {
    placeholders: {
      "Case Number": "{{Case Number}}"
    },

    // When Review = "Y", use this template
    templatesByTicketType: {
      "Y": [
        "When Case {{Case Number}} is closed, you’ll see a “Resolution Request.” Please don’t forget to leave your feedback and review.",
        "While I understand the frustration you’ve experienced, I also want to highlight the great representatives—like Niaomi James—who worked hard to support you and ensure your system is running smoothly again.",
        "You can also share your experience by leaving a review and mentioning Niaomi James directly in your comments:",
        "Trustpilot: https://www.trustpilot.com/evaluate/eposnow.com",
        "Better Business Bureau: https://www.bbb.org/us/fl/orlando/profile/point-of-sale-systems/epos-now-0733-90332889/leave-a-review",
        "Your feedback helps us improve our service and ensures that great reps like Niaomi James get the recognition they deserve.",
        "Thank you for your cooperation, and we appreciate your continued partnership."
      ]
    }
  }
};
