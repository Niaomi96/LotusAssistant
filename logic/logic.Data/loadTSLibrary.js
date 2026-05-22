// ======================================================
//  logic.Data → loadTSLibrary.js
//  PURPOSE: Load BOTH TS libraries (structure + real steps)
// ======================================================

export default async function loadTSLibrary() {
    try {
        const [masterResponse, tsResponse] = await Promise.all([
            fetch('../../data/data.Library/library.Master/masterTSlibrary.json'),
            fetch('../../data/data.Library/library.Troubleshooting/TSlibrary.json')
        ]);

        if (!masterResponse.ok) {
            console.error("❌ Failed to fetch masterTSlibrary.json:", masterResponse.status);
        }

        if (!tsResponse.ok) {
            console.error("❌ Failed to fetch TSlibrary.json:", tsResponse.status);
        }

        const masterTS = masterResponse.ok ? await masterResponse.json() : [];
        const tsLibrary = tsResponse.ok ? await tsResponse.json() : [];

        console.log("📚 [TS LOADER] Loaded TS libraries:", {
            masterTS: masterTS.length,
            tsLibrary: tsLibrary.length
        });

        return { masterTS, tsLibrary };

    } catch (err) {
        console.error("❌ Error loading TS libraries:", err);
        return { masterTS: [], tsLibrary: [] };
    }
}