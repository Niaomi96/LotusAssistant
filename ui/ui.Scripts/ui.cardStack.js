// ======================================================
//  CARD STACK UI MODULE
// ======================================================

console.log("🟦 [CARD STACK] Loaded");

// ======================================================
//  MAIN INITIALIZER
// ======================================================
export function initCardStack() {
    const cards = document.querySelectorAll("#cardStack .card");

    if (!cards.length) {
        console.warn("🟦 [CARD STACK] No cards found");
        return;
    }

    // Default: show Case card
    showCard("case");
    attachCardHeaderListeners();
}

// ======================================================
//  CARD SWITCHING LOGIC
// ======================================================
export function showCard(cardName) {
    const cards = document.querySelectorAll("#cardStack .card");

    cards.forEach(card => {
        card.classList.remove("active", "behind1", "behind2");
    });

    const active = document.querySelector(`.card[data-card="${cardName}"]`);
    const others = [...cards].filter(c => c !== active);

    if (!active) return;

    active.classList.add("active");

    if (others[0]) others[0].classList.add("behind1");
    if (others[1]) others[1].classList.add("behind2");

    // Visual feedback for active tab
    document.querySelectorAll(".tabBtn").forEach(btn => btn.classList.remove("activeTab"));
    const activeBtn = document.getElementById(`${cardName}Header`);
    if (activeBtn) activeBtn.classList.add("activeTab");
}

// ======================================================
//  HEADER CLICK HANDLERS
// ======================================================
export function attachCardHeaderListeners() {
    const map = {
        caseHeader: "case",
        emailHeader: "email",
        troubleshootingHeader: "troubleshooting"
    };

    Object.entries(map).forEach(([id, card]) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("click", () => showCard(card));
        }
    });
}

// ======================================================
//  AUTO-INIT ON DOM LOAD
// ======================================================
document.addEventListener("DOMContentLoaded", initCardStack);
