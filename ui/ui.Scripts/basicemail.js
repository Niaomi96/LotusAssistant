// ======================================================
//  basicemail.js — Unified STATIC + DYNAMIC renderer
// ======================================================

export function renderEmailOutput(finalEmail) {
    const box = document.getElementById("emailOutput");
    if (!box) return;

    // If no email exists, clear the box
    if (!finalEmail) {
        box.innerText = "";
        return;
    }

    let content = "";

    // ⭐ 1. PURE DYNAMIC EMAIL (template array)
    if (Array.isArray(finalEmail.template) && finalEmail.template.length > 0) {
        content = finalEmail.template.join("\n");
    }

    // ⭐ 2. PURE STATIC EMAIL (subject + body)
    else if (finalEmail.subject || finalEmail.body) {
        const subject = finalEmail.subject || "";
        const body = finalEmail.body || "";

        // Add clean spacing and line breaks for readability
        content = [
            subject,
            "",
            body
        ].join("\n");
    }

    // ⭐ 3. HYBRID / FALLBACK
    else {
        content = "";
    }

    // ⭐ RENDER AS PLAIN TEXT (preserves line breaks)
    box.style.whiteSpace = "pre-wrap";
    box.innerText = content.trim();
}
