// ======================================================
//  logic.Data → loadEmailTemplates.js
//  PURPOSE: Load emailTemplates.json (static email bodies)
// ======================================================

export default async function loadEmailTemplates() {
    try {
        const response = await fetch('../../data/data.Library/library.Email/emailTemplates.json');

        if (!response.ok) {
            console.error("Failed to fetch emailTemplates.json:", response.status);
            return null;
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("Error loading emailTemplates.json:", err);
        return null;
    }
}