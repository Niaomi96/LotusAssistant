// ======================================================
//  logic.Data → loadNested.js
//  PURPOSE: Load nested.json (category → subcategory map)
// ======================================================

export default async function loadNested() {
    try {
        const response = await fetch('../../data/data.FN/nested.json');

        if (!response.ok) {
            console.error("Failed to fetch nested.json:", response.status);
            return null;
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("Error loading nested.json:", err);
        return null;
    }
}