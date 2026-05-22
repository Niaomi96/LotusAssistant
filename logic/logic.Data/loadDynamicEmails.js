// ======================================================
//  logic.Data → loadDynamicEmails.js
//  PURPOSE: Load dynamicEmails.json (dynamic email fields/templates)
// ======================================================

export default async function loadDynamicEmails() {
    try {
        const response = await fetch('../../data/data.Library/library.Email/dynamicEmails.json');

        if (!response.ok) {
            console.error("Failed to fetch dynamicEmails.json:", response.status);
            return null;
        }

        return await response.json();

    } catch (err) {
        console.error("Error loading dynamicEmails.json:", err);
        return null;
    }
}