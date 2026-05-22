// ======================================================
//  logic.Data → loadFlatKeywords.js
//  PURPOSE: Load flatKeywords.json (flat keyword list)
// ======================================================

export default async function loadFlatKeywords() {
    try {
        const response = await fetch('../../data/data.keywords/flatKeywords.json');

        if (!response.ok) {
            console.error("Failed to fetch flatKeywords.json:", response.status);
            return null;
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("Error loading flatKeywords.json:", err);
        return null;
    }
}