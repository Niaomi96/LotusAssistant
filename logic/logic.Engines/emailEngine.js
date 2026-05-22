// ======================================================
//  EMAIL ENGINE — CONNECTED TO DATAINDEX
// ======================================================

import Data from '../logic.Data/dataIndex.js';

// ------------------------------------------------------
//  MAIN ENTRY: Build email by emailId
// ------------------------------------------------------
export function generateEmailFromId(emailId, values = {}) {
    if (!emailId) {
        console.warn("⚠️ [EMAIL ENGINE] No emailId provided.");
        return { subject: "", body: "" };
    }

    const templates = Data.emailTemplates();
    const template = templates[emailId];

    console.log("📧 [EMAIL ENGINE] Incoming emailId:", emailId);

    if (!template) {
        console.warn("❌ [EMAIL ENGINE] No template found for:", emailId);
        return { subject: "", body: "" };
    }

    // ⭐ Inject id + emailId so engine always has a consistent identifier
    const enrichedTemplate = {
        ...template,
        id: emailId,      // <— REQUIRED for consistent engine behavior
        emailId           // keep original
    };

    return generateEmail(enrichedTemplate, values);
}

// ------------------------------------------------------
//  Build email from template object
// ------------------------------------------------------
export function generateEmail(template = {}, values = {}) {
    if (!template || typeof template !== "object") {
        console.warn("⚠️ [EMAIL ENGINE] Invalid template:", template);
        return { subject: "", body: "" };
    }

    console.log("📧 [EMAIL ENGINE] Generating email for:", template.id);

    let subject = template.subject || "";
    let body = template.body || "";

    // Convert array → string
    if (Array.isArray(body)) {
        body = body.join("\n");
    }

    subject = replacePlaceholders(subject, values);
    body = replacePlaceholders(body, values);

    return { subject, body };
}

// ------------------------------------------------------
//  Placeholder Replacement
// ------------------------------------------------------
function replacePlaceholders(text, values) {
    if (!text || typeof text !== "string") return text;

    return text.replace(/{{(.*?)}}/g, (match, key) => {
        const cleanKey = key.trim();
        return values[cleanKey] || "";
    });
}