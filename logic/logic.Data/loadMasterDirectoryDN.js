// ======================================================
//  logic.Data → loadMasterDirectoryDN.js
//  PURPOSE: Load MasterDirectoryDN.json (NESTED categories)
// ======================================================

export default async function loadMasterDirectoryDN() {
    try {
        const response = await fetch('../../data/data.Library/library.Master/MasterDirectoryDN.json');

        if (!response.ok) {
            console.error("Failed to fetch MasterDirectoryDN.json:", response.status);
            return null;
        }

        const data = await response.json();
        return data;   // ⭐ This is your nested array of category objects

    } catch (err) {
        console.error("Error loading MasterDirectoryDN.json:", err);
        return null;
    }
}