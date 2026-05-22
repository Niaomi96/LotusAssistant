// ======================================================
//  HIDE & SEEK — Dynamic Field Visibility Engine (CASE ONLY)
// ======================================================

export function initVisibilityEngine() {
    // Run once after schema render
    updateVisibility();

    // Listen for ANY change inside schemaContainer ONLY
    document.addEventListener("change", (e) => {
        if (e.target.closest("#schemaContainer")) {
            updateVisibility();
        }
    });
}

// ======================================================
//  CORE VISIBILITY LOGIC — CASE LOGIC ONLY
// ======================================================

function updateVisibility() {
    const allRows = document.querySelectorAll("#schemaContainer .fieldRow");

    allRows.forEach(row => {
        const rule = row.dataset.visibleWhen;
        if (!rule) return; // No rule → always visible

        const visibleWhen = JSON.parse(rule);
        const [controllerLabel, expectedValue] = Object.entries(visibleWhen)[0];

        // Find the controlling field by LABEL (universal)
        const controller = document.querySelector(
            `#schemaContainer [data-label="${controllerLabel}"].fieldInput`
        );

        if (!controller) return;

        const currentValue = controller.value;
        let shouldShow = false;

        // ⭐ WILDCARD SUPPORT
        if (expectedValue === "*" || (Array.isArray(expectedValue) && expectedValue.includes("*"))) {
            shouldShow = true;
        }

        // ⭐ ARRAY SUPPORT
        else if (Array.isArray(expectedValue)) {
            shouldShow = expectedValue.includes(currentValue);
        }

        // ⭐ SINGLE VALUE SUPPORT
        else {
            shouldShow = currentValue === expectedValue;
        }

        // ⭐ SECTION SUPPORT
        if (row.dataset.type === "section") {
            row.style.display = shouldShow ? "flex" : "none";

            const children = row.querySelector(".fieldChildren");
            if (children && !shouldShow) {
                children.style.display = "none";
            }

            return;
        }

        // ⭐ ORIGINAL LOGIC
        row.style.display = shouldShow ? "flex" : "none";
    });
}