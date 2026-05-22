// ======================================================
//  EXPAND HANDLER — Universal Section Collapsible Engine
// ======================================================

export function initExpandHandler() {
    // Run once after schema is rendered
    setupExpandableSections();

    // Re-run if schema changes dynamically (rare but safe)
    document.addEventListener("change", (e) => {
        if (e.target.closest("#schemaContainer")) {
            setupExpandableSections();
        }
    });
}

// ======================================================
//  CORE LOGIC — Find all sections & make them collapsible
// ======================================================

function setupExpandableSections() {
    const sectionRows = document.querySelectorAll(
        '#schemaContainer .fieldRow[data-type="section"]'
    );

    sectionRows.forEach(sectionRow => {
        // Prevent double-initializing
        if (sectionRow.dataset.expandInit === "true") return;
        sectionRow.dataset.expandInit = "true";

        const label = sectionRow.querySelector(".fieldLabel");
        const innerFields = sectionRow.querySelector(".fieldChildren");

        if (!label || !innerFields) return;

        // Create arrow icon
        const arrow = document.createElement("span");
        arrow.classList.add("expandArrow");
        arrow.textContent = "▶"; // collapsed default

        // Insert arrow before label text
        label.prepend(arrow);

        // Start collapsed
        innerFields.style.display = "none";

        // Toggle on click
        label.addEventListener("click", () => {
            const isCollapsed = innerFields.style.display === "none";

            innerFields.style.display = isCollapsed ? "block" : "none";
            arrow.textContent = isCollapsed ? "▼" : "▶";
        });
    });
}