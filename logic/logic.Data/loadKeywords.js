// ======================================================
//  logic.Data → loadKeywords.js
//  PURPOSE: Load keywords.json (detection dictionaries)
// ======================================================

export default async function loadKeywords() {
    try {
        const response = await fetch('../../data/data.keywords/keywords.json');

        if (!response.ok) {
            console.error("Failed to fetch keywords.json:", response.status);
            return null;
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("Error loading keywords.json:", err);
        return null;
    }
}