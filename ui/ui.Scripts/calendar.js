/* ============================================================
   UNIVERSAL CALENDAR FIELD RENDERER
   ============================================================ */

function applyCalendarFix() {
    // Select ANY input inside a field whose name contains "Calendar" or "Date"
    const calendarInputs = document.querySelectorAll(
        '[data-field*="Calendar"] input, [data-field*="Date"] input'
    );

    calendarInputs.forEach(input => {
        // Only convert if it's still text
        if (input.getAttribute("type") === "text") {
            input.setAttribute("type", "date");
        }
    });
}

/* ============================================================
   OBSERVER — WATCH FOR RENDERER UPDATES
   ============================================================ */

const observer = new MutationObserver(() => {
    applyCalendarFix();
});

/* Start observing the entire UI */
observer.observe(document.body, {
    childList: true,
    subtree: true
});

/* Run once on load */
document.addEventListener("DOMContentLoaded", applyCalendarFix);