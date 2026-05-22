// ======================================================
//  logic.Data → loadSchema.js
//  PURPOSE: Load schemalibrary.json (case definitions)
// ======================================================

export default async function loadSchema() {
    try {
        const response = await fetch('../../data/data.Library/library.schema/schemalibrary.json');

        if (!response.ok) {
            console.error("Failed to fetch schemalibrary.json:", response.status);
            return null;
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("Error loading schemalibrary.json:", err);
        return null;
    }
}